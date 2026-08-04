# Checkout Details Panel

This composition collects customer contact fields and optionally reveals
operational metadata. The host supplies values, validation errors, available
metadata options and submission behavior.

React is controlled and does not persist data. Blade retains named form fields
and server-submission semantics through the base form controls. Move focus to
the first invalid field after a failed submission and announce server failures
outside the recipe using the shared collection-state or alert primitives.
