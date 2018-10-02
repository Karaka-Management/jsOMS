/**
 * Validate Keypress.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
const validateKeypress = function (action, callback)
{
    "use strict";

    const invertValidate = action.pressed.startsWith('!'),
        keyPressCheck    = invertValidate ? action.pressed.split('!') : action.pressed.split('|');

    if (typeof action.data.keyCode !== 'undefined'
        && ((!invertValidate && keyPressCheck.indexOf(action.data.keyCode.toString()) !== -1)
        || (invertValidate && keyPressCheck.indexOf(action.data.keyCode.toString()) === -1))
    ) {
        callback();
    }
};
