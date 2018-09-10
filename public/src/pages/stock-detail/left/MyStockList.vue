<template>
    <div class="lt_detail_market" id="stock-market-list" v-if="group_data.length">
        <div
            v-for="(item, index) of group_data"
            :key="index"
            :class="generateGroupClass(item.group_id)"
            :data-group_id="item.group_id"
        >
            <div
                class="market_title"
                @click="makeActive(item.group_id, item.sum)"
            >
                <div class="market_title_ico"></div>
                <div class="market_title_name">{{item.group_name}}</div>
                <div>(</div>
                <div class="market_title_num">{{item.sum}}</div>
                <div>)</div>
            </div>
            <ul
                class="market_list"
                @scroll="listScroll"
                ref="scrollContainer"
            >
                <StockItem
                    v-for="(listItem, i) of getListData(item.group_id)"
                    :key="i"
                    :item="listItem"
                    ref="listItem"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations,
} from 'vuex'
import oneStockList from './one-stock-list-mixin'
import {
    SESSION_SELECT_STOCK_GROUP,
    FRAME_MYSTOCK_GROUP,
} from '../storage'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt'
import {
    GET_STOCK_GROUP_DATA,
} from '@store/stock-detail-store/config/action-types'
import {
    STOCK_GROUP_LIST,
} from '@store/stock-detail-store/config/mutation-types'
import {
    hasMyStockCache,
} from '@c/utils/util'

import StockItem from '../components/StockItem'

let groupTimeoutTimer = null

export default {
    name: 'MyStockList',
    mixins: [
        oneStockList,
    ],
    created() {
        if (this.myStockCache) {
            goGoal.event.listen(FRAME_MYSTOCK_GROUP, this.receiveMystockGroupCache)
        }

        this.fetchMyStockGroup()
    },
    data() {
        return {
            activeGroupId: null, // 当前选中 id
            medianGroupId: null, // 中转 id
            myStockCache: hasMyStockCache(),
        }
    },
    components: {
        StockItem,
    },
    computed: {
        ...mapState([
            'group_data',
            'select_group_data',
        ]),
    },
    methods: {
        ...mapMutations([
            STOCK_GROUP_LIST,
        ]),
        ...mapActions({
            getStockGroupData: GET_STOCK_GROUP_DATA,
        }),
        isGroupActive(id) {
            return Object.is(this.activeGroupId, id)
        },
        getListData(id) {
            return this.isGroupActive(id) ? this.select_group_data : []
        },
        generateGroupClass(id) {
            return [
                'market',
                {
                    'active': this.isGroupActive(id)
                },
            ]
        },
        makeActive(id, sum) {
            if (Object.is(sum, 0)) {
                // 自选数目为 0，不继续计算
                return false
            }
            if (this.isGroupActive(id)) {
                this.activeGroupId = null
                this.unSubScriptionList()
            } else {
                this.medianGroupId = id
                this.unSubScriptionList()
                this.fetchSelectGroup()
            }
        },
        receiveMystockGroupCache(d) {
            this.stopPullingGroupData()
            const data = JSON.parse(d)
            this.commitGroupList(data)
            // 获取选中分组数据
            this.fetchSelectGroup()
        },
        stopPullingGroupData() {
            if (groupTimeoutTimer) {
                clearTimeout(groupTimeoutTimer)
                groupTimeoutTimer = null
            }
        },
        cacheGroupErrorHandle() {
            // 若在规定时间内取不到本地缓存，则调用api获取数据
            const TIMEOUT = 1500
            groupTimeoutTimer = setTimeout(() => {
                this.fetchMyStockGroupData()
            }, TIMEOUT)
        },
        commitGroupList(data) {
            this[STOCK_GROUP_LIST](data)
            this.medianGroupId = data[0].group_id
        },
        fetchMyStockGroup() {
            if (this.myStockCache) {
                this.fetchMyStockGroupCache()
            } else {
                this.fetchMyStockGroupData()
            }
        },
        // 获取本地缓存分组
        fetchMyStockGroupCache() {
            pushData(FRAME_MYSTOCK_GROUP, {})
            this.cacheGroupErrorHandle()
        },
        // 调取 api 获取分组
        fetchMyStockGroupData() {
            let param = {
                options: {
                    get_sum: 1,
                },
                callback0: response => {
                    this.commitGroupList(response)
                    // 获取选中分组数据
                    this.fetchSelectGroup()
                },
            }

            this.getStockGroupData(param)
        },
        generateStockListClasses(id) {
            return [
                this.activeGroupId === id
                    ? 'active'
                    : null
            ]
        },
    },
    beforeDestroy() {
        if (this.myStockCache) {
            goGoal.event.remove(FRAME_MYSTOCK_GROUP, this.receiveMystockGroupCache)
        }
    },
}
</script>

<style lang="less">
    .lt_detail_market {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    // list
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
