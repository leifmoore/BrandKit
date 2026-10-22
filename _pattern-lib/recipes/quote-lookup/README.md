# Quote lookup

A reference-entry dialog with loading, not-found, pending, expired, redeemed,
and ready-to-continue presentation states. The React preview searches only the
obviously fictional fixture records; the copyable core delegates lookup to its
host.

## Integration contract

React awaits `onLookup(reference)` and calls `onSelect(quote)` only for a found
pending quote. Blade either submits a normal GET form to `lookupAction` or
dispatches `ui:quote-lookup:action`; the server supplies `initialResult` on
render. Result DTOs contain presentation-ready booking and expiry labels plus
minor-unit price bounds.

The host scopes and authorises lookup, normalises references, determines
status, protects customer data, rate-limits requests, and owns the subsequent
redemption journey. Never expose the fixture-record adapter in production.
