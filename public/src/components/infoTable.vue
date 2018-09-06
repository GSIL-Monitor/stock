<!--   数据格式参考mystock.vue
       computed.tableInfo      -->
<template v-cloak>
    <div class="info-table">
        <!-- 表头 -->
        <div class="info-table-header" :class="tableInfo.headerInfo.class" :style="tableInfo.headerInfo.style">
            <div class="info-table-header-title">
                <div>序号</div>
            </div>
            <div class="info-table-header-title">
                <div>日期</div>
            </div>
            <div class="info-table-header-title">
                <div>发布机构</div>
            </div>
            <div class="info-table-header-title">
                <div>文章标题</div>
            </div>
        </div>
        <!-- 主体 -->
        <div class="info-table-body" :class="tableInfo.body.class" :style="tableInfo.body.tableStyle">
            <!-- 行 -->
            <div v-for="(row,index) in tableInfo.body.tablelist" class="info-table-body-row" :style="tableInfo.body.rowStyle">
                <div class="info-table-body-row-cell" style="width:5%">
                    <div>{{index+1}}</div>
                </div>
                <div class="info-table-body-row-cell" style="width:15%">
                    <div>{{row.date | getYMDHM}}</div>
                </div>
                <div class="info-table-body-row-cell" :title="row.origin" style="width:12%">
                    <div>{{row.origin}}</div>
                </div>
                <div class="info-table-body-row-cell" :title="row.title" :class="{visited:row.visited}" style="width:68%">
                    <div v-if="issearch" class="report-title" @click="clickEvent(row)"  v-html="dataService.keyWordHighLight(row.title,keyword)"></div>
                    <div v-else class="report-title" @click="clickEvent(row)">{{row.title}}</div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'infoTable',
        props: {
            tableInfo: {
                type: Object,
                default: () => { return {} }
            },
            issearch: {
                type: Boolean,
                default: false
            },
            keyword: {
                type: String,
                default: ''
            }
        },
        methods:{
            clickEvent(item){
                item.visited = true;
                this.$emit('clickTable',item);
            }
        }
    }
</script>
<style lang="less">
    @import '../less/common/variables.less';
    @import '../less/common/table.less';
</style>
