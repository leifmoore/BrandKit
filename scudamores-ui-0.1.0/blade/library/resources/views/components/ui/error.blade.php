@error($field, $bag)
    <p id="{{ $id }}" role="alert" {{ $attributes->class('text-sm font-medium text-destructive') }}>{{ $slot->isEmpty() ? ($value ?? $message) : $slot }}</p>
@enderror
