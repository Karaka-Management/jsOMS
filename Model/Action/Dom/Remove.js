/**
 * Remove dom element.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function removeButtonAction (action, callback, id)
{
    "use strict";

    const e   = action.base === 'self' ? (action.selector === '' || typeof action.selector === 'undefined' ? [document.getElementById(id)] : document.getElementById(id).querySelectorAll(action.selector)) : document.querySelectorAll(action.selector);
    const dim = document.getElementById('dim');

    for (const i in e) {
        /** global: HTMLElement */
        if (!e.hasOwnProperty(i) || !e[i] || !(e[i] instanceof HTMLElement)) {
            continue;
        }

        if (typeof action.aniOut !== 'undefined') {
            e[i].classList.add(action.aniOut);
        }

        /**
         * @todo Karaka/jsOMS#68
         *  Adding a remove action to a list of elements will stop working after removing the first element.
         *  This could be because after removing the first sibling the action or the listener is removed for the siblings?
         */
        setTimeout(function ()
        {
            if (e[i].parentElement === null) {
                return;
            }

            e[i].parentElement.removeChild(e[i]);

            if (dim) {
                document.getElementById('dim').classList.add('vh');
            }
        }, 200);
    }

    callback();
};
