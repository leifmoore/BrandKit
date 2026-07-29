<x-ui.button type="button" x-on:click="hide(); $dispatch('ui:alert-dialog:confirm')" {{ $attributes }}>{{ $slot }}</x-ui.button>
