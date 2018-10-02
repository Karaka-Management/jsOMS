/**
 * Set message.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 * @param {string} id Action element
 *
 * @since 1.0.0
 */
const domGetValue = function (action, callback, id)
{
    "use strict";

    const e = action.base === 'self' ? (action.selector === '' || typeof action.selector === 'undefined' ? [document.getElementById(id)] : document.getElementById(id).querySelectorAll(action.selector)) : document.querySelectorAll(action.selector);
    let value = [];

    for (let i in e) {
        /** global: HTMLElement */
        if (!e.hasOwnProperty(i) || !(e[i] instanceof HTMLElement)) {
            continue;
        }

        let eId = (typeof e[i].name !== 'undefined' && e[i].name !== '') ? e[i].name : e[i].id;

        if (e[i].tagName === 'INPUT' || e[i].tagName === 'SELECTS' || e[i].tagName === 'BUTTON') {
            value[eId] = e[i].value;
        } else {
            value[eId] = e[i].getAttribute('data-id');
        }
    }

    callback(value);
};