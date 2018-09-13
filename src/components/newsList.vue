<!-- 新闻列表项目 -->
<template>
    <div>
        <div v-for="(item,index) in dataList" class="news-item"  :class="classList">
            <div v-if="issearch" class="news-title"
                :title="item.title"
                @click="clickEvent(index,item.id,item)"
                v-html="dataService.keyWordHighLight(item.title,search)"
                :class="{visited:item.visited}"
            >
            </div>
            <div v-else class="news-title" :title="item.title" :class="{visited:item.visited}" @click="clickEvent(index,item.id,item)">{{item.title}}</div>
            <div class="news-source" :class="{visited:item.visited}">
                <span>{{item.source}}</span>&nbsp;
                <span>{{item.date | getYMDHM}}</span>
            </div>
            <div v-if="issearch" class="news-content" :class="{visited:item.visited}" v-html="dataService.keyWordHighLight(item.summary,search)"></div>
            <div v-else class="news-content"  :class="{visited:item.visited}" v-html="item.summary"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'newsList',
        //dataList -> 列表数据，issearch -> 是否高亮关键词，classList -> 添加类名，search -> 搜索关键词
        props: {
            dataList: {
                type: Array,
                default: () => { return [] }
            },
            issearch: {
                type: Boolean,
                default: false
            },
            classList: {
                type: String,
                default: ''
            },
            search: {
                type: String,
                default: ''
            }
        },
        methods:{
            clickEvent(index,id,item){
                item.visited = true;
                this.$emit('clickNews',index,id);
            }
        }
    }
</script>
