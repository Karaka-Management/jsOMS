/**
 * Prevent UI action.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function preventEvent (action, callback, id)
{
    "use strict";

    console.log('prevented');

    jsOMS.preventAll(action.data);

    callback();
};