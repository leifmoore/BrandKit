@props(['active' => false])
<x-ui.badge :variant="$active ? 'success' : 'destructive'" dot {{ $attributes }}>{{ $active ? 'Active' : 'Inactive' }}</x-ui.badge>
