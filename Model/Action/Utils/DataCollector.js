import { jsOMS } from '../../../Utils/oLib.js';
/**
 * Collect data.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function dataCollectionAction (action, callback)
{
    'use strict';

    let elements;
    const data = {};

    for (const selector in action.collect) {
        if (!Object.prototype.hasOwnProperty.call(action.collect, selector)) {
            continue;
        }

        elements = document.querySelectorAll(action.collect[selector]);

        for (const e in elements) {
            if (!Object.prototype.hasOwnProperty.call(elements, e)) {
                continue;
            }

            data[selector].push(jsOMS.getValue(e));
        }
    }

    callback(data);
};
