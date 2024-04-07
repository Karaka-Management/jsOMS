import { jsOMS } from '../../../Utils/oLib.js';

/**
 * Set value of input.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domChangeAttribute (action, callback, id)
{
    'use strict';

    const fill = action.base === 'self'
        ? (action.selector === ''
            ? [document.getElementById(id)]
            : document.getElementById(id).querySelectorAll(action.selector))
        : document.querySelectorAll(action.selector);

    for (const i in fill) {
        /** global: HTMLElement */
        if (!Object.prototype.hasOwnProperty.call(fill, i) || !(fill[i] instanceof HTMLElement)) {
            continue;
        }

        switch (action.subtype) {
            case 'remove':
                const old = fill[i].getAttribute(action.attr);

                if (old !== null && old.match(new RegExp('(\\s|^)' + action.value + '(\\s|$)')) !== null) {
                    const reg = new RegExp('(\\s|^)' + action.value);

                    fill[i].setAttribute(action.attr, old.replace(reg, '').trim());
                }
                break;
            case 'add':
                fill[i].setAttribute(action.attr, jsOMS.trim(fill[i].getAttribute(action.attr) + ' ' + action.value))
                break;
            case 'set':
                fill[i].setAttribute(action.attr, action.value)
                break;
            default:
        }
    }

    callback(action.data);
};
