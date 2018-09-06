<!-- 选择时间段 -->
<!-- date range -->
<template>
    <div class="ht-calendar ht-date-range-calendar">
        <span class="ht-calendar-time">统计区间：</span>
        <div class="ht-calendar-container" v-clickoutside="cancelDateRange">
            <p class="ht-calendar-text">
                <!--<span class="ht-calendar-date-range-text">{{dateRangeInputText}}</span>-->
                <input @click="clickHtCalendar" type="text" :value="dateRangeInputText" class="ht-calendar-date-range-text" readonly/>
            <!--<input type="text" v-model="dateRangeInputText" @click="clickHtCalendar" />-->
            <div class="ht-calendar-popup clearfix" v-show="showCalendar">
                <div class="ht-calendar-left">
                    <div v-show="!left.showCalendar">
                        <!-- 左 年 -->
                        <p class="ht-calendar-ctrl">
                            <span class="ht-calendar-left-arrow" @click="goBackYear(left)"></span>
                            <span class="ht-calendar-ctrl-text" @click="left.showCalendar=!left.showCalendar">{{left.year}}年</span>
                            <span class="ht-calendar-right-arrow" @click="goAheadYear(left)" v-show="left.year < right.year && right.month != 0"></span>
                        </p>
                        <p class="ht-calendar-month">
                            <span v-for="n in 12" @click="chooseMonth(left,n-1,$event)" :class="[left.year < right.year || (right.year === left.year && n - 1 < right.month)?'ht-available':'ht-unavailable']">{{n}}月</span>
                        </p>
                    </div>
                    <div v-show="left.showCalendar">
                        <!-- 左 月 -->
                        <p class="ht-calendar-ctrl">
                            <span class="ht-calendar-left-arrow" @click="goBackMonth(left)"></span>
                            <span class="ht-calendar-ctrl-text" @click="left.showCalendar=!left.showCalendar">{{left.year}}年{{left.month + 1}}月</span>
                            <span class="ht-calendar-right-arrow" @click="goAheadMonth(left)" v-show="!(left.year + 1 === right.year && left.month === 11 && right.month === 0) && left.year < right.year || (left.year === right.year && left.month < right.month - 1)"></span>
                        </p>
                        <p class="ht-calendar-date">
                            <span class="ht-calendar-week"  v-for="item in week">{{item}}</span>
                            <span v-for="item in left.dateList" :class="[item.meta, item.isChosed?'ht-calendarchosen':'', item.isChosedStartDate?'ht-calendar-chosed-start-date':'']"
                                @click="chooseDateRange(item,left,$event)"> {{item.date}} </span>
                        </p>
                    </div>
                </div>
                <div class="ht-calendar-center">
                    <div v-show="!right.showCalendar">
                        <!-- 右 年 -->
                        <p class="ht-calendar-ctrl">
                            <span class="ht-calendar-left-arrow" @click="goBackYear(right)" v-show="left.year < right.year && left.month != 11"></span>
                            <span class="ht-calendar-ctrl-text" @click="right.showCalendar=!right.showCalendar">{{right.year}}年</span>
                            <span class="ht-calendar-right-arrow" @click="goAheadYear(right)"></span>
                        </p>
                        <p class="ht-calendar-month">
                            <span v-for="n in 12" @click="chooseMonth(right,n-1,$event)" :class="[right.year>left.year || (right.year === left.year && n -1 > left.month)?'ht-available':'ht-unavailable']">{{n}}月</span>
                        </p>
                    </div>
                    <div v-show="right.showCalendar">
                        <!-- 右 月 -->
                        <p class="ht-calendar-ctrl">
                            <span class="ht-calendar-left-arrow" @click="goBackMonth(right)" v-show="!(left.year + 1 === right.year && left.month === 11 && right.month === 0) && left.year < right.year || (left.year === right.year && left.month < right.month - 1)"></span>
                            <span class="ht-calendar-ctrl-text" @click="right.showCalendar=!right.showCalendar">{{right.year}}年{{right.month + 1}}月</span>
                            <span class="ht-calendar-right-arrow" @click="goAheadMonth(right)"></span>
                        </p>
                        <p class="ht-calendar-date">
                            <span class="ht-calendar-week" v-for="item in week">{{item}}</span>
                            <span v-for="item in right.dateList" :class="[item.meta, item.isChosed?'ht-calendarchosen':'', item.isChosedStartDate?'ht-calendar-chosed-start-date':'']"
                                @click="chooseDateRange(item,right,$event)"> {{item.date}} </span>
                        </p>
                    </div>
                </div>
                <div class="ht-calendar-right">
                    <p v-if="initData.showChooseFurtureDateRangeBtn">
                        <button class="ht-calendar-long-btn" :class="[longBtnStyled === 2 ? 'active': '']" @click="chooseFurtureDateRange(10)">未来10天
                        </button>
                    </p>
                    <p v-if="initData.showChooseFurtureDateRangeBtn">
                        <button class="ht-calendar-long-btn" :class="[longBtnStyled === 3 ? 'active': '']" @click="chooseFurtureDateRange(30)">未来30天
                        </button>
                    </p>
                    <p v-if="initData.showChooseFurtureDateRangeBtn">
                        <button class="ht-calendar-long-btn" :class="[longBtnStyled === 1 ? 'active': '']" @click="chooseThisWeek">
                            本周
                        </button>
                    </p>
                    <p class="ht-calendar-confirm-cancel-btns">
                        <button class="ht-calendar-confirm" :class="[dateRange.start.year ? '':'ht-calendar-confirm-unactive']" @click="confirmDateRange">确认</button>
                        <button class="ht-calendar-cancel" @click="cancelDateRange">取消</button>
                    </p>
                </div>
            </div>
            </p>
        </div>

    </div>
