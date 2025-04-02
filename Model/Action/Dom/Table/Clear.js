/**
 * Clear table.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function tableClear (action, callback)
{
    'use strict';

    const e = document.getElementById(action.id).getElementsByTagName('tbody')[0];

    while (e.firstChild) {
        e.removeChild(e.firstChild);
    }

    if (typeof callback === 'function') {
        callback();
    }
};
