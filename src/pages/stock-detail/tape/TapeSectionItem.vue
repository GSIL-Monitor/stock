<template>
<div class="case_item">
    <div class="case_item_title">{{title}}</div>
    <ul class="case_content_title">
        <li
            v-for="(item, index) of list"
            :key="index"
            @click="itemClick(item.type)"
            :class="{active: item.type === activeType}"
        >
            {{item.text}}
        </li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'TapeSectionItem',
    methods: {
        itemClick(type) {
            if (this.activeType === type) {
                return false
            } else {
                this.$eventBus.$emit('dataChanged', {
                    parentType: this.type,
                    type,
                    changed: {
                        activeType: type
                    },
                })
            }
        },
    },
    props: [
        'title',
        'list',
        'type',
        'activeType',
    ],
}
</script>

<style lang="less">
.case_item {
    padding-bottom: 16px;
}
.case_item_title {
    font-size: 12px;
    color: var(--color-primary-text);
    padding: 14px 3px 9px 3px;
}
.case_content_title {
    display: flex;
    font-size: 11px;
    li {
        flex: 1;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 1px;
        color: var(--color-primary-text);
        background-color: var(--color-smallcard-background);
        cursor: pointer;
        &:first-child {
            margin-left: 0;
        }
        &.active {
            color: var(--color-white);
            background-color: var(--color-selected);
        }
    }
}
</style>