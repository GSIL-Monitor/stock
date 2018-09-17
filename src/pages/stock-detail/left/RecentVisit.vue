<template>
    <div class="lt_detail_recent">
        <ul class="recent_list" @click="changeCurrentStock">
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
    } from '@c/utils/callQt'
    import {
        STOCK_RECENT_LIST,
    } from '@store/stock-detail-store/config/mutation-types'
    import {
        GET_RECENT_LIST_DATA,
    } from '@store/stock-detail-store/config/action-types'
    import {
        FRAME_RECENT_LIST,
    } from '../storage'

    import subMixin from './sub-scription-mixin'

    import StockItem from '../components/StockItem'

    export default {
        name: 'RecentVisit',
        mixins: [
            subMixin,
        ],
        created() {
            goGoal.event.listen(FRAME_RECENT_LIST, this.receiveRecentList)
            this.fetchRecentList()
        },
        components: {
            StockItem,
        },
        computed: {
            ...mapState([
                'recent_list_data'
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
                    options: {
                    },
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
                    let hash = target.dataset.hashString
                    if (hash) {
                        location.hash = hash
                    }
                }
            },
        },
        beforeDestroy() {
            goGoal.event.remove(FRAME_RECENT_LIST, this.receiveRecentList)
            this.unSubScription(FRAME_RECENT_LIST)
        },
    }
</script>

<style lang="less">
.lt_detail_recent {
    height: 100%;
    overflow: auto;
}
</style>
