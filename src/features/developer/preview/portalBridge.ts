import * as React from "react";

import type { PreviewTheme } from "./types";

const THEME_CLASSES = [
  "preview-light",
  "preview-dark",
  "dark",
  "brand-default",
  "brand-blue",
  "brand-emerald",
  "brand-red",
  "brand-orange",
  "brand-slate",
  "brand-violet",
] as const;

const PORTAL_SELECTOR = [
  "[data-radix-popper-content-wrapper]",
  "[data-slot$='-overlay']",
  "[data-slot$='-content']",
  "[role='dialog']",
  "[data-sonner-toaster]",
  "[data-radix-portal]",
].join(",");

interface StyleValue {
  value: string;
  priority: string;
}

interface PortalSnapshot {
  attributes: Map<string, string | null>;
  classes: Map<string, boolean>;
  styles: Map<string, StyleValue>;
}

interface BridgeOptions {
  rootRef: React.RefObject<HTMLElement>;
  sessionKey: string;
  theme: PreviewTheme;
}

function bodyChildFor(element: Element): HTMLElement | null {
  let current: Element | null = element;
  while (current?.parentElement && current.parentElement !== document.body) {
    current = current.parentElement;
  }
  return current instanceof HTMLElement && current.parentElement === document.body
    ? current
    : null;
}

function isPortalCandidate(root: HTMLElement, added: Element): boolean {
  return (
    root.matches(PORTAL_SELECTOR) ||
    added.matches(PORTAL_SELECTOR) ||
    root.querySelector(PORTAL_SELECTOR) !== null
  );
}

/**
 * Copies the active preview scope to Radix/Sonner nodes that portal to body.
 * Ownership is armed only by an interaction inside this preview, so host-app
 * overlays are never globally themed and html/body are never modified.
 */
