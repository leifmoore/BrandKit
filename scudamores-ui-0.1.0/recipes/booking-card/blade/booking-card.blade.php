@props(['booking'])
@php($variant = match ($booking['status']) { 'Active' => 'success', 'Cancelled' => 'destructive', 'Rescheduled' => 'warning', default => 'secondary' })

<x-ui.card>
    <x-ui.card.content class="flex items-center justify-between gap-3 p-4">
        <span class="min-w-0"><span class="block truncate font-medium">{{ $booking['customerName'] }}</span><span class="block truncate text-sm text-muted-foreground">{{ $booking['customerEmail'] }}</span><span class="mt-1 block font-mono text-xs text-muted-foreground">{{ $booking['id'] }}</span></span>
        <span class="flex shrink-0 flex-col items-end gap-2"><x-ui.badge :variant="$variant">{{ $booking['status'] }}</x-ui.badge><x-ui.button variant="outline" size="sm" x-on:click="$dispatch('view-booking', @js($booking))"><x-phosphor-eye aria-hidden="true" class="size-4" />View</x-ui.button></span>
    </x-ui.card.content>
</x-ui.card>
