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
        if (data.src) {
            document.getElementById(data.src).src = UriFactory.build(data.uri);
        } else {
            window.location = UriFactory.build(data.uri);
        }
    }, parseInt(data.delay));
};
