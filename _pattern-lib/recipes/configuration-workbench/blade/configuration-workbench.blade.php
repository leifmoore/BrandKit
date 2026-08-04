@props([
    'title',
    'description',
    'status' => null,
    'statusVariant' => 'secondary',
    'defaultTab' => 'details',
    'fields' => [],
    'enabled' => true,
    'previewTitle' => 'Preview',
    'previewDescription' => '',
    'handoffCode' => '',
    'dirty' => false,
    'showBack' => true,
    'showSave' => true,
    'saveLabel' => 'Save configuration',
])

<x-ui.card data-pattern="configuration-workbench" x-data="{ dirty: @js($dirty), enabled: @js($enabled), copied: false }">
    <x-ui.card.header>
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
                @if ($showBack)
                    <x-ui.button variant="ghost" size="icon" aria-label="Back to configurations" x-on:click="$dispatch('ui:configuration-workbench:action', { action: 'back' })"><x-phosphor-arrow-left aria-hidden="true" /></x-ui.button>
                @endif
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <x-ui.card.title>{{ $title }}</x-ui.card.title>
                        @if ($status)<x-ui.badge :variant="$statusVariant">{{ $status }}</x-ui.badge>@endif
                        <span x-cloak x-show="dirty" class="text-xs text-muted-foreground">Unsaved changes</span>
                    </div>
                    <x-ui.card.description class="mt-1">{{ $description }}</x-ui.card.description>
                </div>
            </div>
            @if ($showSave)
                <x-ui.button x-bind:disabled="!dirty" x-on:click="dirty = false; $dispatch('ui:configuration-workbench:action', { action: 'save' })"><x-phosphor-floppy-disk aria-hidden="true" />{{ $saveLabel }}</x-ui.button>
            @endif
        </div>
    </x-ui.card.header>
    <x-ui.card.content>
        <x-ui.tabs :default-value="$defaultTab" x-on:ui:tabs:change="$dispatch('ui:configuration-workbench:change', { field: 'tab', value: $event.detail.value })">
            <div class="overflow-x-auto pb-1">
                <x-ui.tabs.list class="w-max min-w-full justify-start">
                    <x-ui.tabs.trigger value="details" class="text-foreground/80 data-[state=active]:text-foreground">Details</x-ui.tabs.trigger>
                    <x-ui.tabs.trigger value="options" class="text-foreground/80 data-[state=active]:text-foreground">Options</x-ui.tabs.trigger>
                    <x-ui.tabs.trigger value="preview" class="text-foreground/80 data-[state=active]:text-foreground">Preview</x-ui.tabs.trigger>
                    <x-ui.tabs.trigger value="handoff" class="text-foreground/80 data-[state=active]:text-foreground">Handoff</x-ui.tabs.trigger>
                </x-ui.tabs.list>
            </div>

            <x-ui.tabs.content value="details" class="mt-5">
                @isset($details)
                    {{ $details }}
                @else
                    <div class="grid gap-4 sm:grid-cols-2">
                        @foreach ($fields as $field)
                            <x-ui.input
                                :name="'configuration_'.$field['id']"
                                :label="$field['label']"
                                :value="$field['value']"
                                x-on:input="dirty = true; $dispatch('ui:configuration-workbench:change', { field: @js($field['id']), value: $event.target.value })"
                            />
                        @endforeach
                    </div>
                @endisset
            </x-ui.tabs.content>

            <x-ui.tabs.content value="options" class="mt-5">
                @isset($options)
                    {{ $options }}
                @else
                    <div class="flex items-center justify-between gap-4 rounded-lg border p-4">
                        <span><span class="block text-sm font-medium">Enabled</span><span class="block text-xs text-muted-foreground">Make this configuration available to the host application.</span></span>
                        <x-ui.switch x-model="enabled" aria-label="Configuration enabled" x-on:ui:switch:change="enabled = $event.detail.value; dirty = true; $dispatch('ui:configuration-workbench:change', { field: 'enabled', value: enabled })" />
                    </div>
                @endisset
            </x-ui.tabs.content>

            <x-ui.tabs.content value="preview" class="mt-5">
                @isset($preview)
                    {{ $preview }}
                @else
                    <div class="mx-auto max-w-sm rounded-[2rem] border-8 border-foreground/15 bg-background p-4 shadow-sm">
                        <div class="rounded-xl border bg-card p-5 text-card-foreground"><h3 class="font-semibold">{{ $previewTitle }}</h3><p class="mt-1 text-sm text-muted-foreground">{{ $previewDescription }}</p><x-ui.button class="mt-5 w-full" x-bind:disabled="!enabled">Continue</x-ui.button></div>
                    </div>
                @endisset
            </x-ui.tabs.content>

            <x-ui.tabs.content value="handoff" class="mt-5">
                @isset($handoff)
                    {{ $handoff }}
                @else
                    <div class="space-y-3"><div><h3 class="font-medium">Implementation snippet</h3><p class="text-sm text-muted-foreground">The host generates and validates this value.</p></div><pre class="overflow-x-auto rounded-lg bg-muted p-4 text-xs"><code>{{ $handoffCode }}</code></pre><x-ui.button variant="outline" x-on:click="copied = true; $dispatch('ui:configuration-workbench:action', { action: 'copy-handoff' })"><x-phosphor-copy aria-hidden="true" /><span x-text="copied ? 'Copied' : 'Copy snippet'">Copy snippet</span></x-ui.button></div>
                @endisset
            </x-ui.tabs.content>
        </x-ui.tabs>
    </x-ui.card.content>
</x-ui.card>
