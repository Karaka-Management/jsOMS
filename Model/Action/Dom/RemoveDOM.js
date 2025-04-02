/**
 * Remove dom
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domRemoveElement (action, callback, id)
{
    'use strict';

    const e = action.base === 'self'
        ? (action.selector === '' || typeof action.selector === 'undefined'
            ? [document.getElementById(id)]
            : document.getElementById(id).querySelectorAll(action.selector))
        : document.querySelectorAll(action.selector);

    for (const i in e) {
        /** global: HTMLElement */
        if (!Object.prototype.hasOwnProperty.call(e, i) || !(e[i] instanceof HTMLElement)) {
            continue;
        }

        e.parentElement.removeChild(e);
    }

    if (typeof callback === 'function') {
        callback();
    }
};
