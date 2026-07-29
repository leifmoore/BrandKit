@props(['route' => null, 'type' => 'manage'])
<x-ui.button :href="$route" :variant="$type === 'delete' ? 'destructive' : 'default'" size="sm" {{ $attributes }}>{{ $slot->isNotEmpty() ? $slot : ucfirst($type) }}</x-ui.button>
