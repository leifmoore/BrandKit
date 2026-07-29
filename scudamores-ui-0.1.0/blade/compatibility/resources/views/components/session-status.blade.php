@props(['status'])
@if($status)<x-ui.sonner><x-ui.sonner.toast title="Success" {{ $attributes }}>{{ $status }}</x-ui.sonner.toast></x-ui.sonner>@endif
