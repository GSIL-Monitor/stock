<template>
    <div class="lt_detail_market" id="stock-market-list">
        <OneStockList
            v-for="(item, index) of group_data"
            :key="index"
            :group_id="item.group_id"
            :group_name="item.group_name"
            :sum="item.sum"
            :is_active="is_active(item.group_id)"
            @active_id="activeIdChange"
        />
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
} from 'vuex'
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
    getToken,
    hasMyStockCache,
} from '@c/utils/util'
import OneStockList from '../components/OneStockList'

export default {
    name: 'MyStockList',
    created() {
        goGoal.event.listen(FRAME_MYSTOCK_GROUP, this.receiveMystockGroupCache)
        this.fetchMyStockGroup()
    },
    data() {
        return {
            active_group_id: null,
            groupTimeoutId: null,
        }
    },
    components: {
        OneStockList,
    },
    computed: {
        ...mapState([
            'group_data'
        ]),
    },
    methods: {
        ...mapActions({
            getStockGroupData: GET_STOCK_GROUP_DATA,
        }),
        is_active(group_id) {
            return group_id === this.active_group_id
        },
        activeIdChange(id) {
            this.active_group_id = this.active_group_id !== id ? id : null
        },
        receiveMystockGroupCache(d) {
            this.stopPulling()
            let data = JSON.parse(d)
            this.commitGroupList(data)
        },
        stopPulling() {
            if (this.groupTimeoutId) {
                clearTimeout(this.groupTimeoutId)
                this.groupTimeoutId = null
            }
        },
        cacheErrorHandle() {
            // 若在规定时间内取不到本地缓存，则调用api获取数据
            let TIMEOUT = 1500
            this.groupTimeoutId = setTimeout(() => {
                this.fetchMyStockGroupData()
            }, TIMEOUT)
        },
        commitGroupList(res) {
            this.$store.commit(STOCK_GROUP_LIST, [...res])
        },
        fetchMyStockGroup() {
            if (hasMyStockCache()) {
                this.fetchMyStockGroupCache()
            } else {
                this.fetchMyStockGroupData()
            }
        },
        // 本地缓存
        fetchMyStockGroupCache() {
            this.cacheErrorHandle()
            pushData(FRAME_MYSTOCK_GROUP, {})
        },
        // 调取 api
        fetchMyStockGroupData() {
            let param = {
                options: {
                    get_sum: 1,
                    token: getToken(),
                },
                callback0: res => {
                    this.commitGroupList()
                },
            }

            this.getStockGroupData(param)
        },
    },
    beforeDestroy() {
        goGoal.event.remove(FRAME_MYSTOCK_GROUP, this.receiveMystockGroupCache)
    },
}
</script>

<style lang="less">
    .lt_detail_market {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
