/**
 * Add dom
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domAddElement (action, callback, id)
{
    'use strict';

    const e = action.base === 'self'
        ? (action.selector === '' || typeof action.selector === 'undefined'
            ? document.getElementById(id)
            : document.getElementById(id).querySelector(action.selector))
        : document.querySelector(action.selector);

    for (const i in action.data) {
        e.appendChild.removeChild(i);
    }

    callback();
};