</template>
<script>
    'use strict';
    import Clickoutside from '../../utils/clickoutside';
    export default {
        name: 'dateRange',
        props: {
            dr: {
                type: Object,
                default: () => { return {} }
            }
        },
        data() {
            return {
                showCalendar: false,
                week: ['日', '一', '二', '三', '四', '五', '六'],
                left: {
                    year: null,
                    month: null,
                    day: null,
                    date: null,
                    dateList: [],
                    showCalendar: true,
                },
                right: {
                    year: null,
                    month: null,
                    day: null,
                    date: null,
                    dateList: [],
                    showCalendar: true,
                },
                // --- 选取的日期区间
                dateRange: {
                    start: {},
                    end: {},
                    temp: {}
                },
                // --- 选取日期之前先存储之前的时间范围
                oldDateRange: {},
                // --- 初始化日历的参数
                initData: {
                    // --- 是否显示快捷选择日期的按钮
                    showChooseFurtureDateRangeBtn: false,
                    start: {
                        // --- 初始化左侧日历的参数
                        year: 0,
                        month: 0,
                        date: 0
                    },
                    end: {
                        // --- 初始化右侧日历的参数
                        year: 0,
                        month: 0,
                        date: 0
                    }
                },
                longBtnStyled: 0,
                longBtnStyledOld: null,
                isNeedResetRightBtnsStyle: 0
            }
        },
        computed: {
            dateRangeInputText: function () {
                var month = this.dateRange.start.month+1 <=9 ? '0'+String(this.dateRange.start.month+1):this.dateRange.start.month+1;
                var date = this.dateRange.start.date <=9 ? '0'+String(this.dateRange.start.date):this.dateRange.start.date;
                var month_1 = this.dateRange.end.month+1 <=9 ? '0'+String(this.dateRange.end.month+1):this.dateRange.end.month+1;
                var date_1 = this.dateRange.end.date <=9 ? '0'+this.dateRange.end.date:this.dateRange.end.date;
                var month_2 = this.dateRange.temp.month+1 <=9 ? '0'+String(this.dateRange.temp.month+1):this.dateRange.temp.month+1;
                var date_2 = this.dateRange.temp.date <=9 ? '0'+String(this.dateRange.temp.date):this.dateRange.temp.date;
                if (this.dateRange.start.year && this.dateRange.end.year) {
                    return this.dateRange.start.year + '-' + month + '-' + date + ' 至 ' + this.dateRange.end.year + '-' + month_1 + '-' + date_1
                } else if (this.dateRange.temp.year) {
                    return this.dateRange.temp.year + '-'+ month_2 + '-' + date_2
                }
            }
        },
        directives: {
            Clickoutside
        },
        created() {
            // --- 初始化参数
            if (this.dr.showChooseFurtureDateRangeBtn) {
                this.initData.showChooseFurtureDateRangeBtn = this.dr.showChooseFurtureDateRangeBtn
            }
            if (this.dr.start) {
                this.initData.start.year = this.dr.start.year || 0
                this.initData.start.month = this.dr.start.month || 0
                this.initData.start.date = this.dr.start.date || 0
            }
            if (this.dr.end) {
                this.initData.end.year = this.dr.end.year || 0
                this.initData.end.month = this.dr.end.month || 0
                this.initData.end.date = this.dr.end.date || 0
            }
            // --- 初始化右侧快捷按钮的样式
            if (this.dr.end && this.dr.end.date == 10 - 1) {
                this.longBtnStyled = 2
            } else if (this.dr.end && this.dr.end.date == 30 - 1) {
                this.longBtnStyled = 3
            } else {
                // --- todo
            }
            this.calendarInit()
            this.isDateChosed()
            this.confirmDateRange()
        },
        methods: {
            clickHtCalendar() {
                if (!this.showCalendar) {
                    this.oldDateRange = {
                        start: {
                            year: this.dateRange.start.year,
                            month: this.dateRange.start.month,
                            date: this.dateRange.start.date
                        },
                        end: {
                            year: this.dateRange.end.year,
                            month: this.dateRange.end.month,
                            date: this.dateRange.end.date
                        }
                    }
                    if (this.longBtnStyled) {
                        this.longBtnStyledOld = this.longBtnStyled
                    }
                }

                // this.calendarInit()
                this.showCalendar = !this.showCalendar
                // console.log(this);
            },
            calendarInit() {
                // --- 日历初始化 this.now this.left this.right
                let startDate = new Date()
                startDate.setFullYear(this.initData.start.year)  //startDate.getFullYear() +
                startDate.setMonth(this.initData.start.month)    //startDate.getMonth() +
                startDate.setDate(this.initData.start.date)      //startDate.getDate() +
                this.dateRange.start.year = startDate.getFullYear()
                this.dateRange.start.month = startDate.getMonth()
                // this.dateRange.start.day = startDate.getDay()
                this.dateRange.start.date = startDate.getDate()

                let endDate = new Date()
                endDate.setFullYear(this.initData.end.year)   //endDate.getFullYear() +
                endDate.setMonth(this.initData.end.month)     //endDate.getMonth() +
                endDate.setDate(this.initData.end.date)       //endDate.getDate() +
                this.dateRange.end.year = endDate.getFullYear()
                this.dateRange.end.month = endDate.getMonth()
                // this.dateRange.end.day = endDate.getDay()
                this.dateRange.end.date = endDate.getDate()

                // --- 如果左右日历为同年的同一月，则右边的日历月份加一
                let leftDate = new Date(this.dateRange.start.year, this.dateRange.start.month)
                let rightDate = new Date(this.dateRange.end.year, this.dateRange.end.month)

                if (this.dateRange.start.year === this.dateRange.end.year && this.dateRange.start.month === this.dateRange.end.month) {
                    rightDate.setMonth(rightDate.getMonth() + 1)
                }

                this.left.year = leftDate.getFullYear()
                this.left.month = leftDate.getMonth()
                this.left.day = leftDate.getDay()
                this.left.date = leftDate.getDate()
                this.right.year = rightDate.getFullYear()
                this.right.month = rightDate.getMonth()
                this.right.day = rightDate.getDay()
                this.right.date = rightDate.getDate()

                this.dateRange.temp = {}

                this.generateDateList(this.left)
                this.generateDateList(this.right)
                this.isDateChosed()
            },
            generateDateList(params) {
                // --- 月份中的第一天
                let firstDayInMonth = new Date(params.year, params.month)
                // console.log('firstDayInMonth: ', firstDayInMonth);
                // --- 在一周中是第几天
                let dayIndexInWeek = firstDayInMonth.getDay()
                // console.log('dayIndexInWeek: ', dayIndexInWeek);
                params.dateList = [];

                // --- 日历中的第一天
                let firstDayInList = new Date(firstDayInMonth - (dayIndexInWeek ? dayIndexInWeek : 7) * 24 * 60 * 60 * 1000)
                // console.log(firstDayInList)
                for (let i = 0; i < 42; i++) {
                    let yearTemp = firstDayInList.getFullYear()
                    let monthTemp = firstDayInList.getMonth()
                    let dateTemp = firstDayInList.getDate()
                    if (yearTemp === params.year && monthTemp === params.month) {
                        params.dateList.push({
                            date: dateTemp,
                            meta: 'current',
                            isChosedStartDate: yearTemp == this.dateRange.temp.year && monthTemp == this.dateRange.temp.month && dateTemp == this.dateRange.temp.date,
                            isChosed: false
                        })
                    } else if (yearTemp > params.year || (yearTemp === params.year && monthTemp > params.month)) {
                        params.dateList.push({
                            date: dateTemp,
                            meta: 'next',
                            isChosedStartDate: false,
                            isChosed: false
                        })
                    } else {
                        params.dateList.push({
                            date: dateTemp,
                            meta: 'previous',
                            isChosedStartDate: false,
                            isChosed: false
                        })
                    }
                    let temp = firstDayInList
                    // console.log(+temp + 24 * 60 * 60 * 100,89);
                    firstDayInList = new Date(+temp + 24 * 60 * 60 * 1000)
                    // console.log(firstDayInList);
                    // console.log(params.dateList[i].date);
                }
                // console.log(params.dateList);
            },
            // --- 选择月份
            chooseMonth(params, n, e) {
                // console.log(e);
                if (e.target.className === 'ht-unavailable') {
                    return
                }
                params.month = n
                params.showCalendar = !params.showCalendar
                this.generateDateList(params)
            },
            goBackYear(params) {
                params.year -= 1
            },
            goAheadYear(params) {
                params.year += 1
            },
            goBackMonth(params) {
                if (params.month === 0) {
                    params.month = 11
                    params.year -= 1
                } else {
                    params.month -= 1;
                }
                // console.log(this.left,this.right);
                this.generateDateList(params)
                this.isDateChosed()
            },
            goAheadMonth(params) {
                if (params.month === 11) {
                    params.month = 0
                    params.year += 1
                } else {
                    params.month += 1;
                }
                this.generateDateList(params)
                this.isDateChosed()
            },
            chooseDateRange(date, params, e) {
                if (date.meta !== "current") {
                    return
                }
                this.longBtnStyled = 0
                // console.log('---', date, params);
                if (!this.dateRange.temp.year) {
                    this.dateRange.temp.year = params.year
                    this.dateRange.temp.month = params.month
                    this.dateRange.temp.date = date.date

                    this.dateRange.start = {}
                    this.dateRange.end = {}
                    // console.log(this.dateRange)
                    this.dateUnChosed()
                    date.isChosedStartDate = true
                } else {
                    if ((new Date(this.dateRange.temp.year, this.dateRange.temp.month, this.dateRange.temp.date)) < (new Date(params.year, params.month, date.date))) {
                        this.dateRange.start = {
                            year: this.dateRange.temp.year,
                            month: this.dateRange.temp.month,
                            date: this.dateRange.temp.date
                        }
                        this.dateRange.end = {
                            year: params.year,
                            month: params.month,
                            date: date.date
                        }
                    } else {
                        this.dateRange.start = {
                            year: params.year,
                            month: params.month,
                            date: date.date
                        }
                        this.dateRange.end = {
                            year: this.dateRange.temp.year,
                            month: this.dateRange.temp.month,
                            date: this.dateRange.temp.date
                        }
                    }
                    this.dateRange.temp = {}
                    this.isDateChosed()
                    // console.log(this.dateRange)
                }
            },
            chooseFurtureDateRange(dayCount) {
                this.left.showCalendar = true
                this.right.showCalendar = true
                // --- 选择未来的一段时间，单位（天）
                this.calendarInit()
                let startDate = new Date()
                // console.log(startDate);
                let endDate = new Date(+startDate + (dayCount - 1) * 24 * 60 * 60 * 1000)
                // console.log(endDate);
                this.longBtnStyled = dayCount === 10 ? 2 : 3
                this.isNeedResetRightBtnsStyle = 0
                this.dateRange = {
                    start: {
                        year: startDate.getFullYear(),
                        month: startDate.getMonth(),
                        date: startDate.getDate()
                    },
                    end: {
                        year: endDate.getFullYear(),
                        month: endDate.getMonth(),
                        date: endDate.getDate()
                    },
                    temp: {}
                }
                if (this.dateRange.end.month > this.right.month || this.dateRange.end.year > this.right.year) {
                    // --- todo
                    this.right.year = this.dateRange.end.year
                    this.right.month = this.dateRange.end.month
                    this.generateDateList(this.right)
                }
                this.isDateChosed()
                // console.log(JSON.stringify(this.now), '\n\n', JSON.stringify(this.left), '\n\n', JSON.stringify(this.right), '\n\n', JSON.stringify(this.dateRange));
            },
            chooseThisWeek() {
                this.longBtnStyled = 1
                this.isNeedResetRightBtnsStyle = 0
                this.left.showCalendar = true
                this.right.showCalendar = true
                // --- 本周
                this.calendarInit()
                let today = new Date()
                let startDate = new Date(+today - (today.getDay() ? today.getDay() - 1 : 6) * 24 * 60 * 60 * 1000)
                let endDate = new Date(+today + (today.getDay() ? 7 - today.getDay() : 0) * 24 * 60 * 60 * 1000)
                // console.log(startDate, endDate);

                this.dateRange = {
                    start: {
                        year: startDate.getFullYear(),
                        month: startDate.getMonth(),
                        date: startDate.getDate()
                    },
                    end: {
                        year: endDate.getFullYear(),
                        month: endDate.getMonth(),
                        date: endDate.getDate()
                    },
                    temp: {}
                }
                this.isDateChosed()
            },
            confirmDateRange() {
                if (this.dateRange.temp.year) {
                    return
                }

                if (this.dr.maxDateRange) {
                    let info = ''
                    let chosedStartDate = new Date(this.dateRange.start.year, this.dateRange.start.month, this.dateRange.start.date)
                    if (this.dr.maxDateRange.year) {
                        chosedStartDate.setFullYear(chosedStartDate.getFullYear() + this.dr.maxDateRange.year)
                        info += this.dr.maxDateRange.year + '年'
                    }
                    if (this.dr.maxDateRange.month) {
                        chosedStartDate.setMonth(chosedStartDate.getMonth() + this.dr.maxDateRange.month)
                        info += this.dr.maxDateRange.month + '个月'
                    }
                    if (this.dr.maxDateRange.date) {
                        chosedStartDate.setDate(chosedStartDate.getdate() + this.dr.maxDateRange.date)
                        info += this.dr.maxDateRange.date + '日'
                    }
                    let chosedEndDate = new Date(this.dateRange.end.year, this.dateRange.end.month, this.dateRange.end.date)
                    // console.log('--',chosedStartDate - chosedEndDate);
                    if (chosedStartDate - chosedEndDate <= 0) {
                        alert('最大时间范围不超过' + info + '，请重新选择')
                        return
                    }
                }
                this.showCalendar = false
                if (this.dateRange.start.year && this.dateRange.end.year) {
                    this.$emit('dateRangeChanged', this.dateRange.start.year + '-' + (this.dateRange.start.month + 1) + '-' + this.dateRange.start.date, this.dateRange.end.year + '-' + (this.dateRange.end.month + 1) + '-' + this.dateRange.end.date)
                }
                this.left.year = this.dateRange.start.year
                this.left.month = this.dateRange.start.month
                if (this.dateRange.start.year === this.dateRange.end.year && this.dateRange.start.month === this.dateRange.end.month) {

                    if (this.dateRange.start.month === 11) {
                        this.right.year = this.dateRange.end.year + 1
                        this.right.month = 0
                    } else {
                        this.right.year = this.dateRange.end.year
                        this.right.month = this.dateRange.end.month + 1
                    }
                } else {
                    this.right.year = this.dateRange.end.year
                    this.right.month = this.dateRange.end.month
                }
                if (this.longBtnStyledOld) {
                    this.longBtnStyledOld = null
                }
                this.left.showCalendar = true
                this.right.showCalendar = true
                this.generateDateList(this.left)
                this.generateDateList(this.right)
                this.isDateChosed()
            },
            cancelDateRange() {
                if (!this.showCalendar) {
                    return
                }
                this.dateRange = {
                    start: {
                        year: this.oldDateRange.start.year,
                        month: this.oldDateRange.start.month,
                        date: this.oldDateRange.start.date
                    },
                    end: {
                        year: this.oldDateRange.end.year,
                        month: this.oldDateRange.end.month,
                        date: this.oldDateRange.end.date
                    },
                    temp: {}
                }
                this.left.year = this.oldDateRange.start.year
                this.left.month = this.oldDateRange.start.month
                if (this.oldDateRange.start.year === this.oldDateRange.end.year && this.oldDateRange.start.month === this.oldDateRange.end.month) {

                    if (this.oldDateRange.start.month === 11) {
                        this.right.year = this.oldDateRange.end.year + 1
                        this.right.month = 0
                    } else {
                        this.right.year = this.oldDateRange.end.year
                        this.right.month = this.oldDateRange.end.month + 1
                    }
                } else {
                    this.right.year = this.oldDateRange.end.year
                    this.right.month = this.oldDateRange.end.month
                }
                // if(this.isNeedResetRightBtnsStyle === 0){
                //     this.longBtnStyled = this.longBtnStyledOld
                // }
                // if(this.longBtnStyledOld) {
                this.longBtnStyled = this.longBtnStyledOld
                this.longBtnStyledOld = null
                // }
                this.left.showCalendar = true
                this.right.showCalendar = true
                this.generateDateList(this.left)
                this.generateDateList(this.right)
                this.isDateChosed()
                this.showCalendar = false
            },
            isDateChosed() {
                this.dateUnChosed()
                let start = +new Date(this.dateRange.start.year, this.dateRange.start.month, this.dateRange.start.date)
                let end = +new Date(this.dateRange.end.year, this.dateRange.end.month, this.dateRange.end.date)
                for (let i = 0, arrlength = this.left.dateList.length; i < arrlength; i++) {
                    let cur = +new Date(this.left.year, this.left.month, this.left.dateList[i].date)
                    // console.log(start, end, cur);
                    if (cur >= start && cur <= end && this.left.dateList[i].meta === "current") {
                        this.left.dateList[i].isChosed = true
                    } else {
                        this.left.dateList[i].isChosed = false
                    }
                }
                for (let i = 0, arrlength = this.right.dateList.length; i < arrlength; i++) {
                    let cur = +new Date(this.right.year, this.right.month, this.right.dateList[i].date)
                    if (cur >= start && cur <= end && this.right.dateList[i].meta === "current") {
                        this.right.dateList[i].isChosed = true
                    } else {
                        this.right.dateList[i].isChosed = false
                    }
                }
            },
            dateUnChosed() {
                for (let i = 0, arrlength = this.left.dateList.length; i < arrlength; i++) {
                    this.left.dateList[i].isChosed = false
                    this.left.dateList[i].isChosedStartDate = false
                }
                for (let i = 0, arrlength = this.right.dateList.length; i < arrlength; i++) {
                    this.right.dateList[i].isChosed = false
                    this.right.dateList[i].isChosedStartDate = false
                }
            }
        }
    }

</script>
<style lang="less">
    @import './calendar.less';
</style>
