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
import {
    getIndustryBelongPlate,
} from '@service/index'
import {
    toType,
} from '@formatter/utility'

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
                        maps.push(data.industry)
                    }
                    if (toType(data.plate) === 'array') {
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
        skipMarket() {
            // 跳转行情
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
        "stock_code",
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