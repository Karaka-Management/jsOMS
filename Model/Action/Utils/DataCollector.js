/**
 * Collect data.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function dataCollectionAction (action, callback)
{
    "use strict";

    let elements, data = {};

    for (let selector in action.collect) {
        if (!action.collect.hasOwnProperty(selector)) {
            continue;
        }

        elements = document.querySelectorAll(action.collect[selector]);

        for (let e in elements) {
            if(!elements.hasOwnProperty(e)) {
                continue;
            }

            // todo: different types of elements have differnt forms of storing values (input, textarea etc.)
            data[selector].push(e.value);
        }
    }

    callback(data);
};
