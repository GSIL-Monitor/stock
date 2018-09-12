const map = new Map()
// 顺序勿动
map.set('sh', {
    class_name: "general-ico",
    title: "沪股通成分股",
    type: "sh-tong",
})
map.set('sz', {
    class_name: "general-ico",
    title: "深股通成分股",
    type: "sz-tong",
})

map.set('rzrq', {
    class_name: "melt-ico",
    title: "融资融券标的",
    type: "margin-trading",
})

map.set('sz_50', {
    class_name: "sz-50",
    title: "上证50成分股",
    type: "sz50",
})

map.set('hs_300', {
    class_name: "hs-300",
    title: "沪深300成分股",
    type: "hs300",
})

export default map
