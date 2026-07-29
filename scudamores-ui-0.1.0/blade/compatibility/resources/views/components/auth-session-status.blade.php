@props(['status'])
@if($status)<x-ui.alert role="status" class="border-status-success/30 text-status-success-foreground" {{ $attributes }}>{{ $status }}</x-ui.alert>@endif
