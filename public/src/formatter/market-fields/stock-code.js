/**
 * @description 显示的 stock_code
 * @see Interface::formatShowCode()
 * @return {function}
*/
const formatShowCode = (code, list) => {
    const SOURCE = list.source

    if (!SOURCE) {
        return code
    } else {
        return SOURCE === 'BK' ? `${SOURCE}${code}` : code
    }
}

export default formatShowCode