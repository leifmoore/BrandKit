@props(['href'])
<x-ui.pagination.link :href="$href" label="Go to next page" {{ $attributes->class('w-auto gap-1 px-2.5') }}><span class="hidden sm:block">Next</span><x-phosphor-caret-right aria-hidden="true" class="size-4" /></x-ui.pagination.link>
