<template>
<div class="function_style">
    <div class="function_style_title">
        {{title}}
    </div>
    <div class="function_style_list">
        <FuncStyleItem
            v-for="(item, index) of list"
            :key="index"
            :text="item.text"
            :type="item.type"
            :on="item.on"
            :parentType="type"
        />
    </div>
</div>
</template>

<script>
import FuncStyleItem from './FuncStyleItem'

export default {
    name: 'TapeFuncStyle',
    components: {
        FuncStyleItem,
    },
    props: [
        'title',
        'type',
        'list',
    ],
}
</script>

<style lang="less">
.function_style_title {
    cursor: default;
    font-size: 12px;
    padding: 14px 3px 9px 3px;
}
.function_style_list {
    font-size: 12px;
}
</style>
