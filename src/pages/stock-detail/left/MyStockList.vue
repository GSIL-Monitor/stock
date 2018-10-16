<template>
    <div
        class="lt_detail_market"
        v-if="group_data.length"
        @click="changeCurrentStock"
        ref="stockWrap"
    >
        <div
            v-for="(item, index) of group_data"
            :key="index"
            :class="generateGroupClass(item.group_id)"
            :data-group_id="item.group_id"

        >
            <div
                class="market_title"
                @click.stop="makeActive(item.group_id, item.sum)"
            >
                <div class="market_title_ico"></div>
                <div class="market_title_name">{{item.group_name}}</div>
                <div>(</div>
                <div class="market_title_num">{{item.sum}}</div>
                <div>)</div>
            </div>
            <virtual-scroller
                v-if="isGroupActive(item.group_id)"
                @scroll.native="listScroll"
                :items="getListData(item.group_id)"
                :item-height="liItemHeight"
                content-tag="ul"
                class="market_list"
                ref="scrollContainer"
            >
                <template slot-scope="props">
                    <StockItem
                        :item="props.item"
                        :key="props.itemKey"
                    />
                </template>
            </virtual-scroller>
            <!-- <ul
                class="market_list"
                @scroll="listScroll"
                ref="scrollContainer"
            >
                <StockItem
                    v-for="(listItem, i) of getListData(item.group_id)"
                    :key="i"
                    :item="listItem"
                />
            </ul> -->
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations,
} from 'vuex'
import {
    hasMyStockCache,
} from '@c/utils/util.js'
import {
    pushData,
    UnSubscriptSockets,
} from '@c/utils/callQt.js'
import {
    switchToHashString,
    changePageStock,
    isContainsNode,
} from '../utility.js'
import {
    SESSION_SELECT_STOCK_GROUP,
    FRAME_MYSTOCK_GROUP,
} from '../storage.js'
import {
    GET_STOCK_GROUP_DATA,
} from '@store/stock-detail-store/config/action-types.js'
import {
    STOCK_GROUP_LIST,
    STOCK_CODE,
    STOCK_NAME,
} from '@store/stock-detail-store/config/mutation-types.js'

import oneStockList from './one-stock-list-mixin.js'

import StockItem from '../components/StockItem.vue'

export default {
    name: 'MyStockList',
    mixins: [
        oneStockList,
    ],
    data() {
        return {
            groupTimeoutTimer: null,
            activeGroupId: null, // 当前选中 id
            medianGroupId: null, // 中转 id
            clickTimer: null,
            myStockCache: hasMyStockCache(),
            liItemHeight: 45,
        }
    },
    computed: {
        ...mapState({
            group_data: state => state.moduleMystock.group_data,
            select_group_data: state => state.moduleMystock.select_group_data,
        }),
    },
    methods: {
        ...mapMutations([
            STOCK_GROUP_LIST,
            STOCK_CODE,
            STOCK_NAME,
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
        getActiveGroupIndex() {
            return this.group_data.findIndex((element) => {
                return Object.is(element.group_id, this.activeGroupId)
            })
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
            if (this.groupTimeoutTimer) {
                clearTimeout(this.groupTimeoutTimer)
                this.groupTimeoutTimer = null
            }
        },
        cacheGroupErrorHandle() {
            // 若在规定时间内取不到本地缓存，则调用api获取数据
            const TIMEOUT = 1500
            this.groupTimeoutTimer = setTimeout(() => {
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
        refeatchMyStockGroup() {
            this.fetchMyStockGroup()
        },
        correctionData(data) {
            // 有打开的分组
            if (this.activeGroupId) {
                const defaultId = this.group_data[0].group_id
                if (Object.is(defaultId, this.activeGroupId)) {
                    // 重刷分组数据
                    this.fetchSelectGroup()
                }
            }

            // 修改第一个分组数据的count
            this.group_data[0].sum += data ? 1 : -1
        },
        changeCurrentStock(event) {
            const STEP = 200
            clearTimeout(this.clickTimer)
            this.clickTimer = setTimeout(() => {
                let target = event.target
                let activeIndex = this.getActiveGroupIndex()
                if (activeIndex === -1) {
                    return false
                }
                let $scrollContainer = this.$refs.scrollContainer[0].$el
                if (!isContainsNode($scrollContainer, target)) {
                    return false
                }
                while (target && target.tagName.toLowerCase() !== 'li') {
                    target = target.parentNode
                }
                if (target) {
                    let { source, symbol_type, stock_code, stock_name } = target.dataset
                    let hash = switchToHashString(source, stock_code, symbol_type)
                    this[STOCK_NAME](stock_name)
                    changePageStock(hash)
                }
            }, STEP)
        },
    },
    components: {
        StockItem,
    },
    created() {
        if (this.myStockCache) {
            goGoal.event.listen(FRAME_MYSTOCK_GROUP, this.receiveMystockGroupCache)
        }
        this.$_eventBus.$on('refeatchMyStockGroup', this.refeatchMyStockGroup)
        this.$_eventBus.$on('correctionData', this.correctionData)
        this.fetchMyStockGroup()
    },
    beforeDestroy() {
        if (this.myStockCache) {
            goGoal.event.remove(FRAME_MYSTOCK_GROUP, this.receiveMystockGroupCache)
        }
        this.$_eventBus.$off('refeatchMyStockGroup', this.refeatchMyStockGroup)
    },
}
</script>

<style lang="less">
    .lt_detail_market {
        display: flex;
        flex-direction: column;
        height: 100%;
        .item_right_top_name {
            color: var(--color-gold-11);
        }
    }

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
        &.active + .market {
            .market_title {
                border-top: 1px solid var(--color-dividers);
            }
        }
        &:first-child {
            .market_title {
                border-top: none;
            }
        }
    }
    .market_title {
        display: flex;
        flex: 0 0 26px;
        align-items: center;
        background-color: var(--color-card-background);
        border-bottom: 1px solid var(--color-dividers);

        padding: 0 5px;
        color: var(--color-primary-text);
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
        border-bottom: 1px solid var(--color-dividers);
        &.background-red {
            background: -webkit-linear-gradient(left,transparent,rgba(245,29,39,.1) 60%,rgba(245,29,39,.15));
        }
        &.background-green {
            background: -webkit-linear-gradient(left, transparent, rgba(41, 184, 30, 0.1) 60%, rgba(41, 184, 30, 0.15));
        }
    }

</style>
