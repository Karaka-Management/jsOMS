/**
 * Show popup.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function popupButtonAction (action, callback, id)
{
    'use strict';

    const popup = action.base === 'self'
        ? (action.selector === ''
            ? [document.getElementById(id)]
            : document.getElementById(id).querySelectorAll(action.selector))
        : document.querySelectorAll(action.selector);

    for (const i in popup) {
        /** global: HTMLElement */
        if (!Object.prototype.hasOwnProperty.call(popup, i) || !popup[i] || !(popup[i] instanceof HTMLElement)) {
            continue;
        }

        const clone = document.importNode(popup[i].content, true);
        const dim   = document.getElementById('dim');

        if (dim) {
            document.getElementById('dim').classList.remove('vh');
        }

        for (const j in clone) {
            if (!Object.prototype.hasOwnProperty.call(clone, j) || !(clone[j] instanceof HTMLElement)) {
                continue;
            }

            clone[j].innerHTML = clone[j].innerHTML.replace(/\{\$id\}/g, action.id);
        }

        document.body.insertBefore(clone, document.body.firstChild);

        const e = document.getElementById(popup[i].id.substr(0, popup[i].id.length - 4));

        if (!e) {
            continue;
        }

        window.omsApp.uiManager.getActionManager().bind(e.querySelectorAll('[data-action]'));

        e.classList.add('animated');
        if (typeof action.aniIn !== 'undefined') {
            e.classList.add(action.aniIn);
        }

        if (action.stay > 0) {
            setTimeout(function ()
            {
                let out = 0;
                if (typeof action.aniOut !== 'undefined') {
                    e.classList.remove(action.aniIn);
                    e.classList.add(action.aniOut);
                    out = 200;
                }

                setTimeout(function ()
                {
                    if (typeof action.aniOut !== 'undefined') {
                        e.classList.add(action.aniOut);
                    }

                    e.parentElement.removeChild(e);

                    const dim = document.getElementById('dim');

                    if (dim) {
                        document.getElementById('dim').classList.add('vh');
                    }
                }, out);
            }, action.stay);
        }
    }

    if (typeof callback === 'function') {
        callback();
    }
};
