# Booking details dialog

A read/action dialog composed from Dialog, Badge and Button. Mutations,
permissions and currency/date formatting stay in the host.

## Fixture adapter

Pass the entire fixture as `booking`. A React preview owns `open`, provides
`onOpenChange`, and supplies `onReschedule` and `onCancel` to enable those
actions. The trigger remains outside the controlled React recipe so the host
can demonstrate any launch context.

Blade includes a neutral View booking trigger and accepts optional `open`,
`dialogId`, `canReschedule` and `canCancel` props. It dispatches
`reschedule-booking` and `cancel-booking` with the booking object as
`event.detail`. Give `dialogId` a unique value when rendering more than one
instance on a page.
