<template>
    <span :class="['sun-tag', tagStyleName ? tagStyleName : '']" @click="clickTag">
        <slot></slot>
        {{text}}
    </span>
</template>
<script>
    export default {
        name: 'SunTag',
        data() {
            return {
            }
        },
        props: {
            suffix:{
                type: String,
                default: 'default'
            },
            text: {
                type: String,
                default: ''
            }
        },
        computed: {
            tagStyleName() {
                if(this.text === '--'){
                    return 'sun-tag-default'
                }
                return this.suffix ? 'sun-tag-' + this.suffix : ''
            }
        },
        mounted(){
            // window.yui=this
        },
        methods: {
            clickTag(e){
                this.$emit('clickTag')
            }
        }
    }
</script>
<style lang="less">
@import '../../../less/variables.less';
.sun-tag {
    margin-right: 5px;
    line-height: inherit;
}
.sun-tag-default{
    cursor: default;
}
.sun-tag-link{
    color: @color-blue;
    cursor: pointer;
}
</style>