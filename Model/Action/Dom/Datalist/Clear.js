/**
 * Clear datalist.
 *
 * @param {{id:string}} action   Message data
 * @param {function}    callback Callback
 *
 * @since 1.0.0
 */
export function datalistClear (action, callback)
{
    'use strict';

    const e = document.getElementById(action.id);

    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }

    if (typeof callback === 'function') {
        callback();
    }
};
