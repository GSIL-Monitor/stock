<!-- 选择日期 -->
<template>
    <div class="ht-date-picker-calendar" v-clickoutside="hideCalendar">
        <input @click="showCalendar" type="text" :value="datePickerInputText" class="ht-calendar-date-picker-text" readonly />
        <div class="ht-calendar-date-picker-popup clearfix" v-show="showCalendarBox != 0">
            <!-- 日期 -->
            <div v-show="showCalendarBox == 1">
                <p class="ht-calendar-ctrl">
                    <span class="ht-calendar-left-arrow" @click="goBackMonth()"></span>
                    <!-- m 可能为 0，所以用的是(m + 1) || (month + 1) -->
                    <span class="ht-calendar-ctrl-text" @click="showCalendarBox = 2">{{y || year}}年{{(m + 1) || (month + 1)}}月</span>
                    <span class="ht-calendar-right-arrow" @click="goAheadMonth()"></span>
                </p>
                <p class="ht-calendar-date">
                    <span class="ht-calendar-week" v-for="item in week">{{item}}</span>
                    <span v-for="item in dateList" :class="[item.meta, item.isChosed?'ht-calendarchosen':'']" @click="pickDate(item)"> {{item.date}} </span>
                </p>
            </div>
            <!-- 月 -->
            <div v-show="showCalendarBox == 2">
                <p class="ht-calendar-ctrl">
                    <span class="ht-calendar-left-arrow" @click="goBackYear()"></span>
                    <span class="ht-calendar-ctrl-text" @click="showCalendarBox = 3">{{y || year}}年</span>
                    <span class="ht-calendar-right-arrow" @click="goAheadYear()"></span>
                </p>
                <p class="ht-calendar-month">
                    <span v-for="n in 12" @click="pickMonth(n-1)">{{n}}月</span>
                </p>
            </div>
            <!-- 年 -->
            <div v-show="showCalendarBox == 3">
                <p class="ht-calendar-ctrl" v-if="yearList[0]">
                    <span class="ht-calendar-left-arrow" @click="goBackDecade()"></span>
                    <span class="ht-calendar-ctrl-text">{{yearList[0].year}}-{{yearList[11].year}}</span>
                    <span class="ht-calendar-right-arrow" @click="goAheadDecade()"></span>
                </p>
                <p class="ht-calendar-year" v-if="yearList[0]">
                    <span v-for="item in yearList" @click="pickYear(item)">{{item.year}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    'use strict';
    import Clickoutside from '../../utils/clickoutside';
    export default {
        name: 'datePicker',
        props: {
            dp: {
                type: Object,
                default: () => { return {} }
            },
            reset: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                showCalendarBox: 0,
                week: ['日', '一', '二', '三', '四', '五', '六'],
                y: null, // --- 渲染日历的年份
                m: null, // --- 渲染日历的月份
                year: null, // --- 日期输入框中显示的年份
                month: null, // --- 日期输入框中显示的月份
                // day: null,
                date: null,
                dateList: [],
                yearList: []
            }
        },
        created() {
            // window.hui = this
            // --- 初始化日期
            let _date = new Date()
            _date.setFullYear(_date.getFullYear() + (this.dp.year || 0))
            _date.setMonth(_date.getMonth() + (this.dp.month || 0))
            _date.setDate(_date.getDate() + (this.dp.date || 0))
            this.year = _date.getFullYear()
            this.month = _date.getMonth()
            this.date = _date.getDate()
            this.y = this.year
            this.m = this.month
            this.generateDateList()
        },
        computed: {
            datePickerInputText() {
                let showMonth = this.month + 1
                return this.year + '-' + (showMonth < 10 ? '0' + showMonth : showMonth) + '-' + (this.date < 10 ? '0' + this.date : this.date)
            }
        },
        directives: {
            Clickoutside
        },
        methods: {
            generateDateList() {
                // --- 月份中的第一天
                let firstDayInMonth = new Date(this.y || this.year, this.m)
                // console.log(firstDayInMonth.toLocaleDateString());

                // --- 在一周中是第几天
                let dayIndexInWeek = firstDayInMonth.getDay()
                // --- 日历中的第一天
                let firstDayInList = new Date(firstDayInMonth - (dayIndexInWeek ? dayIndexInWeek : 7) * 24 * 60 * 60 * 1000)
                // --- 清空日期数组
                this.dateList = []
                for (let i = 0; i < 42; i++) {
                    let yearTemp = firstDayInList.getFullYear()
                    let monthTemp = firstDayInList.getMonth()
                    let dateTemp = firstDayInList.getDate()
                    if (yearTemp === this.y && monthTemp === this.m) {
                        // --- 年月相等
                        this.dateList.push({
                            date: dateTemp,
                            meta: 'current',
                            isChosed: yearTemp == this.y && monthTemp == this.m && dateTemp == this.date,
                        })
                    } else if (yearTemp > this.y || (yearTemp === this.y && monthTemp > this.m)) {
                        this.dateList.push({
                            date: dateTemp,
                            meta: 'next',
                            isChosed: false
                        })
                    } else {
                        this.dateList.push({
                            date: dateTemp,
                            meta: 'previous',
                            isChosed: false
                        })
                    }
                    let temp = firstDayInList
                    // console.log(+temp + 24 * 60 * 60 * 100,89);
                    firstDayInList = new Date(+ temp + 24 * 60 * 60 * 1000)
                }
            },
            goBackMonth() {
                if (this.m === 0) {
                    this.m = 11
                    this.y -= 1
                } else {
                    this.m -= 1;
                }
                this.generateDateList()
                // this.isDateChosed()
            },
            goAheadMonth() {
                if (this.m === 11) {
                    this.m = 0
                    this.y += 1
                } else {
                    this.m += 1;
                }
                this.generateDateList()
                // this.isDateChosed()
            },
            goBackYear() {
                this.y -= 1
            },
            goAheadYear() {
                this.y += 1
            },
            goBackDecade() {
                this.yearList.forEach((item, index, arr) => {
                    // console.log(this.date, item.date);
                    arr[index].year -= 10
                })
            },
            goAheadDecade() {
                this.yearList.forEach((item, index, arr) => {
                    // console.log(this.date, item.date);
                    arr[index].year += 10
                })
                // console.log(this.yearList);
            },
            pickDate(_item) {
                // console.log(_item);
                this.date = _item.date
                if (_item.meta === 'previous') {
                    // console.log('-----',new Date(2017,-1,2));

                    // console.log('y m d: ', this.y, this.m - 1, this.date);
                    var dateTemp = new Date(this.y, this.m - 1, this.date)
                    // console.log('dateTemp: ', this.y, this.m - 1, this.date, dateTemp);
                    this.m = dateTemp.getMonth()
                    this.y = dateTemp.getFullYear()
                } else if (_item.meta === 'next') {
                    // console.log('y m d: ', this.y, this.m - 1, this.date);
                    var dateTemp = new Date(this.y, this.m + 1, this.date)
                    // console.log('dateTemp: ', this.y, this.m - 1, this.date, dateTemp);
                    this.m = dateTemp.getMonth()
                    this.y = dateTemp.getFullYear()
                }
                this.month = this.m
                this.year = this.y
                this.dateList.forEach((item, index, arr) => {
                    // console.log(this.date, item.date);
                    arr[index].isChosed = (this.date == item.date)
                })
                // console.log(JSON.stringify(this.dateList));
                console.log('emit date: ', this.year + '-' + (this.month + 1) + '-' + this.date)
                this.$emit('dateChanged', this.year + '-' + (this.month + 1) + '-' + this.date)
                this.hideCalendar();
            },
            pickMonth(_item) {
                // console.log(_item);
                this.m = _item
                this.showCalendarBox = 1
                this.generateDateList()
            },
            pickYear(_item) {
                // console.log(_item);
                this.y = _item.year
                this.showCalendarBox = 2
                this.generateDateList()
            },
            showCalendar() {
                this.y = this.year
                this.m = this.month
                this.generateDateList()
                this.showCalendarBox = 1
            },
            hideCalendar() {
                this.showCalendarBox = 0
                this.y = null
                this.m = null
            }
        },
        watch: {
            reset(newVal) {
                var {year, month, date} = newVal;
                if (year && month && date) {
                    let _date = new Date(year, month-1, date)
                    this.year = _date.getFullYear()
                    this.month = _date.getMonth()
                    this.date = _date.getDate()
                }
            },
            y(newVal, oldVal) {
                // console.log(newVal, oldVal);
                this.yearList = []
                let yearTemp = Math.floor(this.y / 10) * 10 - 1
                this.yearList.push({
                    year: yearTemp++,
                    meta: 'previous',
                })
                for (let i = 0; i < 10; i++) {
                    this.yearList.push({
                        year: yearTemp++,
                        meta: 'current',
                    })
                }
                this.yearList.push({
                    year: yearTemp++,
                    meta: 'next',
                })
            }
        }
    }
</script>
<style lang="less">
    @import './calendar.less';
</style>
