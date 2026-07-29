<x-ui.button variant="default" :href="$attributes->get('href')" {{ $attributes->except('href') }}>{{ $slot }}</x-ui.button>
