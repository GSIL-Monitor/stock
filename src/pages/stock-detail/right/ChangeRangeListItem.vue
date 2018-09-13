<template>
    <li class="range_list" :class="classes">
        <span class="range_list_text">{{text}}</span>
        <div class="range_list_process">
            <div class="range_list_process_bar" :style="styles"></div>
        </div>
        <span class="range_list_count">{{count}}</span>
    </li>
</template>

<script>
export default {
    name: 'RangeListItem',
    computed: {
        classes() {
            let prefix = 'range_list_'
            let color = this.firstToUpperCase(this.color)

            return [
                `${prefix}${color}`
            ]
        },
        styles() {
            return {
                width: this.process
            }
        },
    },
    methods: {
        firstToUpperCase(str) {
            return str.replace(/^\S/, s => {
                return s.toUpperCase()
            })
        },
    },
    props: {
        text: {
            type: String,
            required: true,
            default: ''
        },
        process: {
            type: String,
            required: true,
            default: '0%'
        },
        count: {
            required: true,
            default: 0,
        },
        color: {
            type: String,
            required: true,
            validator(val) {
                return ['red', 'green'].includes(val)
            },
        },
    }
}
</script>

<style lang="less">
.range_list {
    display: flex;
    height: 30px;
    align-items: center;
}
.range_list_text {
    flex: 0 0 80px;
    white-space: nowrap;
}
.range_list_process {
    flex: 1;
}
.range_list_process_bar {
    height: 10px;
}
.range_list_count {
    flex: 0 0 50px;
}
@red: #FF2B48;
@green: #06B45F;
.range_list_Red {
    .range_list_process_bar {
        background-color: @red;
    }
    .range_list_count {
        color: @red;
    }
}
.range_list_Green {
    .range_list_process_bar {
        background-color: @green;
    }
    .range_list_count {
        color: @green;
    }
}
</style>
