<template>
    <li>
        <ul
            class="line_item_list"
            :class="classes"
        >
            <li class="line_item_list_time">{{date}}</li>
            <li class="line_item_list_name">{{stockName}}</li>
            <li class="line_item_list_type">{{lineType}}</li>
            <li class="line_item_list_rate">{{lineNumber}}</li>
        </ul>
    </li>
</template>

<script>
import {
    getColor,
    formatNumber,
    formatDate,
    formatStockName,
    formatType,
} from '@formatter/market-fields/short-line'

export default {
    name: 'ShortElvesItem',
    computed: {
        color() {
            return getColor(this.type)
        },
        date() {
            return formatDate(this.tdate)
        },
        stockName() {
            return formatStockName(this.name)
        },
        lineType() {
            return formatType(this.type)
        },
        lineNumber() {
            return formatNumber(this.type, this.value)
        },
        classes() {
            return [
                `${this.color}`,
            ]
        },
    },
    props: {
        type: {
            type: Number,
        },
        tdate: {
            type: String,
        },
        name: {
            type: String,
        },
        value: {
            type: [Number],
        },
    }
}
</script>

<style lang="less">
@red: #ff2b48;
@green: #06B45F;
.line_item_list {
    display: flex;
    height: 28px;
    align-items: center;
}
.line_item_list.red {
    color: @red;
}
.line_item_list.green {
    color: @green;
}
.line_item_list_time {
    flex: 0 0 20%;
    padding-left: 10px;
}
.line_item_list_name {
    flex: 0 0 30%;
    padding-left: 15px;
}
.line_item_list_type {
    flex: 0 0 30%;
}
.line_item_list_rate {
    flex: 0 0 20%;
    text-align: right;
    padding-right: 10px;
}
</style>