export function usePreviewPortalBridge({
  rootRef,
  sessionKey,
  theme,
}: BridgeOptions): void {
  const bridgeId = React.useId();
  const themeRef = React.useRef(theme);
  const ownedRootsRef = React.useRef(new Set<HTMLElement>());
  const snapshotsRef = React.useRef(new Map<HTMLElement, PortalSnapshot>());
  themeRef.current = theme;

  const applyTheme = React.useCallback(
    (element: HTMLElement) => {
      const activeTheme = themeRef.current;
      let snapshot = snapshotsRef.current.get(element);

      if (!snapshot) {
        const attributes = new Map<string, string | null>();
        for (const name of [
          "data-ds-preview-portal",
          "data-ui-theme",
          "data-ui-brand",
          "dir",
        ]) {
          attributes.set(name, element.getAttribute(name));
        }

        const classes = new Map<string, boolean>();
        for (const className of THEME_CLASSES) {
          classes.set(className, element.classList.contains(className));
        }

        const styles = new Map<string, StyleValue>();
        for (const property of Object.keys(activeTheme.style)) {
          if (property.startsWith("--")) {
            styles.set(property, {
              value: element.style.getPropertyValue(property),
              priority: element.style.getPropertyPriority(property),
            });
          }
        }
        for (const property of [
          "font-family",
          "font-size",
          "color",
          "color-scheme",
        ]) {
          styles.set(property, {
            value: element.style.getPropertyValue(property),
            priority: element.style.getPropertyPriority(property),
          });
        }

        snapshot = { attributes, classes, styles };
        snapshotsRef.current.set(element, snapshot);
      }

      for (const className of THEME_CLASSES) {
        element.classList.remove(className);
      }
      element.classList.add(
        activeTheme.mode === "dark" ? "preview-dark" : "preview-light",
        `brand-${activeTheme.brand}`,
      );
      if (activeTheme.mode === "dark") element.classList.add("dark");

      element.setAttribute("data-ds-preview-portal", bridgeId);
      element.setAttribute("data-ui-theme", activeTheme.mode);
      element.setAttribute("data-ui-brand", activeTheme.brand);
      element.setAttribute("dir", activeTheme.direction);

      for (const [property, value] of Object.entries(activeTheme.style)) {
        if (property.startsWith("--")) {
          element.style.setProperty(property, String(value));
        }
      }
      element.style.fontFamily = "var(--font-sans)";
      element.style.fontSize = "var(--font-size)";
      element.style.color = "var(--foreground)";
      element.style.colorScheme = activeTheme.mode;
    },
    [bridgeId],
  );

  const restore = React.useCallback((element: HTMLElement) => {
    const snapshot = snapshotsRef.current.get(element);
    if (!snapshot) return;

    for (const [name, value] of snapshot.attributes) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
    for (const [className, existed] of snapshot.classes) {
      element.classList.toggle(className, existed);
    }
    for (const [property, original] of snapshot.styles) {
      if (original.value) {
        element.style.setProperty(property, original.value, original.priority);
      } else {
        element.style.removeProperty(property);
      }
    }

    snapshotsRef.current.delete(element);
  }, []);

  React.useEffect(() => {
    for (const root of ownedRootsRef.current) applyTheme(root);
  }, [applyTheme, theme]);

  React.useEffect(() => {
    const previewRoot = rootRef.current;
    if (!previewRoot || typeof MutationObserver === "undefined") return;

    let armedUntil = 0;
    let bodyChildrenBeforeArm = new Set<Element>();
    const scheduledFrames = new Set<number>();

    const claimNewPortalRoots = () => {
      if (performance.now() > armedUntil) return;

      for (const child of document.body.children) {
        if (
          !(child instanceof HTMLElement) ||
          bodyChildrenBeforeArm.has(child) ||
          child.contains(previewRoot) ||
          !isPortalCandidate(child, child)
        ) {
          continue;
        }

        ownedRootsRef.current.add(child);
        applyTheme(child);
      }
    };

    const isHostCommandShortcut = (event: Event): event is KeyboardEvent =>
      event instanceof KeyboardEvent
      && (event.ctrlKey || event.metaKey)
      && event.key.toLowerCase() === "k";

    const arm = (event?: Event) => {
      // The Brand Kit command palette is global. When focus was restored to a
      // preview trigger after closing a portal, Ctrl/Cmd+K still originates
      // inside the preview DOM but the resulting portal belongs to the host.
      if (event && isHostCommandShortcut(event)) {
        armedUntil = 0;
        return;
      }

      // Covers delayed tooltips as well as synchronous dialog/menu portals.
      armedUntil = performance.now() + 2_000;
      bodyChildrenBeforeArm = new Set(document.body.children);

      // Some Radix portals commit late in the originating event and can land
      // before MutationObserver delivery. Scan after the event as a second,
      // ownership-safe path, limited to body children created after arming.
      queueMicrotask(claimNewPortalRoots);
      const frame = window.requestAnimationFrame(() => {
        scheduledFrames.delete(frame);
        claimNewPortalRoots();
      });
      scheduledFrames.add(frame);
    };
    const eventNames = [
      "pointerdown",
      "click",
      "keydown",
      "focusin",
      "mouseover",
    ] as const;
    const disarmFromOutside = (event: Event) => {
      if (isHostCommandShortcut(event)) {
        armedUntil = 0;
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) return;
      const belongsToOwnedPortal = [...ownedRootsRef.current].some((root) =>
        root.contains(target),
      );
      if (belongsToOwnedPortal) {
        // A menu/select opened from an already portalled dialog is still owned
        // by the same preview session.
        arm();
      } else if (
        performance.now() <= armedUntil
        && target instanceof Element
      ) {
        // Radix moves focus into a just-created portal before MutationObserver
        // delivery. Claim that new body child now instead of treating the
        // focus event as an unrelated host interaction and disarming early.
        const candidate = bodyChildFor(target);
        if (
          candidate
          && !bodyChildrenBeforeArm.has(candidate)
          && !candidate.contains(previewRoot)
          && isPortalCandidate(candidate, target)
        ) {
          ownedRootsRef.current.add(candidate);
          applyTheme(candidate);
          armedUntil = performance.now() + 2_000;
          return;
        }

        if (!previewRoot.contains(target)) armedUntil = 0;
      } else if (!previewRoot.contains(target)) {
        armedUntil = 0;
      }
    };
    for (const eventName of eventNames) {
      document.addEventListener(eventName, disarmFromOutside, true);
      previewRoot.addEventListener(eventName, arm, true);
    }

    const observer = new MutationObserver((mutations) => {
      if (performance.now() > armedUntil) return;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          const bodyChild = bodyChildFor(node);
          if (
            !bodyChild ||
            bodyChild.contains(previewRoot) ||
            !isPortalCandidate(bodyChild, node)
          ) {
            continue;
          }

          ownedRootsRef.current.add(bodyChild);
          applyTheme(bodyChild);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      for (const frame of scheduledFrames) window.cancelAnimationFrame(frame);
      scheduledFrames.clear();
      for (const eventName of eventNames) {
        document.removeEventListener(eventName, disarmFromOutside, true);
        previewRoot.removeEventListener(eventName, arm, true);
      }
      for (const root of ownedRootsRef.current) restore(root);
      ownedRootsRef.current.clear();
    };
  }, [applyTheme, restore, rootRef, sessionKey]);
}
