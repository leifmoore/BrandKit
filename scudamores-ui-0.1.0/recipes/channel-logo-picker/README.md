# Channel logo picker

A host-controlled logo selector. React receives an upload callback; Blade uses
ordinary multipart form submission. The recipe owns no storage or upload API.

## Fixture adapter

The fixture's `showLogo`, `selectedLogoId` and `logos` map directly to both
editions. A React preview owns the first two values in state and wires
`onShowLogoChange` and `onSelectedLogoChange`. Supplying `onUpload(file)` makes
the React upload action visible.

Blade keeps preview state in Alpine and dispatches `show-logo-change` and
`logo-change`; both expose the new value as `event.detail.value`. Set
`canUpload` to render the ordinary named file input inside a multipart form.
Set a unique `idPrefix` when rendering multiple pickers on one page. This
native Blade upload treatment is an intentional framework difference.
