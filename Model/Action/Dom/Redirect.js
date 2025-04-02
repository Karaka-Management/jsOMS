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
        const url = action.uri === '' ? '' : UriFactory.build(action.uri);

        if (action.src) {
            document.getElementById(action.src).src = url;
        } else {
            if (url === window.location.href || url === '') {
                document.location.reload();
            } else {
                window.location.href = url;
            }
        }
    }, parseInt(action.delay));
};
