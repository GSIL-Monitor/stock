<template>
    <ul class="lt_title">
        <li
            v-for="item in tabData"
            :key="item.emitId"
            :class="getClass(item.emitId, item.className)"
            @click="toggleTab(item.emitId)"
        >
            <span class="lt_title_dsc">{{item.title}}</span>
            <span class="lt_title_line"></span>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'leftTitle',
        data() {
            return {
                tabData: [
                    {
                        title: '推荐标签',
                        className: 'lt_title_tag',
                        emitId: 'tag'
                    },
                    {
                        title: '自选股',
                        className: 'lt_title_stock',
                        emitId: 'stock'
                    },
                    {
                        title: '最近访问',
                        className: 'lt_title_recent',
                        emitId: 'recent'
                    },
                ],
                currentTab: 'stock',
            }
        },
        computed: {

        },
        methods: {
            getClass(id, className) {
                return {
                    [className]: true,
                    active: this.currentTab === id,
                }
            },
            toggleTab(tab) {
                if (tab === this.currentTab) return
                this.currentTab = tab

                this.$emit('tab', tab)
            },
        },
        props: {
        }
    }
</script>

<style lang="less">

</style>
