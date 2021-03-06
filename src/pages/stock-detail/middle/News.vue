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
                    :class="infoClasses(item.has_read)"
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
                        class="info_date_td"
                    >
                        {{item.date}}
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
    getStockNews,
    getHSIndexNews,
    getHKStockNews,
} from '@service/index.js'
import formatInfoDate from '@formatter/information/date.js'
import {
    openNews,
} from './open-information.js'

import informationItemMixin from '../mixins/information-item-mixin.js'
import loaddingStyleMixin from '../mixins/loadding-style-mixin.js'

export default {
    name: 'News',
    mixins: [
        informationItemMixin,
        loaddingStyleMixin,
    ],
    created() {
        this.fetchData()
    },
    data() {
        return {
            ROWS: 10,
            page: 1,
            dataStore: [],
            noData: false,
            noDataMsg: '暂无相关新闻',
            filterFields: [
                'date',
                'id',
                'title',
                'guid',
            ],
        }
    },
    computed: {
        ...mapGetters([
            'isAStock',
            'isHSIndex',
            'isHkStock',
        ]),
        ...mapState([
            'stock_code',
            'full_code',
            'stock_name',
        ]),
        hkStockParam() {
            return {
                stock_code: this.stock_code,
                rows: this.ROWS,
                page: this.page,
                fields: this.filterFields.join(';'),
            }
        },
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
            } else if (this.isHkStock) {
                return this.hkStockParam
            }
        },
        getApi() {
            if (this.isAStock) {
                return getStockNews
            } else if (this.isHSIndex) {
                return getHSIndexNews
            } else if (this.isHkStock) {
                return getHKStockNews
            }
        },
        getOpenContentOption() {
            if (this.isAStock) {
                return {
                    listApi:'v1/news/get_newmystock_info',
                    contentApi:'v1/news/get_info_content',
                    params: {
                        rows: 6,
                        stock_code: this.stock_code,
                    },
                }
            } else if (this.isHSIndex) {
                return {
                    listApi:'v1/news/get_ask_news_info',
                    contentApi:'v1/news/get_news_info_content',
                    params: {
                        rows: 6,
                    },
                }
            } else if (this.isHkStock) {
                return {
                    source: 'hk',
                    listApi:'v1/news/get_hk_newmystock_info',
                    contentApi: 'v1/news/get_hk_info_content',
                    params: {
                        rows: 6,
                        stock_code: this.stock_code,
                    },
                    path:'G3_08_17',
                }
            }
        },
        titleName() {
            if (this.isAStock) {
                return '个股资讯'
            } else {
                return '新闻'
            }
        },
    },
    methods: {
        fetchData() {
            this.$_addLoadding()
            let param = this.getParams
            let api = this.getApi
            const params = {
                options: param,
                callback0: (data) => {
                    data.forEach((element) => {
                        element.date = formatInfoDate(element.date, true)
                        element.has_read = 0
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
            api(params)
        },
        readAlready(data) {
            if (Object.is(data.has_read, 0)) {
                data.has_read = 1
            }
        },
        openContent(index, data) {
            let title = this.stock_name ? `${this.titleName}——${this.stock_name}(${this.$_showCode})` : this.titleName
            const param = {
                ...this.getOpenContentOption,
                position: (index + 1),
                contentId: data.guid || data.id,
            }
            param.params.page = Math.ceil(index / 6)

            openNews(param, title)
        },
        handleClick(event) {
            const target = event.target
            if (target.className.includes('td-openContent')) {
                const index = Number(target.dataset.index)
                const targetData = this.dataStore[index]

                this.openContent(index, targetData)
                this.readAlready(targetData)
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
.info_date_td {
    width: 140px;
}

.info_ellipsis_td {
    max-width: 18em;
}
</style>
