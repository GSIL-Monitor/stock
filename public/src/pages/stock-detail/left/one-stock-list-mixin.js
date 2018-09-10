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
} from '@c/utils/callQt'
import {
    FRAME_MY_STOCK,
    FRAME_MYSTOCK_LIST,
} from '../storage'
import {
    SELECT_GROUP_DATA,
} from '@store/stock-detail-store/config/mutation-types'
import {
    GET_SELECT_GROUP_DATA,
} from '@store/stock-detail-store/config/action-types'

const APIFilterFields = [
    'change_rate',
    'change_value',
    'full_code',
    'price',
    'source',
    'stock_code',
    'stock_name',
    'stock_type',
    'symbol_type',
]

const subFilterFields = [
    'price_change',
    'price_change_rate',
    'full_code',
    'price',
    'source',
    'code',
    'stock_name',
    'stock_type',
    'symbol_type',
]

let listTimeoutTimer = null

export default {
    created() {
        if (this.myStockCache) {
            goGoal.event.listen(FRAME_MYSTOCK_LIST, this.receiveSelectGroupCache)
        }
        goGoal.event.listen(FRAME_MY_STOCK, this.receiveFrameData)
    },
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
            const containerIndex = this.group_data.findIndex((element)=>{
                return Object.is(element.group_id, this.activeGroupId)
            })
            let nowScrollTop = this.$refs.scrollContainer[containerIndex].scrollTop
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
        getSubScriptionFullCode(start, end) {
            let arr = []
            for (let i = start; i <= end; i++) {
                arr.push(this.select_group_data[i].full_code)
            }

            return arr
        },
        listScroll() {
            const edges = this.getSubScriptionEdge()
            const codeList = this.getSubScriptionFullCode(edges.start, edges.end)
            this.subScriptionList(codeList)
        },
        subScriptionList(codeList) {
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
            pushData(FRAME_MYSTOCK_LIST, {
                group_id: this.paramGroupId,
            })
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
        receiveSelectGroupCache(d) {
            this.stopPullingList()
            const data = JSON.parse(d)

            const selectData = data.map((element) => {
                Reflect.set(element, 'classColor', '')
                Reflect.set(element, 'full_code', element.fullcode)
                Reflect.set(element, 'stock_name', element.name)

                Reflect.deleteProperty(element, 'fullcode')
                Reflect.deleteProperty(element, 'name')

                return element
            })

            this.commitSelectData(selectData)
            // this[SELECT_GROUP_DATA](selectData)
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
            var param = {
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
                    // this[SELECT_GROUP_DATA]()
                },
                callback1001: () => {
                    this[SELECT_GROUP_DATA]([])
                    // this.$emit('active_id', null)
                    // this.subFullCode = []
                },
                // afterResponse: () => {

                // }
            }

            this.getSelectGroupData(param)
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
    beforeDestroy() {
        if (this.myStockCache) {
            goGoal.event.remove(FRAME_MYSTOCK_LIST, this.receiveSelectGroupCache)
        }
        goGoal.event.remove(FRAME_MY_STOCK, this.receiveFrameData)
        this.unSubScriptionList()
    },
}
