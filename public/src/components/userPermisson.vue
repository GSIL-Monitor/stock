<template>
    <div id="has-no-premisson" v-if="noPermisson" @click="divClick" :style="{height:height+'px'}"></div>
</template>
<script>
    export default {
        props:['permissonCode'],
        data(){
            return {
                height:0,
                codeJson:{
                    ZT_r_company:'TG_003_001', // 好公司
                    ZT_f_secret:'TG_0010_006', // 绝密内参
                    ZT_f_paper:'TG_0010_009', // 朝阳早报
                    ZT_f_point:'TG_0010_007', // 大佬观点
                    ZT_f_golden:'TG_0010_005', // 私募金股
                    ZT_s_circle:'TG_0010_001' // 圈子
                }
            }
        },
        computed:{
            noPermisson:function(){
                let util = this.util || window.util;
                let userType = util.getCookie('userType');
                let code = null;
                let show = false;
                if(userType){
                    userType = JSON.parse(userType);
                    code = userType.button_code;
                    if(code.indexOf(this.permissonCode)<0 && code.indexOf(this.codeJson[this.permissonCode])<0){
                        show = true;
                    }
                }
                return show;
            }
        },
        mounted(){
            this.height = document.documentElement.clientHeight;
            window.addEventListener('resize', () => {
                this.height = document.documentElement.clientHeight;
            })
        },
        methods:{
            divClick(){
                let qtobj = this.callQt || window.qtobj;
                qtobj.JsToQtEventInterface(JSON.stringify({fun:'AccountDeadlineTip'}));
            }
        }
    }
</script>

<style>
    #has-no-premisson{
        opacity:0;
        background:#fff;
        position:absolute;
        top:0;
        left:0;
        z-index:9999;
        width: 100%;
    }

</style>