# Quote builder

A neutral quote-draft modal that combines the selected booking summary, one or
more offered time bands, recipient details, an expiry preset, and a calculated
price range. It contains no persistence, email delivery, audit logging, or
partner identity.

## Integration contract

React calls `onSubmit(QuoteDraft)` and awaits a returned promise when supplied.
Blade dispatches `ui:quote-builder:change` for draft controls and
`ui:quote-builder:action` with `{ action: "submit", draft }`. All money is
integer minor units; expiry values are ISO-8601 timestamps.

The host verifies the recipient, availability, price, allowed expiry,
authorisation, delivery, storage, and error/success feedback. A production
Blade integration may replace the Alpine submit event with a normal Laravel
form action while retaining the same fields and composition.
