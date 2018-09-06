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
                            :title="item.report_title"
                        >
                            {{item.report_title || '--'}}
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
                        class="info_org_td"
                    >
                        {{item.organ_name || '--'}}
                    </td>
                    <td
                        class="info_date_td"
                    >
                        {{formatDate(item.create_date)}}
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
    getResearchReport,
} from '@service/'
import formatInfoDate from '@formatter/information/date'
import fileType from '@formatter/information/fileType'

export default {
    name: 'Report',
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
            noDataMsg: '暂无相关研报',
            filterFields: [
                'create_date',
                'file_type',
                'guid',
                'read_mark',
                'report_title',
                'organ_name',
                'organ_id',
                'has_read',
                'count',
            ],
        }
    },
    computed: {
        ...mapGetters([
            'isAStock',
        ]),
        ...mapState([
            'stock_code',
            'full_code',
        ]),
        stockParam() {
            return {
                code: this.stock_code,
                rows: this.ROWS,
                page: this.page,
                has_read: 1,
                fields: this.filterFields.join(';'),
            }
        },
        getParams() {
            if (this.isAStock) {
                return this.stockParam
            }
        },
        getApi() {
            if (this.isAStock) {
                return getResearchReport
            }
        },
    },
    methods: {
        fetchData() {
            let param = this.getParams
            let api = this.getApi
            const params = {
                options: param,
                callback0: data => {
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
            if (api) {
                api(params)
            }
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
                // 原生弹框
                const index = target.dataset.index
                const targetData = this.dataStore[index]
                this.openContent(targetData)
            } else if (target.className.includes('info_ico_td')) {
                // TODO:原文

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
@width: 90px;
.info_org_td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: @width;
    width: @width;
    max-width: @width;
}
</style>
