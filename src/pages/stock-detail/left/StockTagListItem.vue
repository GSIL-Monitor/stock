<template>
    <li class="tool_list_item">
        <div v-html="formatter" @click="tagClick"></div>
        <div class="tool_list_item_dsc">{{title}}</div>
    </li>
</template>

<script>
import {
    mapState,
} from 'vuex'
import companyFormatter from '@formatter/company-tag.js'
import tagOpenPermission from './tag-open-permission.js'
import moduleJump from '@c/moduleJump'

export default {
    name: 'OneTag',
    computed: {
        ...mapState({
            tag_data: state => state.moduleTags.tag_data,
            stock_code: state => state.stock_code,
            full_code: state => state.full_code,
        }),
        formatter() {
            if (!this.fields) return '--'
            return companyFormatter[this.fields](
                this.tag_data[this.fields],
                this.tag_data,
            )
        },
    },
    props: ['fields', 'title'],
    methods: {
        tagClick(event) {
            if (!tagOpenPermission(this.fields)) {
                return false
            }
            let target = event.target
            while (target && !target.classList.contains('j-tag')) {
                target = target.parentNode
            }
            if (target.classList.contains('point-default')) {
                return false
            }
            let stock_code = this.stock_code
            let stock_name = this.tag_data.stock_name
            let full_code = this.full_code

            switch (this.fields) {
                case 'zyyx_score':
                    // 确定性评分
                    moduleJump('stockTotalScore', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'tags':
                    // 公司荣誉
                    moduleJump('stockTag', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'future_achievement_appraise':
                    // 业绩预判
                    {
                        moduleJump('stockGSYJYPWL', {
                            stock_code: stock_code,
                            stock_name: stock_name,
                        })
                    }
                    break
                case 'history_achievement_appraise':
                    // 业绩鉴定
                    {
                        if (target.classList.contains('future_appraise')) {
                            // 未来
                            moduleJump('stockGSYJJD_cur', {
                                stock_code: stock_code,
                                stock_name: stock_name,
                            })
                        } else if (target.classList.contains('history_appraise')) {
                            // 历史
                            moduleJump('stockGSYJJD_prev',  {
                                stock_code: stock_code,
                                stock_name: stock_name,
                            })
                        }
                    }

                    break
                case 'hold_change':
                    // 机构持仓
                    {
                        moduleJump('stockZLJGCC', {
                            stock_code: stock_code,
                            stock_name: stock_name,
                        })
                    }
                    break
                case 'business_status_new':
                    // 行业地位
                    moduleJump('stockHYDW', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'industry_appraise':
                    // 行业业绩鉴定
                    const industry_params = {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    }
                    if (this.tag_data.sw_third_name) {
                        industry_params.sw_third_name = this.tag_data.sw_third_name
                    }
                    if (target.classList.contains('future_appraise')) {
                        moduleJump('stockHYYJJD_cur', {
                            stock_code: stock_code,
                            stock_name: stock_name,
                        })
                    } else if (target.classList.contains('history_appraise')) {
                        moduleJump('stockHYYJJD_prev', {
                            stock_code: stock_code,
                            stock_name: stock_name,
                        })
                    }
                    break
                case 'financing_securities_loan':
                    // 融资融券
                    // TODO:
                    moduleJump('stockRZRQ', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'hold_percent':
                    // 互联互通(持仓占比)
                    moduleJump('stockHTHTCCZB', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'success_rate':
                    // 季度胜率
                    moduleJump('stockJDSL_cur', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'industry_future':
                    // 行业业绩预判
                    const rotogenesis_params = {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    }
                    if (this.tag_data.sw_third_name) {
                        rotogenesis_params.sw_third_name = this.tag_data.sw_third_name
                    }
                    moduleJump('stockHYYJYP', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                        sw_third_name: this.tag_data.sw_third_name,
                    })
                    break
                case 'industry_periodicity':
                    // 行业周期
                    moduleJump('stockHYZQX', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'periodicity':
                    // 个股风格
                    moduleJump('stockGGFG', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
                case 'over_rate':
                    // 超额收益
                    moduleJump('stockOverRate', {
                        stock_code: stock_code,
                        stock_name: stock_name,
                    })
                    break
            }
        },
    },
}
</script>

<style lang="less">
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
        color: var(--white);
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
        color: var(--color-white);
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
        background: url("~@assets/honor-common.png") no-repeat -2px -2px;
    }
    .good-honor {
        background: url("~@assets/honor-good.png") no-repeat -2px -2px;
    }
    .hope-honor {
        background: url("~@assets/honor-hope.png") no-repeat -2px -2px;
    }
}
</style>
