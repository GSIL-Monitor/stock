<template>
    <div id="app">
        <div class="login-page" v-show="!passed">
            <span class="color-white">账号:</span> <input type="text" placeholder="GO-GOAL账号" v-model="user"> <br> <br>
            <span class="color-white">密码:</span> <input type="password" class="psd" placeholder="密码" v-model="pass" @keyup.enter="clickButton"> <br> <br>
            <search-btn class="submit" v-on:click="clickButton">登录</search-btn>
        </div>
        <div class="pages" v-show="passed">
            <div class="urlBox">
                <a class="link" href="/stockDetail.html">个股</a><br><br>
            </div>
            <!-- <div class="eTitle">Vue-Echarts example</div>
            <chart :options="polarBar" class="myDemo" ref="demo"></chart>
            <chart :options="polarLine"></chart> -->
        </div>
    </div>
</template>
<script>
import commonStyle from '@c/commonStyle/index.js'
import searchBtn from '@c/button.vue';
import {
    loginIn,
} from '../../service/index'
export default {
    name: 'app',
    components: {
        commonStyle,
        searchBtn,
    },
    beforeCreate() {
        goGoal.detectSelectedTheme();//检查皮肤
    },
    mounted() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) {
                if (!this.passed) {
                    this.clickButton();
                }
            }
        }, false);
        // const chart = this.$refs.demo;
        // console.log(this.$refs.demo);
        // this.$refs.demo.showLoading();
        // this.$refs.demo.hideLoading();
        // document.getElementsByClassName('myDemo')[0].addEventListener('click', (e) => {
        //     console.log(1);
        //     if(e.offsetY < 50) return;
        //     chart.dispatchAction({
        //         type: 'legendToggleSelect',
        //         name: '销量'
        //     })
        // })
        // chart.dispatchAction({
        //     type: 'legendToggleSelect',
        //     // 图例名称
        //     name: '销量1'
        // });
        // chart.dispatchAction({
        //     type: 'legendSelect',
        //     // 图例名称
        //     name: '销量1'
        // });
        // chart.chart.on('legendselectchanged', (params) => {
        //     console.log(params);
        // })
    },
    data() {
        return {
            user: '',
            pass: '',
            passed: false,
            polarLine: {
                title: {
                    text: 'ECharts示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量1', '销量2']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量1',
                    type: 'line',
                    data: [5, 20, 36, 10, 10, 20]
                },
                {
                    name: '销量2',
                    type: 'line',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            },
            polarBar: {
                title: {
                    text: 'ECharts示例'
                },
                tooltip:{
                    show: true
                },
                legend: {
                    data: ['销量1', '销量2']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量1',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                },
                {
                    name: '销量2',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            }
        }
    },
    created() {
        this.recoredUser();
    },
    methods: {
        clickButton() {
            document.cookie = "mystock_cache=1";
            loginIn({
                options: {
                    login_name: this.user,
                    password: this.pass
                },
                callback0: (res) => {
                    var code = res.code;
                    if (code == 0) {
                        document.cookie = "token=" + res.token + "; path=/";
                        document.cookie = "account_id=" + res.account_id;

                        this.passed = true;
                        localStorage.setItem('zyztUser', JSON.stringify({
                            user: this.user,
                            password: this.pass,
                            passed: this.passed
                        }));
                    } else if (code == 2) {
                        alert('账号/密码输入错误，请重新输入');
                    }
                },
            })
        },
        recoredUser() {
            let userInfo = localStorage.getItem('zyztUser');
            userInfo = userInfo ? JSON.parse(userInfo) : {};
            if (userInfo.passed) {
                this.passed = userInfo.passed;
            }
            if (userInfo.user) {
                this.user = userInfo.user;
            }
            if (userInfo.password) {
                this.pass = userInfo.password;
            }
            if (this.pass) {
                this.clickButton();//刷新页面重新赋值token
            }
        }
    }
}
</script>
<style lang="less">
@import "../../less/login.less";
.echarts {
  width: 800px;
  height: 600px;
  border: 1px solid #fff;
  margin: 0 auto;
}

.eTitle {
  text-align: center;
  padding: 10px 0;
  color: red;
  font-size: 20px;
  margin-top: 15px;
  &.gray {
    background: #1b2431;
  }
}
.psd {
  text-indent: 6px;
}
</style>
