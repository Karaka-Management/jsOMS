import { jsOMS } from '../../../Utils/oLib.js';
/**
 * Show dom element.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function showAction (action, callback, id)
{
    'use strict';

    const show = document.getElementById(action.id);

    if (!show) {
        return;
    }

    /** global: jsOMS */
    jsOMS.removeClass(show, 'vh');

    if (typeof callback === 'function') {
        callback();
    }
};
