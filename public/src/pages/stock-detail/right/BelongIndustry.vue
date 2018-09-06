<template>
    <div
        class="belong_industry"
    >
        <button
            type="button"
            class="belong_industry_name"
            @click="getBelongIndustry"
            :stock_code="stock_code"
        >
            {{industry_name}}
        </button>
        <ul
            v-if="this.plateData.length"
            class="belong_industry_list"
            @click="skipMarket"
        >
            <li
                v-for="(item, index) of plateData"
                :key="index"
            >
                {{item.name}}
            </li>
        </ul>
    </div>
</template>

<script>
import { getIndustryBelongPlate } from '@service/index.js'
import { getToken } from '@c/utils/util.js';
import { toType } from '@formatter/utility.js'

export default {
    name: "belongIndustry",
    data() {
        return {
            plateData: []
        }
    },
    computed: {

    },
    methods: {
        getBelongIndustry() {
            const params = {
                options: {
                    stock_code: this.stock_code,
                    token: getToken(),
                },
                callback0: (data) => {
                    let maps = []
                    if (toType(data.industry) === 'object') {
                        maps.push(data.industry)
                    }
                    if (toType(data.plate) === 'array') {
                        maps.push(...data.plate)
                    }

                    this.plateData = maps
                },
                callback1001: () => {
                    this.plateData = []
                }
            }

            getIndustryBelongPlate(params)
        },
        skipMarket() {
            // 跳转行情
        },
    },
    destroyed() {

    },
    props: [
        "industry_name",
        "stock_code"
    ]
}
</script>

<style lang="less">
    .belong_industry {
        position: relative;
        font-size: 12px;
        cursor: pointer;
    }
    .belong_industry_name {
        background-color: rgba(255,255,255,.09);
        border-radius: 2px;
        padding: 0 5px;
        color: rgba(255,255,255,.75);
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
        }
    }
</style>