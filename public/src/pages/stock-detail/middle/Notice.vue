<template>
<div
    class="info_wrap"
>
    <div
        class="info_vessel"
        v-show="dataStore.length"
        v-infinite-scroll="loadMoreData"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="80"
        ref="scrollContainer"
    >
        <table
            v-if="dataStore.length"
            class="info_vessel_table"
            @click="handleClick"
        >
            <tbody>
                <tr
                    v-for="(item, index) of dataStore"
                    :key="index"
                    class="info_tr"
                >
                    <td
                        class="info_ellipsis_td"
                    >
                        <span
                            class="td-openContent"
                            :data-index="index"
                            :title="item.title"
                        >
                            {{item.title}}
                        </span>
                    </td>
                    <td
                        class="info_ico_td"
                    >
                        <span
                            :class="['stockDetial-read-pdf', formatIco(item.file_type)]"
                        >
                        </span>
                    </td>
                    <td
                        class="info_date_td"
                    >
                        {{formatDate(item.date)}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div
        v-if="noData"
        class="extend_nodata"
    >{{noDataMsg}}</div>
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import {
    getNoticeList,
    getIndexNotice,
} from '@service/'
import formatInfoDate from '@formatter/information/date'
import fileType from '@formatter/information/fileType'

export default {
    name: 'Notice',
    created() {
        this.fetchData()
    },
    data() {
        return {
            ROWS: 10,
            page: 1,
            dataStore: [],
            busy: true,
            noData: false,
            noDataMsg: '暂无相关公告',
            filterFields: [
                'date',
                'format',
                'guid',
                'has_read',
                'title',
                'text_id',
            ],
        }
    },
    computed: {
        ...mapGetters([
            'isAStock',
            'isHSIndex',
        ]),
        ...mapState([
            'stock_code',
            'full_code',
        ]),
        hsIndexParam() {
            return {
                rows: this.ROWS,
                page: this.page,
                fields: this.filterFields.join(';'),
            }
        },
        stockParam() {
            return {
                stock_code: this.stock_code,
                rows: this.ROWS,
                page: this.page,
                fields: this.filterFields.join(';'),
            }
        },
        getParams() {
            if (this.isAStock) {
                return this.stockParam
            } else if (this.isHSIndex) {
                return this.hsIndexParam
            }
        },
        getApi() {
            if (this.isAStock) {
                return getNoticeList
            } else if (this.isHSIndex) {
                return getIndexNotice
            }
        },
    },
    methods: {
        fetchData() {
            let param = this.getParams
            let api = this.getApi
            const params = {
                options: param,
                callback0: (data) => {
                    this.dataStore = this.dataStore.concat(data)
                    this.$nextTick(() => {
                        this.busy = false
                    })
                },
                callback1001: () => {
                    this.busy = true
                    if (Object.is(this.dataStore.length, 0)) {
                        this.noData = true
                    }
                },
            }
            api(params)
        },
        loadMoreData() {
            // 滚动加载
            this.busy = true
            this.page++
            this.fetchData()
        },
        formatDate(date) {
            return formatInfoDate(date)
        },
        formatIco(type) {
            return fileType(type)
        },
        openContent(data) {
            // TODO: open-content

        },
        handleClick(event) {
            const target = event.target

            if (target.className.includes('td-openContent')) {
                const index = target.dataset.index
                const targetData = this.dataStore[index]
                this.openContent(targetData)
            }
        },
        resetState() {
            this.page = 1
            this.busy = true
            this.noData = false
            this.$refs.scrollContainer.scrollTop = 0
            this.dataStore = []
        },
    },
    watch: {
        full_code() {
            this.resetState()
            this.fetchData()
        },
    },
}
</script>

<style lang="less" scoped>
.info_ellipsis_td {
    max-width: 18em !important
}
.info_ico_td {
    width: 40px;
}
</style>
