export default (function () {
    return {
        levelCount: 1,
        colFlag: 0,
        headResult: [],
        bodyResult: [],
        setCol: function (arr, level) {
            arr.forEach(val => {
                val.level = level
                if (level > this.levelCount) {
                    this.levelCount = level
                }
                if (val.son) {
                    this.setCol(val.son, level + 1)
                    var c = 0;
                    val.son.forEach(n => {
                        c += n.col
                    })
                    val.col = c
                    val.colIndex = val.son[0].colIndex
                    
                } else {
                    val.col = 1
                    val.colIndex = this.colFlag++
                }
            })
        },
        setRow: function (arr) {
            arr.forEach(val => {
                if (val.son) {
                    val.row = 1
                    this.setRow(val.son)
                } else {
                    val.row = this.levelCount + 1 - val.level
                }
                if (!this.headResult[val.level - 1]) {
                    this.headResult[val.level - 1] = []
                }
                this.headResult[val.level - 1].push(JSON.parse(JSON.stringify(val, function (key, value) {
                    return (key == 'level' || key == 'son') ? undefined : value
                })))
            })
        },
        getBodyConfig(arr){
            arr.forEach(val=>{
                if(val.son){
                    this.getBodyConfig(val.son)
                }else{
                    this.bodyResult.push(JSON.parse(JSON.stringify(val)))
                }
            })
        },
        init: function (arr) {
            this.levelCount = 1
            this.colFlag = 0
            this.headResult = []
            this.bodyResult = []
            this.getBodyConfig(arr)
            this.setCol(arr, 1)
            this.setRow(arr)
            return {
                headConf: this.headResult,
                bodyConf: this.bodyResult
            }
        }
    }
})()