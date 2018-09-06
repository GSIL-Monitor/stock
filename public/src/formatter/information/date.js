// 获取当前日期 0 点的时间戳
const getTodayZeroHourTimeStamp = () => {
    let nowDay = new Date()
    let timestamp = new Date(
                        nowDay.getFullYear(),
                        nowDay.getMonth(),
                        nowDay.getDate(),
                        0,
                        0,
                        0
                    ).getTime()
    return timestamp
}

// 判断时间差小于一天
const isToday = (prevDate) => {
    const ONE_DAY_TIME = 24 * 60 * 60 * 1000;
    let prevDateTimeStamp = prevDate.getTime();
    let todayTimeStamp = getTodayZeroHourTimeStamp()
    let diff = prevDateTimeStamp - todayTimeStamp

    return diff >= 0 && diff < ONE_DAY_TIME
}

const todayTotalResult = (replateDate) => {
    let hours = replateDate.getHours();
    let minutes = replateDate.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return '今天' + ' ' + hours + ':' + minutes;
}

const formatInfoDate = (date, total) => {
    if (date) {
        if (date.length === 10) {
            date += " 00:00:00"
        }
        let replateDate = new Date(date.replace(/\-/g,'/'))
        let isShowToday = isToday(replateDate)
        if (total) {
            if (isShowToday) {
                return todayTotalResult(replateDate)
            } else {
                return date.substr(0, 16)
            }
        } else {
            if (isShowToday) {
                return '今天'
            } else {
                return date.substr(0, 10)
            }
        }
    } else {
        return '--';
    }
}

export default formatInfoDate