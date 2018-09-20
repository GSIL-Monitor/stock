<template>
<Tabs
    :activeKey="activeKey"
    active-style="underline"
    @on-click="tabClicked"
>
    <XqdownToUp
        @on-click="changeContainerState"
        slot="navPrev"
        :is-on="titleState"
    />
    <TabPane
        label="新闻"
        :type="news"
    >
        <News/>
    </TabPane>
    <TabPane
        label="公告"
        :type="notice"
    >
        <Notice/>
    </TabPane>
    <LoadMore
        @on-click="moduleJump"
        slot="navNext"
    />
</Tabs>
</template>

<script>
import {
    mapState
} from 'vuex'
import {
    MODULE_NAME,
} from '../storage'

import inforJumpMixin from '../mixins/information-jump-mixin'
import informationMixin from '../mixins/information-mixin'

import Tabs from '../components/tabs/'
import TabPane from '../components/tab-pane/'
import LoadMore from '../components/LoadMore.vue'
import XqdownToUp from '../components/XqdownToUp.vue'
import News from './News.vue'
import Notice from './Notice.vue'

export default {
    name: 'InfoHSIndexTemp',
    mixins: [
        inforJumpMixin,
        informationMixin,
    ],
    data() {
        return {
            activeKey: 'news',
            news: 'news',
            notice: 'notice',
        }
    },
    components: {
        Tabs,
        TabPane,
        LoadMore,
        XqdownToUp,
        News,
        Notice,
    },
    computed: {
        ...mapState([
            'full_code',
        ]),
    },
    methods: {
        getJumpParam(url) {
            return {
                url,
                parentId: MODULE_NAME,
            }
        },
        getQueryString(type) {
            return `stockCode=${this.full_code}&type=${type}`
        },
        moduleJump() {
            if (Object.is(this.activeKey, this.news)) {
                let type = 0
                this.jumpInfoMore(type)
            } else if (Object.is(this.activeKey, this.notice)) {
                let type = 1
                this.jumpInfoMore(type)
            }
        },
    },
}
</script>
