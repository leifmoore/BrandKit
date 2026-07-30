@props(['name', 'value' => '', 'length' => 6, 'label' => 'One-time password'])
<div data-slot="input-otp" role="group" aria-label="{{ $label }}" x-data="uiOtp(@js($value), @js((int)$length))" x-on:paste="paste($event)" {{ $attributes->class('flex items-center') }}><input type="hidden" name="{{ $name }}" x-model="value">{{ $slot }}</div>
