<template>
    <li>
        <ul class="transac_item">
            <li class="transac_item_time">{{time}}</li>
            <li class="transac_item_price">
                <Price
                    :val="item.price"
                    :price_change="item.price_change"
                    :current_type="current_type"
                />
            </li>
            <li class="transac_item_volume">
                <span
                    :class="[volume.color]"
                >
                    {{volume.val}}
                </span>
                <span
                    class="transac_item_volume_ico"
                    :class="[arrow]"
                >
                </span>
            </li>
            <li class="transac_item_count">
                <span
                    :class="[count.color]"
                >
                    {{count.val}}
                </span>
            </li>
        </ul>
    </li>
</template>

<script>
import {
    formatTime,
    formatNormalVolume,
    getArrow,
    formatCount,
} from '@formatter/market-fields/transaction'

import Price from '@formatter/market-base/Price'

export default {
    name: 'TransactionLi',
    components: {
        Price,
    },
    computed: {
        time() {
            return formatTime(this.item.update_time)
        },
        volume() {
            return formatNormalVolume(this.item.transaction_type, this.item.volume)
        },
        arrow() {
            return getArrow(this.item.transaction_type, this.item.volume)
        },
        count() {
            return formatCount(this.item.deal_count)
        },
    },
    props: {
        item: {
            type: Object,
            require: true,
        },
        current_type: {
            type: String,
            default: 'aStock'
        },
    }
}
</script>

<style lang="less">
.transac_item {
    display: flex;
    align-items: center;
    height: 29px;
    font-size: 12px;
    padding: 0 15px;
}
.transac_item_time {
    width: 19%;
}
.transac_item_price {
    width: 24%;
}
.transac_item_volume {
    width: 30%;
}
.transac_item_count {
    flex: 1;
}
.transac_item_price, .transac_item_count {
    text-align: right;
    padding: 0 5px;
}
.transac_item_volume {
    display: flex;
    justify-content: flex-end;
    padding: 0 5px;
}
.transac_item_volume_ico{
    width: 7px;
    margin-left: 5px;
    background-color: #abc
}
</style>

