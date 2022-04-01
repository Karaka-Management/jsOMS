/**
 * Click dom element.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function formSubmitAction (action, callback, id)
{
    'use strict';

    const submit = action.base === 'self' ? (action.selector === '' ? [document.getElementById(id)] : document.getElementById(id).querySelectorAll(action.selector)) : document.querySelectorAll(action.selector);

    if (!submit) {
        return;
    }

    const formManager = window.omsApp.uiManager.getFormManager();

    for (const i of submit) {
        formManager.submit(formManager.get(i.id));
    }

    callback();
};
