@props(['title' => null, 'subtitle' => null])
<header data-slot="page-header" {{ $attributes->class('flex min-w-0 items-start justify-between gap-4 max-md:flex-col') }}>
    <div class="min-w-0">
        <h1 class="truncate text-2xl font-medium text-foreground">{{ $title ?? $heading ?? $slot }}</h1>
        @if($subtitle)<p class="mt-1 text-sm text-muted-foreground">{{ $subtitle }}</p>@endif
    </div>
    @isset($actions)<div class="flex shrink-0 items-center gap-2">{{ $actions }}</div>@endisset
</header>
