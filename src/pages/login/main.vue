<template>
    <div id="app">
        <div class="login-page" v-show="!passed">
            <span class="color-white">账号:</span> <input type="text" placeholder="GO-GOAL账号" v-model="user"> <br> <br>
            <span class="color-white">密码:</span> <input type="password" class="psd" placeholder="密码" v-model="pass" @keyup.enter="clickButton"> <br> <br>
            <search-btn class="submit" v-on:click="clickButton">登录</search-btn>
        </div>
        <div class="pages" v-show="passed">
            <div class="urlBox">
                <a class="link" href="stocks/stockDetail.html">个股</a><br><br>
            </div>
        </div>
    </div>
</template>

<script>
import {
    loginIn,
} from '@service/index.js'

import commonStyle from '@c/commonStyle/index'
import searchBtn from '@c/button'

export default {
    name: 'app',
    components: {
        commonStyle,
        searchBtn,
    },
    mounted() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) {
                if (!this.passed) {
                    this.clickButton();
                }
            }
        }, false);
    },
    data() {
        return {
            user: '',
            pass: '',
            passed: false,
        }
    },
    created() {
        this.recoredUser();
    },
    methods: {
        clickButton() {

            loginIn({
                options: {
                    login_name: this.user,
                    password: this.pass
                },
                callback0: (res) => {
                    var code = res.code;
                    if (code == 0) {
                        document.cookie = "token=" + res.token + "; path=/";
                        document.cookie = "account_id=" + res.account_id + "; path=/";
                        document.cookie = 'userType={    "button_code": [        "13",        "TG_001",        "TG_002",        "TG_003",        "TG_004",        "TG_005",        "TG_006",        "TG_007",        "TG_008",        "TG_009",        "TG_010",        "TG_011",        "TG_012",        "TG_013",        "TG_014",        "TG_015",        "TG_016",        "TG_017",        "TG_018",        "TG_019",        "TG_0010_001",        "TG_0010_002",        "TG_0010_003",        "TG_0010_004",        "TG_0010_005",        "TG_0010_006",        "TG_0010_007",        "TG_0010_008",        "TG_0010_009",        "TG_0010_010",        "TG_0010_011",        "TG_0012_001",        "TG_0012_002",        "TG_0012_003",        "TG_0012_004",        "TG_0012_005",        "TG_0012_006",        "TG_0012_007",        "TG_0012_008",        "TG_0013_001",        "TG_0013_002",        "TG_0013_003",        "TG_0013_004",        "TG_0013_005",        "TG_0013_006",        "TG_0013_007",        "TG_0013_008",        "TG_0013_009",        "TG_003_001",        "TG_003_002",        "TG_003_003",        "TG_003_004",        "TG_003_005",        "TG_003_006",        "TG_004_001",        "TG_004_002",        "TG_004_003",        "TG_004_004",        "TG_004_005",        "TG_004_006",        "TG_004_007",        "TG_004_008",        "TG_004_009",        "TG_004_010",        "TG_004_011",        "TG_004_012",        "TG_004_013",        "TG_004_014",        "TG_005_001",        "TG_005_002",        "TG_005_003",        "TG_006_001",        "TG_006_002",        "TG_006_003",        "TG_007_001",        "TG_007_002",        "TG_007_003",        "TG_007_004",        "TG_007_005",        "TG_007_006",        "TG_007_007",        "TG_008_001",        "TG_008_002",        "TG_008_003",        "TG_008_004",        "TG_008_005",        "TG_008_006",        "TG_008_007",        "TG_008_008",        "TG_009_001",        "TG_009_002",        "TG_009_003",        "TG_009_004",        "TG_009_005",        "TG_009_006",        "TG_009_007",        "TG_009_008",        "TG_009_009",        "TG_009_010",        "TG_016_001",        "TG_016_002",        "TG_016_003"    ],    "days": 9867,    "end_date": "2045-09-25 00:00:00",    "is_auto": 0,    "is_inner": 1,    "past_days": null,    "past_end_date": null,    "past_permi": null,    "past_user_type": null,    "permi": "旗舰版",    "user_type": 9}'
                        document.cookie = "mystock_cache=1";

                        this.passed = true;
                        localStorage.setItem('stock-user', JSON.stringify({
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
            let userInfo = localStorage.getItem('stock-user');
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
