<template>
    <button
        class="company_honor"
        :class="honorClass"
        :title="remark"
        type="button"
        v-if="showMsg"
        @click="showCompanyHonorDetail"
    >
        {{showMsg}}
    </button>
</template>

<script>
import {
    getCompanyHonor,
} from '@service/index'
import {
    verifyPermission,
} from '@c/utils/permission/'

export default {
    name: 'CompanyHonorBtn',
    created() {
        if (this.stock_code) {
            this.getHonorData()
        }
    },
    data() {
        return {
            showMsg: '',
            remark: '',
            type: null,
            myStockPermissionCode: ['TG_002', 'ZT_stocks'],
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
            const params = {
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
        showCompanyHonorDetail() {
            if (verifyPermission(this.myStockPermissionCode)) {
                // 打开远端页面

            }
        },
    },
    props: [
        'stock_code'
    ],
    watch: {
        stock_code() {
            this.showMsg = ''
            this.getHonorData()
        },
    },
}
</script>

<style lang="less">
    .honor-hidden {
        display: none;
    }
    .btn-tips {
        cursor: pointer;
        padding: 1px 3px;
        text-align: center;
        color: var(--white);
        font-size: 12px;
        border-radius: 3px;
        border: 0;
        outline: none;
    }
    .btn-tips-Red {
        background-color: #FB3E1B;
    }
    .btn-tips-Star{
        background-color: #ffa100;
    }
</style>
