<template>
    <div
        class="belong_industry"
    >
        <button
            type="button"
            class="belong_industry_name"
            @click.stop="fetchData"
            :stock_code="stock_code"
        >
            {{industry_name}}
        </button>
        <ul
            v-if="showSelectList"
            class="belong_industry_list"
            @click="handleClick"
        >
            <li
                v-for="(item, index) of plateData"
                :data-index="index"
                :key="index"
            >
                {{item.name}}
            </li>
        </ul>
    </div>
</template>

<script>
import {
    mapState,
} from 'vuex'
import {
    getIndustryBelongPlate,
} from '@service/index'
import {
    toType,
} from '@formatter/utility'
import {
    JsToQtEventInterface,
} from '@c/utils/callQt'

export default {
    name: "BelongIndustry",
    mounted() {
        document.addEventListener('click', this.hideSelectListState)
    },
    data() {
        return {
            plateData: [],
            flag: false,
        }
    },
    computed: {
        ...mapState([
            'stock_code',
            'stock_name',
        ]),
        showSelectList() {
            return this.plateData.length && this.flag
        },
    },
    methods: {
        fetchData() {
            if (Object.is(this.plateData.length, 0)) {
                this.getBelongIndustry()
            } else {
                this.flag = !this.flag
            }
        },
        getBelongIndustry() {
            const params = {
                options: {
                    stock_code: this.stock_code,
                },
                callback0: (data) => {
                    let maps = []
                    if (toType(data.industry) === 'object') {
                        data.industry.type = -2
                        maps.push(data.industry)
                    }
                    if (toType(data.plate) === 'array') {
                        data.plate.forEach((element) => {
                            element.type = 1
                        })

                        maps.push(...data.plate)
                    }

                    this.plateData = maps
                    this.flag = true
                },
                callback1001: () => {
                    this.plateData = []
                    this.flag = false
                },
            }

            getIndustryBelongPlate(params)
        },
        skipMarket(data) {
            let { type, code, name } = data
            let switchType = Object.is(type, 1) ? 'gn_index' :
                             Object.is(type, -2) ? 'hy_index' :
                             Object.is(type, 2) ? 'index' :
                             'index'
            const params = {
                code: 'LB' + code,
                name: encodeURIComponent(name),
                type: type,
                stockCode: this.stock_code,
                stockName: this.stock_name,
            }

            JsToQtEventInterface(JSON.stringify({
                fun: 'SendwebTowebEvent',
                data: {
                    destID: 'stockMarket',//目的webid
                    eventName: 'plateSelected',//事件名
                    eventContent: JSON.stringify(params),//事件参数
                }
            }))
        },
        handleClick(event) {
            let target = event.target
            if (target.tagName.toLowerCase() !== 'li') {
                return false
            }
            let index = target.dataset.index
            let data = this.plateData[index]

            this.skipMarket(data)
        },
        hideSelectListState() {
            this.flag = false
        },
    },
    beforeDestroy() {
        document.removeEventListener('click', this.hideSelectListState)
    },
    props: [
        "industry_name",
    ],
    watch: {
        stock_code() {
            this.plateData = []
            this.flag = false
        },
    },
}
</script>

<style lang="less">
    .belong_industry {
        position: relative;
        font-size: 12px;
        cursor: pointer;
    }
    .belong_industry_name {
        background-color: var(--color-smallcard-background);
        border-radius: 2px;
        padding: 2px 5px;
        border: 0;
        outline: none;
    }
    .belong_industry_list {
        position: absolute;
        z-index: 666;
        background-color: #EFEFEF;
        color: #333;
        border-radius: 2px;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.12);
        li {
            height: 18px;
            padding: 0 10px 0 6px;
            white-space: nowrap;
            &.active,
            &:hover {
                color: var(--color-white);
                background-color: #166BD0;
            }
        }
    }
</style>