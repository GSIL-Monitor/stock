/**
 * @description 自选股 -- 获取某分组下的全部自选股
*/
import {
    mapActions,
    mapMutations,
} from 'vuex'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    FRAME_MY_STOCK,
    // FRAME_MYSTOCK_LIST,
    MODULE_NAME,
} from '../storage.js'
import {
    SELECT_GROUP_DATA,
} from '@store/stock-detail-store/config/mutation-types.js'
import {
    GET_SELECT_GROUP_DATA,
} from '@store/stock-detail-store/config/action-types.js'
import throttle from 'lodash/throttle'

let listTimeoutTimer = null

export default {
    computed: {
        paramGroupId() {
            return this.medianGroupId || this.activeGroupId
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
            const containerIndex = this.getActiveGroupIndex()
            if (Object.is(containerIndex, -1)) {
                return []
            }
            let nowScrollTop = this.$refs.scrollContainer[0].$el.scrollTop
            let height = window.screen.availHeight - 150
            let oneHeight = this.liItemHeight
            let start = Math.floor(nowScrollTop / oneHeight)
            let count = Math.ceil(height / oneHeight)
            let end = start + count
            let MAX = this.select_group_data.length - 1
            if (end > MAX)  {
                end = MAX
                let s = end - count
                if (s >= 0) {
                    start = s
                }
            }

            return {
                start,
                end,
            }
        },
        getSubScriptionFullCode(start, end) {
            let arr = []
            for (let i = start; i <= end; i++) {
                arr.push(this.select_group_data[i].full_code)
            }

            return arr
        },
        listScroll: throttle(function() {
            const edges = this.getSubScriptionEdge()
            const codeList = this.getSubScriptionFullCode(edges.start, edges.end)
            this.subScriptionList(codeList)
        }, 400),
        subScriptionList(codeList) {
            const subFilterFields = [
                'full_code', 'source', 'code', 'stock_name', 'symbol_type',
                'stock_type', 'price_change', 'price_change_rate', 'price',
            ]

            pushData(FRAME_MY_STOCK, {
                code: codeList.join(';'),
                field: subFilterFields.join(';'),
            })
        },
        unSubScriptionList() {
            UnSubscriptSockets(FRAME_MY_STOCK)
        },
        fetchSelectGroup() {
            if (this.myStockCache) {
                this.fetchSelectGroupCache()
            } else {
                this.fetchSelectGroupData()
            }
        },
        fetchSelectGroupCache() {
            // pushData(FRAME_MYSTOCK_LIST, {
            //     group_id: this.paramGroupId,
            // })
            const FUNC_NAME = 'PrivateStockTags'
            JsToQtEventInterface(JSON.stringify({
                fun: FUNC_NAME,
                data: {
                    operate: 7,
                    destId: MODULE_NAME,
                    groupId: this.paramGroupId,
                },
            }))

            this.cacheListErrorHandle()
        },
        stopPullingList() {
            if (listTimeoutTimer) {
                clearTimeout(listTimeoutTimer)
                listTimeoutTimer = null
            }
        },
        cacheListErrorHandle() {
            // 若在规定时间内取不到本地缓存，则调用api获取数据
            const TIMEOUT = 1500
            listTimeoutTimer = setTimeout(() => {
                this.fetchSelectGroupData()
            }, TIMEOUT)
        },
        receiveSelectGroupCache(data) {
            this.stopPullingList()
            // const data = JSON.parse(d)
            const selectData = data.map((element) => {
                const el = {
                    source: element.source,
                    code: element.stock_code,
                    stock_name: element.stock_name,
                    symbol_type: element.symbol_type,
                    price: element.price,
                    price_change: element.change_value,
                    price_change_rate: element.change_rate,
                    full_code: element.full_code,
                    classColor: '',
                }
                if (element.type) {
                    el.stock_type = element.type
                }

                return el
            })

            this.commitSelectData(selectData)
        },
        changeActiveId() {
            this.activeGroupId = this.medianGroupId
        },
        commitSelectData(data) {
            this[SELECT_GROUP_DATA](data)
            // 改变选中 id
            this.changeActiveId()
            this.$nextTick(() => {
                // dom状态改变后，订阅
                this.listScroll()
            })
        },
        fetchSelectGroupData() {
            const APIFilterFields = [
                'source', 'stock_code', 'stock_name', 'symbol_type', 'stock_type',
                'full_code', 'price', 'change_rate', 'change_value',
            ]

            const param = {
                options: {
                    group_id: this.paramGroupId,
                    fields: APIFilterFields.join(';')
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

                    this.commitSelectData(selectData)
                },
                callback1001: () => {
                    this[SELECT_GROUP_DATA]([])
                },
            }

            this.getSelectGroupData(param)
        },
        getBgColor(value, prevValue) {
            return  value > prevValue ? 'background-red' :
                    value < prevValue ? 'background-green' : ''
        },
        removeBgColor(arr) {
            const TIMER_STEP = 700

            setTimeout(() => {
                arr.forEach((element) => {
                    element.classColor = ''
                })
                arr = null
            }, TIMER_STEP)
        },
        receiveFrameData(d) {
            const data = JSON.parse(d)
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
    },
    created() {
        // if (this.myStockCache) {
        //     goGoal.event.listen(FRAME_MYSTOCK_LIST, this.receiveSelectGroupCache)
        // }
        goGoal.event.listen(FRAME_MY_STOCK, this.receiveFrameData)
    },
    beforeDestroy() {
        // if (this.myStockCache) {
        //     goGoal.event.remove(FRAME_MYSTOCK_LIST, this.receiveSelectGroupCache)
        // }
        goGoal.event.remove(FRAME_MY_STOCK, this.receiveFrameData)
        this.unSubScriptionList()
    },
}
