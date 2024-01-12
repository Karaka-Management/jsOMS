import { UriFactory } from '../../../Uri/UriFactory.js';

/**
 * Reload page.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function reloadButtonAction (action, callback, id)
{
    'use strict';

    setTimeout(function () {
        if (action.src) {
            console.log(document.getElementById(action.src).hasAttribute('data-src'));
            console.log(UriFactory.build(document.getElementById(action.src).getAttribute('data-src')));

            document.getElementById(action.src).src = document.getElementById(action.src).hasAttribute('data-src')
                ? UriFactory.build(document.getElementById(action.src).getAttribute('data-src'))
                : document.getElementById(action.src).src;
        } else {
            document.location.reload();
        }
    }, parseInt(action.delay));

    callback();
};
