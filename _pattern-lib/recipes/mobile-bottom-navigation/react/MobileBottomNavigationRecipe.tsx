"use client";

import * as React from "react";
import {
  BarChart3,
  CalendarDays,
  Home,
  LayoutGrid,
  MoreHorizontal,
  Settings,
  ShoppingCart,
  Ticket,
  User,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@scudamores/ui/components/ui/sheet";

export type MobileNavigationIcon =
  | "calendar"
  | "chart-bar"
  | "gear"
  | "house"
  | "shopping-cart"
  | "squares-four"
  | "ticket"
  | "user";

export interface MobileNavigationItem {
  id: string;
  label: string;
  icon: MobileNavigationIcon;
  badge?: string;
  disabled?: boolean;
}

export type MobilePrimaryItems =
  | readonly [MobileNavigationItem, MobileNavigationItem, MobileNavigationItem]
  | readonly [MobileNavigationItem, MobileNavigationItem, MobileNavigationItem, MobileNavigationItem];

export interface MobileBottomNavigationRecipeProps {
  items: MobilePrimaryItems;
  activeId: string;
  onNavigate: (id: string) => void;
  overflowItems?: readonly MobileNavigationItem[];
  moreLabel?: string;
  ariaLabel?: string;
  actionDockActive?: boolean;
  hideForFinePointer?: boolean;
}

const icons: Record<MobileNavigationIcon, LucideIcon> = {
  calendar: CalendarDays,
  "chart-bar": BarChart3,
  gear: Settings,
  house: Home,
  "shopping-cart": ShoppingCart,
  "squares-four": LayoutGrid,
  ticket: Ticket,
  user: User,
};

function NavigationItemContent({ item, active }: { item: MobileNavigationItem; active: boolean }) {
  const Icon = icons[item.icon];

  return (
    <>
      <span className={`relative ${active ? "text-primary" : "text-muted-foreground"}`}>
        <Icon aria-hidden="true" className="size-5" />
        {item.badge ? (
          <Badge className="absolute -right-3 -top-3 min-w-5 px-1 py-0 text-[10px]" aria-label={`${item.badge} notifications`}>
            {item.badge}
          </Badge>
        ) : null}
      </span>
      <span className={`max-w-full truncate text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
    </>
  );
}

/**
 * Compact application navigation for coarse-pointer viewports. The host owns
 * route mapping and destination filtering; this recipe emits stable item IDs.
 */
export function MobileBottomNavigationRecipe({
  items,
  activeId,
  onNavigate,
  overflowItems = [],
  moreLabel = "More",
  ariaLabel = "Primary navigation",
  actionDockActive = false,
  hideForFinePointer = true,
}: MobileBottomNavigationRecipeProps) {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const hasActiveOverflowItem = overflowItems.some((item) => item.id === activeId);

  // A task-specific contextual dock and app navigation compete for the same
  // safe-area edge. The host declares priority rather than allowing overlap.
  if (actionDockActive) return null;

  return (
    <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
      <nav
        aria-label={ariaLabel}
        className={`${hideForFinePointer ? "[@media(pointer:fine)]:hidden " : ""}fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border bg-sidebar text-sidebar-foreground`}
      >
        <div className="mx-auto flex max-w-lg items-stretch px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {items.map((item) => {
            const current = item.id === activeId;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className="h-auto min-h-12 min-w-0 flex-1 flex-col gap-1 px-1 py-2"
                aria-current={current ? "page" : undefined}
                disabled={item.disabled}
                onClick={() => onNavigate(item.id)}
              >
                <NavigationItemContent item={item} active={current} />
              </Button>
            );
          })}

          {overflowItems.length > 0 ? (
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto min-h-12 min-w-0 flex-1 flex-col gap-1 px-1 py-2"
                aria-current={hasActiveOverflowItem ? "page" : undefined}
              >
                <MoreHorizontal aria-hidden="true" className={hasActiveOverflowItem ? "size-5 text-primary" : "size-5 text-muted-foreground"} />
                <span className="max-w-full truncate text-xs">{moreLabel}</span>
              </Button>
            </SheetTrigger>
          ) : null}
        </div>
      </nav>

      <SheetContent side="bottom" className="rounded-t-xl pb-[env(safe-area-inset-bottom)]">
        <SheetHeader>
          <SheetTitle>{moreLabel}</SheetTitle>
          <SheetDescription>Additional destinations</SheetDescription>
        </SheetHeader>
        <div className="grid gap-1 px-4 pb-4">
          {overflowItems.map((item) => {
            const current = item.id === activeId;
            const Icon = icons[item.icon];

            return (
              <Button
                key={item.id}
                variant={current ? "secondary" : "ghost"}
                className="justify-start"
                aria-current={current ? "page" : undefined}
                disabled={item.disabled}
                onClick={() => {
                  onNavigate(item.id);
                  setMoreOpen(false);
                }}
              >
                <Icon aria-hidden="true" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export interface MobileBottomNavigationFixture {
  items: MobileNavigationItem[];
  activeId: string;
  overflowItems?: MobileNavigationItem[];
  moreLabel?: string;
  hideForFinePointer?: boolean;
}

/** Stateful fixture adapter for the documentation preview. */
export function MobileBottomNavigationPreview(fixture: MobileBottomNavigationFixture) {
  const [activeId, setActiveId] = React.useState(fixture.activeId);
  let items: MobilePrimaryItems;

  if (fixture.items.length === 3) {
    items = [fixture.items[0], fixture.items[1], fixture.items[2]];
  } else if (fixture.items.length === 4) {
    items = [fixture.items[0], fixture.items[1], fixture.items[2], fixture.items[3]];
  } else {
    throw new RangeError("Mobile bottom navigation fixtures require three or four primary items.");
  }

  return (
    <MobileBottomNavigationRecipe
      {...fixture}
      items={items}
      activeId={activeId}
      onNavigate={setActiveId}
    />
  );
}
