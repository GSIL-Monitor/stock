
const createBox = (cont) => {
    let $box = document.createElement('div')
    $box.className = 'pop-up-five-box'
    if (cont) {
        $box.textContent = cont
    }

    return $box
}

const getPosition = ($box) => {
    let body = document.body,
        bodyScrollTop = body.scrollTop,
        width = body.offsetWidth,
        height = body.offsetHeight
        $boxWidth = $box.offsetWidth,
        $boxHeight = $box.offsetHeight;

    return {
        top: bodyScrollTop + (height - $boxHeight) / 2,
        left: (width - $boxWidth) / 2,
    }
}

const setPosition = ($box) => {
    let position = getPosition($box)

    $box.style.top = position.top
    $box.style.left = position.left
}

const launchTimer = (() => {
    let fiveSecondTimer = null
    const TIME = 3000
    return (fn, $box) => {
        clearTimeout(fiveSecondTimer)
        fiveSecondTimer = setTimeout(() => {
            // removeElement
            document.body.removeChild($box)
            if (fn && typeof fn === 'function') {
                fn()
            }
        }, TIME)
    }
})()

const popUpFiveSecond = (cont, fn, position) => {
    let $box = createBox(cont)
    document.body.appendChild($box)
    if (!position) {
        setPosition($box)
    }
    launchTimer(fn, $box)
}

export default popUpFiveSecond
