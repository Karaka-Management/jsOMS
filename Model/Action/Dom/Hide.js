import { jsOMS } from '../../../Utils/oLib.js';
/**
 * Hide an element.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function hideAction (action, callback)
{
    'use strict';

    const hide = document.getElementById(action.id);

    if (!hide) {
        return;
    }

    /** global: jsOMS */
    jsOMS.addClass(hide, 'vh');

    callback();
};
