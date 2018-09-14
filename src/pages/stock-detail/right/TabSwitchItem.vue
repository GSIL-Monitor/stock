<template>
    <li
        class="tab_switch_one"
        :class="[isActive ? 'active' : '']"
        @click.stop="emitType"
    >{{text}}</li>
</template>

<script>
export default {
    name: 'TabSwitchItem',
    methods: {
        emitType() {
            this.$emit('switch', this.type)
        },
    },
    props: [
        "text",
        "type",
        "isActive",
    ],
}
</script>

<style>
    .tab_switch_one {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-right: 1px solid var(--color-border);
        color: var(--color-primary-text);

    }
    .tab_switch_one.active {
        background: var(--color-card-background);
        color: var(--color-selected);
    }
</style>