/**
 * Reload dom.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 * @param {string} id Action element
 *
 * @since 1.0.0
 */
export function reloadButtonAction (action, callback, id)
{
    "use strict";

    setTimeout(function () {
        document.location.reload(true);
    }, parseInt(action.delay));

    callback();
};
