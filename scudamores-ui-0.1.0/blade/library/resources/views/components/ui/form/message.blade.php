@props(['for', 'bag' => 'default'])
<x-ui.error :for="$for" :bag="$bag" {{ $attributes }}>{{ $slot }}</x-ui.error>
