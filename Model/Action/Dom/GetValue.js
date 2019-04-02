/**
 * Get value from dom.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 * @param {string} id Action element
 *
 * @since 1.0.0
 */
export function domGetValue (action, callback, id)
{
    "use strict";

    const e = action.base === 'self' ? (action.selector === '' || typeof action.selector === 'undefined' ? [document.getElementById(id)] : document.getElementById(id).querySelectorAll(action.selector)) : document.querySelectorAll(action.selector);
    let value = {};

    for (let i in e) {
        /** global: HTMLElement */
        if (!e.hasOwnProperty(i) || !(e[i] instanceof HTMLElement)) {
            continue;
        }

        let eId = (typeof e[i].getAttribute('name') !== 'undefined' && e[i].getAttribute('name') !== '' && e[i].getAttribute('name') !== null) ? e[i].getAttribute('name') : e[i].getAttribute('id');

        if (e[i].tagName === 'INPUT' || e[i].tagName === 'SELECTS' || e[i].tagName === 'BUTTON') {
            value[eId] = e[i].getAttribute('value');
        } else if (e[i].tagName === 'FORM') {
            // todo: this is messy. if form should be handled somewhere else not in loop since it overwrites all other values... will there very be other values in case of a form selector? if yes than this will cause a bug!
            value = window.omsApp.uiManager.getFormManager().get(eId).getData();
            break;
        } else {
            value[eId] = e[i].getAttribute('data-id');
        }
    }

    callback(value);
};