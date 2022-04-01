/**
 * Click dom element.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domClickAction (action, callback, id)
{
    'use strict';

    const click = action.base === 'self'
        ? (action.selector === ''
            ? [document.getElementById(id)]
            : document.getElementById(id).querySelectorAll(action.selector))
        : document.querySelectorAll(action.selector);

    if (!click) {
        return;
    }

    for (const i of click) {
        i.click();
    }

    callback();
};
