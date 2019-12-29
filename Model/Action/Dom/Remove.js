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

    for (let i in e) {
        /** global: HTMLElement */
        if (!e.hasOwnProperty(i) || !e[i] || !(e[i] instanceof HTMLElement)) {
            continue;
        }

        if (typeof action.aniOut !== 'undefined') {
            e[i].classList.add(action.aniOut);
        }

        // todo: here is a problem with removing elements. after removing the first element in a list the second one cannot be deleted. maybe this is because the action event gets removed for sister elements after one is deleted?
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
