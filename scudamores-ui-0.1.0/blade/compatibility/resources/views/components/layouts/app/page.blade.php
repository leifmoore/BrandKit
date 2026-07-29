@props(['heading' => '', 'subheading' => '', 'contentClass' => 'max-w-screen-xl'])
<x-ui.page-container {{ $attributes }}><x-ui.page-header :title="$heading" :subtitle="$subheading" /><div @class(['mt-5 min-w-0 w-full max-w-full', $contentClass])>{{ $slot }}</div></x-ui.page-container>
