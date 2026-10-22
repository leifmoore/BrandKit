# Collection state panel

A shared visual and semantic treatment for loading, empty, error, and restricted collection states. The pattern prevents individual pages from inventing inconsistent placeholders or exposing authorization internals.

The host selects the state and owns fetching, retry behavior, access decisions, and support escalation. React invokes `onAction`; Blade dispatches `ui:collection-state-panel:action`. Never infer a restricted state in the browser or include permission names in public copy.

Loading uses `aria-busy` and one concise status message. Errors use `role="alert"`; empty and restricted states use `role="status"`. Avoid repeatedly remounting live regions during polling.
