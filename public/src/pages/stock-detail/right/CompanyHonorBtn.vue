<template>
    <button
        id="company-honor-tag"
        class="company_honor"
        :class="honorClass"
        :title="remark"
        type="button"
    >
        {{showMsg}}
    </button>
</template>

<script>
import { getCompanyHonor } from '@service/index.js'

export default {
    name: 'companyHonorBtn',
    data() {
        return {
            showMsg: '',
            remark: '',
            type: null,
        }
    },
    mounted() {
        if (this.stock_code) {
            this.getHonorData()
        }
    },
    computed: {
        honorClass() {
            const maps = Object.create(null, {
                '1': {
                    get() {
                        return 'btn-tips btn-tips-Red'
                    },
                },
                '2': {
                    get() {
                        return 'btn-tips btn-tips-Star'
                    },
                },
            })

            return maps[this.type] || 'honor-hidden'
        },
    },
    methods: {
        getHonorData() {
            var params = {
                options: {
                    stock_code: this.stock_code,
                },
                callback0: data => {
                    this.showMsg = data.name
                    this.remark = data.remark
                    this.type = data.type
                },
                callback1001: () => {
                    this.showMsg = ''
                    this.remark = ''
                    this.type = null
                },
            }

            getCompanyHonor(params)
        },
    },
    props: ['stock_code'],
}
</script>

<style lang="less">
    .honor-hidden {
        display: none;
    }
    .btn-tips {
        cursor: pointer;
        padding: 0;
        text-align: center;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
    }
    .btn-tips-Red {
        background-color: #FB3E1B;
    }
    .btn-tips-Star{
        background-color: #ffa100;
    }
</style>
