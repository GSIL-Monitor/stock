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
        </div>
    </div>
</template>

<script>
import {
    loginIn,
} from '@service/index'

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
