@props(['method' => 'get', 'action' => '', 'upload' => false])
@php $verb = strtolower($method); @endphp
<form method="{{ $verb === 'get' ? 'get' : 'post' }}" action="{{ $action }}" @if($upload) enctype="multipart/form-data" @endif {{ $attributes }}>
    @if($verb !== 'get') @csrf @endif
    @if(!in_array($verb, ['get', 'post'])) @method(strtoupper($verb)) @endif
    {{ $slot }}
</form>
