@props(['name', 'id' => null, 'value' => '', 'label' => '', 'bag' => 'default', 'checked' => false])
<x-ui.radio :name="$name" :id="$id" :value="$value" :label="$label" :bag="$bag" :checked="$checked" {{ $attributes }}>{{ $slot }}</x-ui.radio>
