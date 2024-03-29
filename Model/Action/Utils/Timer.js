/**
 * Set timer for next action.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
const timerActionDelay = {};
export function timerAction (action, callback, data)
{
    'use strict';

    if (timerActionDelay[action.id]) {
        clearTimeout(timerActionDelay[action.id]);
        delete timerActionDelay[action.id];
    }

    timerActionDelay[action.id] = setTimeout(function () {
        delete timerActionDelay[action.id];
        callback(data);
    }, action.delay);
};
