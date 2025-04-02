/**
 * Get dom
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domGetElement (action, callback, id)
{
    'use strict';

    const e = action.base === 'self'
        ? (action.selector === '' || typeof action.selector === 'undefined'
            ? [document.getElementById(id)]
            : document.getElementById(id).querySelectorAll(action.selector))
        : document.querySelectorAll(action.selector);

    const elements = [];
    for (const i in e) {
        if (i.tagName === 'template') {
            elements.push(i.content.cloneNode(true));
        } else {
            elements.push(i.cloneNode(true));
        }
    }

    callback(elements);
};
