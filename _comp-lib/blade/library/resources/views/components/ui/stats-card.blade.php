@props(['label', 'value', 'description' => null])
<x-ui.card {{ $attributes }}><x-ui.card.header><x-ui.card.description>{{ $label }}</x-ui.card.description><x-ui.card.title class="text-2xl font-semibold tabular-nums">{{ $value }}</x-ui.card.title></x-ui.card.header>@if($description)<x-ui.card.content class="text-sm text-muted-foreground">{{ $description }}</x-ui.card.content>@endif</x-ui.card>
