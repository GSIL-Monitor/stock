<template>
    <td :class="[className]">
        {{text}}
    </td>
</template>

<script>
export default {
    name: 'tdEle',
    props: {
        'className': {
            type: String,
            default: '',
        },
        'text': {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="less">

</style>


