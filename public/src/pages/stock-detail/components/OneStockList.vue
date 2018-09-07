<template>
    <div class="market" :class="{'active': is_active}">
        <div class="market_title" @click="groupClick">
            <div class="market_title_ico"></div>
            <div class="market_title_name">{{group_name}}</div>
            <div>(</div>
            <div class="market_title_num">{{sum}}</div>
            <div>)</div>
        </div>
        <ul class="market_list" @scroll="listScroll" ref="scrollContainer">
            <StockItem
                v-for="(item, index) of group_data"
                v-if="item"
                :key="index"
                :item="item"
                ref="listItem"
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
        GET_SELECT_GROUP_DATA,
    } from '@store/stock-detail-store/config/action-types'
    import {
        SELECT_GROUP_DATA,
    } from '@store/stock-detail-store/config/mutation-types'
    import {
        FRAME_MY_STOCK,
        FRAME_MYSTOCK_LIST,
    } from '../storage'
    import {
        hasMyStockCache,
    } from '@c/utils/util'
    import {
        pushData,
        UnSubscriptSockets,
    } from '@c/utils/callQt'
    import StockItem from './StockItem'

    let isRegister = false

    export default {
        name: 'OneStockList',
        created() {
            if (!isRegister) {
                goGoal.event.listen(FRAME_MYSTOCK_LIST, this.receiveSelectGroupCache)
                goGoal.event.listen(FRAME_MY_STOCK, this.receiveFrameData)
                isRegister = true
            }
        },
        data() {
            return {
                subIndex: {
                    start: 0,
                    end: 0,
                },
                listTimeoutId: null,
                subFullCode: [],
                active: this.is_active,
            }
        },
        components: {
            StockItem,
        },
        computed: {
            ...mapState([
                'select_group_data',
            ]),
            group_data() {
                return this.is_active ? this.select_group_data : []
            },
            APIFilterFields() {
                return [
                    'change_rate',
                    'change_value',
                    // 'close_price',
                    'full_code',
                    'price',
                    'source',
                    'stock_code',
                    'stock_name',
                    'stock_type',
                    'symbol_type',
                ]
            },
            subFilterFields() {
                return [
                    'price_change',
                    'price_change_rate',
                    // 'close_price',
                    'full_code',
                    'price',
                    'source',
                    'code',
                    'stock_name',
                    'stock_type',
                    'symbol_type',
                ]
            },
        },
        methods: {
            ...mapMutations([
                SELECT_GROUP_DATA,
            ]),
            ...mapActions({
                getSelectGroupData: GET_SELECT_GROUP_DATA,
            }),
            getSubScriptionEdge() {
                let nowScrollTop = this.$refs.scrollContainer.scrollTop
                let height = window.screen.availHeight - 150
                let oneHeight = 40
                let start = Math.floor(nowScrollTop / oneHeight)
                let count = Math.ceil(height / oneHeight)
                let end = start + count
                let MAX = this.select_group_data.length - 1
                if (end > MAX)  {
                    end = MAX
                }

                return {
                    start,
                    end,
                }
            },
            getSubScriptionFullCode() {
                let arr = []
                let start = this.subIndex.start
                let end = this.subIndex.end
                for (let i = start; i <= end; i++) {
                    arr.push(this.select_group_data[i].full_code)
                }

                return arr
            },
            listScroll(event) {
                this.subIndex = this.getSubScriptionEdge()
                this.subFullCode = this.getSubScriptionFullCode()
                this.subScription()
            },
            subScription() {
                pushData(FRAME_MY_STOCK, {
                    code: this.subFullCode.join(';'),
                    field: this.subFilterFields.join(';'),
                })
            },
            unSubScription() {
                UnSubscriptSockets(FRAME_MY_STOCK)
            },
            getBgColor(value, prevValue) {
                return  value > prevValue ? 'background-red' :
                        value < prevValue ? 'background-green' : ''
            },
            removeBgColor(arr) {
                setTimeout(() => {
                    arr.forEach((element) => {
                        element.classColor = ''
                    })
                    arr = null
                }, 600)
            },
            receiveFrameData(d) {
                let data = JSON.parse(d)
                let changList = []

                data.forEach((element) => {
                    let full_code = element.full_code
                    let one = this.select_group_data.find((el) => {
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
            clearGroupData() {
                this[SELECT_GROUP_DATA]([])
            },
            groupClick() {
                if (!this.is_active) {
                    this.unSubScription()
                    this.fetchSelectGroup()
                } else {
                    this.$emit('active_id', null)
                }
            },
            commitSelectList(arr) {
                this[SELECT_GROUP_DATA](arr)
                // 在 dom 状态更新之后订阅
                this.$nextTick(() => {
                    this.$emit('active_id', this.group_id)
                    this.listScroll()
                })
            },
            stopPulling() {
                if (this.listTimeoutId) {
                    clearTimeout(this.listTimeoutId)
                    this.listTimeoutId = null
                }
            },
            cacheErrorHandle() {
                // 若在规定时间内取不到本地缓存，则调用api获取数据
                let TIMEOUT = 1500
                this.listTimeoutId = setTimeout(() => {
                    this.fetchSelectGroupData()
                }, TIMEOUT)
            },
            receiveSelectGroupCache(d) {
                this.stopPulling()

                const data = JSON.parse(d)

                const selectData = data.map((element) => {
                    Reflect.set(element, 'classColor', '')
                    Reflect.set(element, 'full_code', element.fullcode)
                    Reflect.set(element, 'stock_name', element.name)

                    Reflect.deleteProperty(element, 'fullcode')
                    Reflect.deleteProperty(element, 'name')

                    return element
                })

                this.commitSelectList(selectData)
            },
            fetchSelectGroup() {
                if (hasMyStockCache()) {
                    this.fetchSelectGroupCache()
                } else {
                    this.fetchSelectGroupData()
                }
            },
            fetchSelectGroupCache() {
                this.cacheErrorHandle()
                pushData(FRAME_MYSTOCK_LIST, {
                    group_id: this.group_id
                })
            },
            fetchSelectGroupData() {
                var param = {
                    options: {
                        group_id: this.group_id,
                        fields: this.APIFilterFields.join(';')
                    },
                    callback0: response => {
                        const selectData = response.map((element) => {
                            Reflect.set(element, 'price_change', element.change_value)
                            Reflect.set(element, 'price_change_rate', element.change_rate)
                            Reflect.set(element, 'code', element.stock_code)
                            Reflect.set(element, 'classColor', '')

                            Reflect.deleteProperty(element, 'change_value')
                            Reflect.deleteProperty(element, 'change_rate')
                            Reflect.deleteProperty(element, 'stock_code')

                            return element
                        })

                        this.commitSelectList(selectData)
                    },
                    callback1001: () => {
                        this.clearGroupData()
                        this.$emit('active_id', null)
                        this.subFullCode = []
                    },
                    // afterResponse: () => {

                    // }
                }

                this.getSelectGroupData(param)
            },
        },
        beforeDestroy() {
            if (isRegister) {
                goGoal.event.remove(FRAME_MYSTOCK_LIST, this.receiveSelectGroupCache)
                goGoal.event.remove(FRAME_MY_STOCK, this.receiveFrameData)
                this.unSubScription()
                isRegister = false
            }
        },
        watch: {
            is_active(value, OldValue) {
                console.log(value)
            }
        },
        props: [
            "group_id",
            "group_name",
            "sum",
            "is_active",
        ]
    }
</script>

<style lang="less">
    .market {
        display: flex;
        flex-direction: column;
        flex: 0 0 26px;

        &.active {
            flex: 1;
            .market_title_ico {
                border-left-color: transparent;
                border-top-color: #ACAFB6;
                margin-top: 5px;
            }
            .market_list {
                flex: 1;
            }
        }
    }
    .market_title {
        display: flex;
        flex: 0 0 26px;
        align-items: center;
        background-color: #292929;
        border-bottom: 1px solid;
        padding: 0 5px;
        color: #f8f8f8;
        cursor: pointer;
    }
    .market_list {
        flex: 0 0 0;
    }
    .market_title_ico {
        border: 4px solid transparent;
        border-left-color: #ACAFB6;
        margin-right: 5px;
    }
    .market_title_name {
        max-width: 153px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .market_list {
        overflow: auto;
    }
    .market_list_item {
        &.background-red {
            background: linear-gradient(left, transparent, rgba(245, 29, 39, 0.1) 60%, rgba(245, 29, 39, 0.15));
        }
        &.background-green {
            background: linear-gradient(left, transparent, rgba(41, 184, 30, 0.1) 60%, rgba(41, 184, 30, 0.15));
        }
    }

</style>
