/**
 * Prevent UI action.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function jumpAction (action, callback, id)
{
    'use strict';

    action.key = action.jump - 1;
    callback();
};
