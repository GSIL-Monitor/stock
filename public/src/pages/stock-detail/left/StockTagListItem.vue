<template>
    <li class="tool_list_item">
        <div v-html="formatter" @click="tagClick()"></div>
        <div class="tool_list_item_dsc">{{title}}</div>
    </li>
</template>

<script>
import companyFormatter from '@formatter/company-tag'

export default {
    name: 'oneTag',
    methods: {
        tagClick() {
            console.log(this.fields)
        },
    },
    computed: {
        formatter() {
            if (!this.fields) return '--'
            return companyFormatter[this.fields](
                this.$store.state.tag_data[this.fields],
                this.$store.state.tag_data
            )
        },
    },
    props: ['fields', 'title'],
}
</script>

<style lang="less">
@import '../../../less/market/variables-d.less';
.tool_list {
    padding: 0 12px;
    li {
        width: 50%;
        float: left;
        padding-top: 15px;
        text-align: center;
    }
    .tag-ico {
        position: relative;
        width: 60px;
        height: 60px;
        border: 2px solid transparent;
        line-height: 56px;
        border-radius: 6px;
        margin: 0 auto;
        cursor: pointer;
        color: @white;
        &:hover {
            border-color: #c7c7c7;
        }
    }
    .tag-ico-authen {
        position: absolute;
        right: -2px;
        top: -2px;
        width: 12px;
        height: 12px;
        line-height: 12px;
        border-top-right-radius: 6px;
        border-bottom-left-radius: 6px;
        background: rgba(255, 255, 255, 0.4);
    }
    .tag-ico-authen-num {
        font-size: 12px;
        color: @color-white;
    }
    .two-line {
        line-height: 21px;
        padding-top: 7px;
    } // 强周期
    .period-most-strong {
        background-color: #033869;
    } // 较强周期
    .period-more-strong {
        background-color: #02529b;
    } // 弱周期
    .period-weak {
        background-color: #016ccd;
    }
    .period-not {
        background-color: #0086ff;
    }
    .tag-dsc {
        font-size: 14px;
        color: #9e9fa1;
        cursor: default;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .tag-inner {
        height: 100%;
    }
    .bg-linner {
        background: linear-gradient(-133deg, #ee5421 0%, #f43e42 100%);
    }
    .bg-blue {
        color: #fff;
        background-color: #0086ff;
    }
    .bg-green {
        background-image: linear-gradient(-133deg, #27ad1d 0%, #19960f 100%);
    }
    .bg-yellow {
        background-image: linear-gradient(-133deg, #ee9539 0%, #e97112 100%);
    }
    .bg-gray {
        background-color: #818181;
    }
    .bg-linear-red {
        background: linear-gradient(45deg, #d2332d 0%, #ed1f14 100%);
    }
    .point-default {
        cursor: default;
    }
    .font20 {
        font-size: 20px;
    }
    .font16 {
        font-size: 16px;
    }
    .font17 {
        font-size: 17px;
    }
    .font18 {
        font-size: 18px;
    }
    .font15 {
        font-size: 15px;
    }
    .font11 {
        font-size: 11px;
    }
    .paddingLR4 {
        padding-left: 4px;
        padding-right: 4px;
    }
    .point-default {
        cursor: default;
    }
    .common-honor {
        // background: url("../ico/honor-common.png") no-repeat -2px -2px;
    }
    .good-honor {
        // background: url("../ico/honor-good.png") no-repeat -2px -2px;
    }
    .hope-honor {
        // background: url("../ico/honor-hope.png") no-repeat -2px -2px;
    }
}
</style>