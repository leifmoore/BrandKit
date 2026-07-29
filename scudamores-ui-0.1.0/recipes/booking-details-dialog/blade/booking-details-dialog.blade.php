@props(['booking', 'open' => false, 'dialogId' => 'booking-details-dialog', 'canReschedule' => true, 'canCancel' => true])
@php($variant = match ($booking['status']) { 'Active' => 'success', 'Cancelled' => 'destructive', 'Rescheduled' => 'warning', default => 'secondary' })

<x-ui.dialog :open="$open">
    <x-ui.dialog.trigger aria-haspopup="dialog" class="inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium text-foreground outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-input dark:bg-input/30 dark:hover:bg-input/50">View booking</x-ui.dialog.trigger>
    <x-ui.dialog.content aria-labelledby="{{ $dialogId }}-title" aria-describedby="{{ $dialogId }}-description">
        <x-ui.dialog.header>
            <x-ui.dialog.title id="{{ $dialogId }}-title">Booking details</x-ui.dialog.title>
            <x-ui.dialog.description id="{{ $dialogId }}-description" class="sr-only">Details and available actions for booking {{ $booking['id'] }}.</x-ui.dialog.description>
        </x-ui.dialog.header>
        <dl class="grid grid-cols-2 gap-4 text-sm">
            <div><dt class="text-muted-foreground">Reference</dt><dd class="font-mono font-semibold">{{ $booking['id'] }}</dd></div>
            <div><dt class="text-muted-foreground">Status</dt><dd><x-ui.badge :variant="$variant">{{ $booking['status'] }}</x-ui.badge></dd></div>
            <div><dt class="text-muted-foreground">Customer</dt><dd>{{ $booking['customerName'] }}<br>{{ $booking['customerEmail'] }}</dd></div>
            <div><dt class="text-muted-foreground">Date and time</dt><dd>{{ $booking['date'] }}<br>{{ $booking['time'] }}</dd></div>
            <div class="col-span-2"><dt class="text-muted-foreground">Items</dt><dd>{{ $booking['items'] }}</dd></div>
            <div><dt class="text-muted-foreground">Total</dt><dd class="font-semibold">{{ $booking['total'] }}</dd></div>
        </dl>
        <x-ui.dialog.footer>
            <x-ui.button variant="outline" :disabled="!$canReschedule || $booking['status'] !== 'Active'" x-on:click="$dispatch('reschedule-booking', @js($booking))">Reschedule</x-ui.button>
            <x-ui.button variant="destructive" :disabled="!$canCancel || $booking['status'] === 'Cancelled'" x-on:click="$dispatch('cancel-booking', @js($booking))">Cancel booking</x-ui.button>
        </x-ui.dialog.footer>
    </x-ui.dialog.content>
</x-ui.dialog>
