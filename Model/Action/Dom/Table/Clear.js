/**
 * Set message.
 *
 * @param {{id:string}} action Message data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
const tableClear = function (action, callback)
{
    "use strict";

    const e = document.getElementById(action.id).getElementsByTagName('tbody')[0];

    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }

    callback();
};
