<template>
<div
    class="info_wrap"
>
    <div
        class="info_vessel"
        v-show="dataStore.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="60"
        infinite-scroll-throttle-delay="100"
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
                    :class="infoClasses(item.has_read)"
                    :key="index"
                    :data-index="index"
                    class="info_tr"
                >
                    <td
                        class="info_ellipsis_td"
                    >
                        <span
                            class="td-openContent"
                            :title="item.title"
                        >
                            {{item.title}}
                        </span>
                    </td>
                    <td
                        class="info_ico_td"
                    >
                        <span
                            :class="['stockDetial-read-pdf', formatIco(item.format).imgClass]"
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
    <report-auth :report="readReport" @finish="readReport = null" />
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
    readNotice,
} from '@service/'
import formatInfoDate from '@formatter/information/date'
import fileType from '@formatter/information/fileType'
import {
    openNotice,
} from './open-information'

import informationBusyMixin from '../mixins/information-busy-mixin'

import reportAuth from '@c/reportAuth'

export default {
    name: 'Notice',
    mixins: [
        informationBusyMixin,
    ],
    created() {
        this.fetchData()
    },
    components: {
        reportAuth,
    },
    data() {
        return {
            ROWS: 10,
            page: 1,
            dataStore: [],
            noData: false,
            noDataMsg: '暂无相关公告',
            readReport: null,
            filterFields: [
                'date',
                'format',
                'has_read',
                'title',
                'text_id',
                'stock_name',
                'guid',
                'original_type',
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
            'stock_name',
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
        getOpenContentOption() {
            if (this.isAStock) {
                return {
                    listApi:'v1/announcement/get_stock_new_announcement_list',
                    params: {
                        rows: 6,
                        stock_code: this.stock_code,
                    },
                }
            } else if (this.isHSIndex) {
                return {
                    listApi: 'v1/announcement/search_new_announcement',
                    contentApi: 'v1/announcement/get_new_announcement_content',
                    params: {
                        rows: 6,
                    },
                }
            }
        },
        titleName() {
            if (this.isAStock) {
                return '个股公告'
            } else {
                return '公告'
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
                    this.setBusyState(data.length)
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
        formatDate(date) {
            return formatInfoDate(date)
        },
        formatIco(type) {
            return fileType(type)
        },
        openContent(index, data) {
            let title = this.stock_name ? `${this.titleName}——${this.stock_name}(${this.stock_code})` : this.titleName
            const param = {
                ...this.getOpenContentOption,
                position: (index + 1),
                contentId: data.text_id,
            }
            param.params.page = Math.ceil(index / 6)

            openNotice(param, title)
        },
        readAlready(data) {
            if (Object.is(data.has_read, 0)) {
                data.has_read = 1
                // 调取 api
                readNotice({
                    options: {
                        id: data.text_id,
                    }
                })
            }
        },
        handleClick(event) {
            let target = event.target
            let type;
            if (target.className.includes('td-openContent')) {
                type = 'openContent'
            } else if (target.className.includes('stockDetial-read-pdf')) {
                type = 'openPdf'
            } else {
                return false
            }
            while (target && target.tagName.toLowerCase() !== 'tr') {
                target = target.parentNode
            }
            const index = Number(target.dataset.index)
            const targetData = this.dataStore[index]

            if (Object.is(type, 'openContent')) {
                this.openContent(index, targetData)
                this.readAlready(targetData)
            } else if (Object.is(type, 'openPdf')) {
                this.readReport = {
                    create_date: formatInfoDate(targetData.date),
                    original_type: 'announcement',
                    format: targetData.format,
                    title: targetData.title,
                    guid: targetData.guid,
                }
            }
        },
        infoClasses(hasRead) {
            return [
                {
                    'info_visited': hasRead,
                }
            ]
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
.info_date_td {
    width: 90px;
}
.info_ico_td {
    width: 40px;
    text-align: center;
}
</style>
