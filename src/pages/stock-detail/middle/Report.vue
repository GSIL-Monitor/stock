<template>
<div
    class="info_wrap"
    :class="$_wrapClasses"
>
    <div
        class="info_vessel"
        v-show="dataStore.length"
        v-infinite-scroll="$_loadMore"
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
                    :key="index"
                    :data-index="index"
                    class="info_tr"
                    :class="infoClasses(item.has_read)"
                >
                    <td
                        class="info_ellipsis_td"
                    >
                        <span
                            class="td-openContent"
                            :title="item.report_title"
                        >
                            {{item.report_title || '--'}}
                        </span>
                    </td>
                    <td
                        class="info_ico_td"
                    >
                        <span
                            :class="['stockDetial-read-pdf', formatIco(item.file_type).imgClass]"
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
                        {{item.create_date}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div
        v-if="noData"
        class="extend_nodata"
    >{{noDataMsg}}</div>
    <report-auth
        :report="readReport"
        @finish="readReport = null"
    />
</div>
</template>

<script>
import {
    mapState,
    mapGetters,
} from 'vuex'
import {
    getResearchReport,
    readReport,
} from '@service/index.js'
import formatInfoDate from '@formatter/information/date.js'
import fileType from '@formatter/information/fileType.js'
import {
    openReport,
} from './open-information.js'
import {
    getReportLine,
} from '@c/utils/util.js'

import informationItemMixin from '../mixins/information-item-mixin.js'
import loaddingStyleMixin from '../mixins/loadding-style-mixin.js'

import reportAuth from '@c/reportAuth.vue'

export default {
    name: 'Report',
    mixins: [
        informationItemMixin,
        loaddingStyleMixin,
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
            noDataMsg: '暂无相关研报',
            readReport: null,
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
            'stock_name',
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
        titleName() {
            return '个股研报'
        },
    },
    methods: {
        fetchData() {
            this.$_addLoadding()
            let param = this.getParams
            let api = this.getApi
            const params = {
                options: param,
                callback0: data => {
                    data.forEach((element) => {
                        element.create_date = formatInfoDate(element.create_date)
                    })
                    this.dataStore = this.dataStore.concat(data)
                    this.$_setBusyState(data.length)
                },
                callback1001: () => {
                    this.busy = true
                    if (Object.is(this.dataStore.length, 0)) {
                        this.noData = true
                    }
                },
            }
            if (this.$_isFirstLoadding) {
                params.afterResponse = () => {
                    this.$_removeLoadding()
                }
            }
            if (api) {
                api(params)
            }
        },
        formatIco(type) {
            return fileType(type)
        },
        openContent(index, data) {
            index = index + 1
            let title = this.stock_name ? `${this.titleName}——${this.stock_name}(${this.$_showCode})` : this.titleName
            const param = {
                position: index,
                contentId: data.guid,
                params: {
                    rows: 6,
                    code: this.stock_code,
                    product_line: getReportLine(),
                    page: Math.ceil(index / 6)
                },
            }
            openReport(param, title)
        },
        readAlready(data) {
            if (Object.is(data.has_read, 0)) {
                data.has_read = 1
                // 调取 api
                readReport({
                    options: {
                        id: data.guid,
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
                if (!targetData.file_type) {
                    return false
                }
                this.readReport = {
                    create_date: formatInfoDate(targetData.create_date),
                    file_type: targetData.file_type,
                    report_title: targetData.report_title,
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
            this.$_resetState()
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
