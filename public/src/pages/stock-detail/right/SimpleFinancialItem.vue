<template>
    <li>
        <span>{{text}}</span>
        <span :class="[className]">
            {{val}}
        </span>
    </li>
</template>

<script>
    export default {
        name: 'financialItem',
        props: [
            'text',
            'className',
            'val'
        ]
    }
</script>

