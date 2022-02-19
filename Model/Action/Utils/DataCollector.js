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
    "use strict";

    let elements, data = {};

    for (const selector in action.collect) {
        if (!action.collect.hasOwnProperty(selector)) {
            continue;
        }

        elements = document.querySelectorAll(action.collect[selector]);

        for (const e in elements) {
            if (!elements.hasOwnProperty(e)) {
                continue;
            }

            data[selector].push(jsOMS.getValue(e));
        }
    }

    callback(data);
};
