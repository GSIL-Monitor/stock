<template>
<div
    class="lt_detail_recent"
>
    <ul
        class="recent_list"
        @click="changeCurrentStock"
    >
        <StockItem
            v-for="(item, index) of recent_list_data"
            v-if="item"
            :key="index"
            :item="item"
        />
    </ul>
</div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations,
} from 'vuex'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    switchToHashString,
    changePageStock,
} from '../utility.js'
import {
    STOCK_RECENT_LIST,
} from '@store/stock-detail-store/config/mutation-types.js'
import {
    GET_RECENT_LIST_DATA,
} from '@store/stock-detail-store/config/action-types.js'
import {
    FRAME_RECENT_LIST,
    FRAME_STOCK_COLOR,
} from '../storage.js'

import subMixin from './sub-scription-mixin.js'

import StockItem from '../components/StockItem.vue'

export default {
    name: 'RecentVisit',
    mixins: [
        subMixin,
    ],
    created() {
        goGoal.event.listen(FRAME_RECENT_LIST, this.receiveRecentList)
        goGoal.event.listen(FRAME_STOCK_COLOR, this.changeStockColor)
        this.fetchRecentList()
    },
    components: {
        StockItem,
    },
    computed: {
        ...mapState([
            'recent_list_data',
            'full_code',
        ])
    },
    methods: {
        ...mapMutations([
            STOCK_RECENT_LIST,
        ]),
        ...mapActions([
            'getRecentListData'
        ]),
        getSubCodeList() {
            return this.recent_list_data.map((element) => {
                return `${element.source}${element.code}`
            })
        },
        fetchRecentList() {
            let param = {
                options: {},
                callback0: response => {
                    const selectData = response.map((element) => {
                        let full_code = `${element.source}${element.code}`
                        Reflect.set(element, 'price_change', element.change_value)
                        Reflect.set(element, 'price_change_rate', element.change_rate)
                        Reflect.set(element, 'stock_name', element.name)
                        Reflect.set(element, 'symbol_type', element.type)
                        Reflect.deleteProperty(element, 'change_value')
                        Reflect.deleteProperty(element, 'change_rate')
                        Reflect.deleteProperty(element, 'type')
                        Reflect.deleteProperty(element, 'name')

                        Reflect.set(element, 'full_code', full_code)
                        Reflect.set(element, 'classColor', '')

                        return element
                    })

                    this[STOCK_RECENT_LIST](selectData)

                    this.$nextTick(() => {
                        let codeList = this.getSubCodeList()
                        this.subScription(FRAME_RECENT_LIST, {
                            code: codeList.join(';'),
                            field: this.subFilterFields.join(';'),
                        })
                    })
                },
            }
            this.getRecentListData(param)
        },
        receiveRecentList(d) {
            const data = JSON.parse(d)
            const changList = []
            data.forEach((element) => {
                let full_code = element.full_code
                let one = this.recent_list_data.find((el) => {
                    return Object.is(el.full_code, full_code)
                })
                if (one) {
                    let prevPrice = one.price
                    let nowPrice = element.price
                    let colorBg = this.getBgColor(nowPrice, prevPrice)
                    one.classColor = colorBg

                    Object.assign(one, element)
                    changList.push(one)
                }
            })

            this.removeBgColor(changList)
        },
        changeCurrentStock(event) {
            let target = event.target
            while (target.tagName.toLowerCase() !== 'li') {
                target = target.parentNode
            }
            if (target) {
                let { source, symbol_type, stock_code } = target.dataset
                let hash = switchToHashString(source, stock_code, symbol_type)
                changePageStock(hash)
            }
        },
        subStockColor() {
            pushData(FRAME_STOCK_COLOR, {
                code: this.getSubCodeList().join(';'),
            })
        },
        changeStockColor(d) {
            let data = JSON.parse(d)
            for (let [key, value] of Object.entries(data)) {
                let item = this.recent_list_data.find((element) => {
                    return Object.is(element.full_code, key)
                })
                if (item) {
                    item.is_defined = value
                }
            }
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_RECENT_LIST, this.receiveRecentList)
        goGoal.event.remove(FRAME_STOCK_COLOR, this.changeStockColor)
        this.unSubScription(FRAME_RECENT_LIST)
    },
    watch: {
        full_code() {
            setTimeout(() => {
                this.fetchRecentList()
            }, 0)
        },
    },
}
</script>

<style lang="less">
.lt_detail_recent {
    height: 100%;
    overflow: auto;
}
</style>
