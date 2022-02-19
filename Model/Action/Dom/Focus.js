/**
 * Focus an element.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function focusAction (action, callback)
{
    "use strict";

    const focus = document.getElementById(action.id);

    if (!focus) {
        return;
    }

    focus.focus();

    callback();
};