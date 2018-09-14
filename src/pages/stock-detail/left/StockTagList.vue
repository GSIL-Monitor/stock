<template>
    <div>
        <div
            class="tool_title"
            v-if="showTitle"
        >
            <span class="tool_title_circle"></span>
            <span class="tool_title_dsc">{{title}}</span>
        </div>
        <ul class="tool_list">
            <OneTag
                v-for="(item, index) of listData"
                :key="index" :title="item.name"
                :fields="item.fields"
            />
        </ul>
    </div>
</template>

<script>
import OneTag from './StockTagListItem'

export default {
    name: 'TagList',
    data() {
        return {}
    },
    components: {
        OneTag,
    },
    props: {
        showTitle: Boolean,
        title: String,
        listData: Array,
    },
}
</script>

<style>
</style>
