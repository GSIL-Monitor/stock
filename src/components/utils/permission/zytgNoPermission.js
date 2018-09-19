import {
    JsToQtEventInterface,
} from '../callQt'

const zytgNoPermissionOperation = function() {
    JsToQtEventInterface(
        JSON.stringify({
            fun: 'AccountDeadlineTip',
        })
    )
}

export default zytgNoPermissionOperation
