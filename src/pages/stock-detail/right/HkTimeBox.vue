<template>
    <div class="hk_timehint">
        <span
            v-if="isInBusiness"
            class="hk_timehint_first"
        >
            {{businessDayHint}}
        </span>
        <span>{{hint}}</span>
        <span
            v-if="isShowDealyHint"
            class="hk_timehint_last"
        >
            {{delayHint}}
        </span>
    </div>
</template>
<script>
import {
    isBusinessDay,
} from '@service/index.js'
import {
    formatDate,
    isHkRealTime,
    getTimeStamp,
} from '../utility.js'

export default {
    name: 'HkTimeBox',
    created() {
        this.isRealDay()
        this.fetchData()
    },
    data() {
        return {
            lastDate: null, // 记录最近一个日期的时间戳，刷新是否是交易日
            isReal: false,
            isMarketDay: null,
            intervalTimer: null,
            intervalStep: 1000,
            MIN15: 15 * 60 * 1000,
            isInBusiness: false,
            businessDayHint: '行情时间',
            hasNotOpening: '未开盘',
            hasClosed: '已收盘',
            stopBusiness: '休市',
            delayHint: '港股行情延时15分钟',
            hint: '',
        }
    },
    computed: {
        isShowDealyHint() {
            return !this.isReal
        },
    },
    methods: {
        formatIntradayHint(timeStamp) {
            let date = new Date(timeStamp),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes()
            if (hour < 10) {
                hour = `0${hour}`
            }
            if (minute < 10) {
                minute = `0${minute}`
            }
            return `${month}/${day} ${hour}:${minute}`
        },
        getRealTimeHint() {
            let nowTimeStamp = new Date().getTime()
            let timeStamp0_0 = getTimeStamp(0, 0)
            let timeStamp9_0 = getTimeStamp(0, 9)
            let timeStamp16_10 = getTimeStamp(0, 16, 10)
            if (nowTimeStamp >= timeStamp0_0 && nowTimeStamp < timeStamp9_0) {
                this.isInBusiness = false
                return this.hasNotOpening
            } else if (nowTimeStamp >= timeStamp9_0 && nowTimeStamp <= timeStamp16_10) {
                this.isInBusiness = true
                return this.formatIntradayHint(nowTimeStamp)
            } else if (nowTimeStamp > timeStamp16_10) {
                this.isInBusiness = false
                return this.hasClosed
            }
        },
        getNormalHint() {
            let nowTimeStamp = new Date().getTime()
            let timeStamp0_0 = getTimeStamp(0, 0)
            let timeStamp9_15 = getTimeStamp(0, 9, 15)
            let timeStamp16_25 = getTimeStamp(0, 16, 25)
            if (nowTimeStamp > timeStamp0_0 && nowTimeStamp < timeStamp9_15) {
                this.isInBusiness = false
                return this.hasNotOpening
            } else if (nowTimeStamp >= timeStamp9_15 && nowTimeStamp <= timeStamp16_25) {
                this.isInBusiness = true
                let prevTimeStamp = nowTimeStamp - this.MIN15
                return this.formatIntradayHint(prevTimeStamp)
            } else if (nowTimeStamp > timeStamp16_25) {
                this.isInBusiness = false
                return this.hasClosed
            }
        },
        dateChangedRefresh() {
            let date = new Date().getDate()
            if (!this.lastDate) {
                this.lastDate = date
            }
            if (!Object.is(this.lastDate, date) && navigator.onLine) {
                this.stopInterval()
                this.fetchData()
                this.lastDate = date
            }
        },
        formatHint() {
            this.dateChangedRefresh()
            if (!this.isMarketDay) {
                this.isInBusiness = false
                this.hint = this.stopBusiness
            } else {
                if (this.isReal) {
                    // 实时行情
                    this.hint = this.getRealTimeHint()
                } else {
                    // 延时行情
                    this.hint = this.getNormalHint()
                }
            }
        },
        fetchData() {
            const nowDay = formatDate(new Date(), 'yyyy-MM-dd')
            const param = {
                options: {
                    date: nowDay,
                },
                callback0: data => {
                    this.isMarketDay = Object.is(data.is_edate, 1)
                },
                afterResponse: () => {
                    this.startInterval()
                },
            }

            isBusinessDay(param)
        },
        isRealDay() {
            this.isReal = isHkRealTime()
        },
        startInterval() {
            this.intervalTimer = setInterval(() => {
                this.formatHint()
            }, this.intervalStep)
        },
        stopInterval() {
            if (this.intervalTimer) {
                clearInterval(this.intervalTimer)
                this.intervalTimer = null
            }
        },
    },
    beforeDestroy() {
        this.stopInterval()
    },
}
</script>

<style lang="less">
.hk_timehint {
    height: 22px;
    display: flex;
    align-items: center;
    color: var(--color-secondary-text);
}
@space: 7px;
.hk_timehint_first {
    margin-left: 2px;
    margin-right: @space;
}

.hk_timehint_last {
    margin-left: @space;
}
</style>
