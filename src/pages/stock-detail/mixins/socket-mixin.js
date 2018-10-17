export default {
    methods: {
        $_cancleSocket(index) {
            let preLink = goGoal.sockets[index]

            if (preLink) {
                let cancelLink = this.$_getCancelLinkAddress(preLink)
                this.$_sendLink(cancelLink)
            }
            goGoal.sockets[index] = null
        },
        $_rememberLink(link, index) {
            goGoal.sockets[index] = link
        },
        $_getCancelLinkAddress(address) {
            let state = `|status:0`

            return address + state
        },
        $_sendLink(link) {
            if (goGoal.ws.readyState === 1) {
                // OPEN
                goGoal.ws.send(link)
            } else {
                goGoal.ws.onopen = function(){
                    goGoal.ws.send(link)
                }
            }
        },
    },
}
