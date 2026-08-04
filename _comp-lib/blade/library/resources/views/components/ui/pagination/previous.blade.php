@props(['href'])
<x-ui.pagination.link :href="$href" label="Go to previous page" {{ $attributes->class('w-auto gap-1 px-2.5') }}><x-phosphor-caret-left aria-hidden="true" class="size-4" /><span class="hidden sm:block">Previous</span></x-ui.pagination.link>
