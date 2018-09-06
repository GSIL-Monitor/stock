<template>
    <li
        class="tab_switch_one"
        :class="[isActive ? 'active' : '']"
        @click.stop="emitType"
    >{{text}}</li>
</template>

<script>
export default {
    name: 'tabSwitchItem',
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
        background-color: rgba(255,255,255,.09);
    }
    .tab_switch_one.active {
        background-color: #252527;
        color: #1890FF;
    }
</style>