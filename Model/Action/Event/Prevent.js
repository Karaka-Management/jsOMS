/**
 * Prevent UI action.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 * @param {string} id Action element
 *
 * @since 1.0.0
 */
const preventEvent = function (action, callback, id)
{
    "use strict";

    jsOMS.preventAll(action.data);

    callback();
};