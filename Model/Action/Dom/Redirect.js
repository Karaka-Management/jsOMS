import { UriFactory } from '../../../Uri/UriFactory.js';

/**
 * Redirect.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function redirectMessage (action, callback, id)
{
    setTimeout(function ()
    {
        if (action.src) {
            document.getElementById(action.src).src = UriFactory.build(action.uri);
        } else {
            window.location = UriFactory.build(action.uri);
        }
    }, parseInt(action.delay));
};
