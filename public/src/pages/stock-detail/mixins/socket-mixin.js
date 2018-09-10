export default {
    methods: {
        cancleSocket(index) {
            let preLink = goGoal.sockets[index]
            if (preLink) {
                this.sendLink(this.getCancelLinkAddress(preLink))
            }
            goGoal.sockets[index] = null
        },
        rememberLink(link, index) {
            goGoal.sockets[index] = link
        },
        getCancelLinkAddress(address) {
            let state = `|status:0`

            return address + state
        },
        sendLink(link) {
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
