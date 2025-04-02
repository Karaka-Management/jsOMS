import { GeneralUI } from '../../../UI/GeneralUI.js';

/**
 * Get value from dom.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domGetValue (action, callback, id)
{
    'use strict';

    const e = action.base === 'self'
        ? (action.selector === '' || typeof action.selector === 'undefined'
            ? [document.getElementById(id)]
            : document.getElementById(id).querySelectorAll(action.selector))
        : document.querySelectorAll(action.selector);

    let value = {};

    for (const i in e) {
        /** global: HTMLElement */
        if (!Object.prototype.hasOwnProperty.call(e, i) || !(e[i] instanceof HTMLElement)) {
            continue;
        }

        const eId = (typeof e[i].getAttribute('name') !== 'undefined' && e[i].getAttribute('name') !== '' && e[i].getAttribute('name') !== null)
            ? e[i].getAttribute('name')
            : e[i].getAttribute('id');

        if (e[i].tagName.toLowerCase() === 'form') {
            value = window.omsApp.uiManager.getFormManager().get(eId).getData();
            break;
        } else {
            value[eId] = GeneralUI.getValueFromDataSource(e[i]);
        }
    }

    callback(value);
};
