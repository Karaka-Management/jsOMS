/**
 * Set value of input.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function domSetValue (action, callback, id)
{
    "use strict";

    let dataPath      = action['value'],
        path          = '',
        tempDataValue = '',
        values        = [],
        replaceText   = '',
        start         = 0,
        end           = 0;

    while ((start = dataPath.indexOf('{', start)) !== -1) {
        end = dataPath.indexOf('}', start);
        start++;

        path = dataPath.substring(start, end);
        /** global: jsOMS */
        tempDataValue = jsOMS.getArray(path, action.data, '/');

        replaceText = '{' + path + '}';
        dataPath    = dataPath.replace(new RegExp(replaceText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), tempDataValue);
    }

    const fill = action.base === 'self' ? (action.selector === '' ? [document.getElementById(id)] : document.getElementById(id).querySelectorAll(action.selector)) : document.querySelectorAll(action.selector);

    for (let i in fill) {
        /** global: HTMLElement */
        if (!fill.hasOwnProperty(i) || !(fill[i] instanceof HTMLElement)) {
            continue;
        }

        if (fill[i].tagName.toLowerCase() === 'div'
            || fill[i].tagName.toLowerCase() === 'span'
        ) {
            if (!fill[i].innerHTML.includes(dataPath)) {
                if (action.overwrite) {
                    fill[i].innerHTML = dataPath;
                } else if (!action.overwrite) {
                    fill[i].innerHTML += dataPath;
                }
            }
        } else {
            if (fill[i].value !== dataPath
                && !fill[i].value.includes(', ' + dataPath + ',')
                && !fill[i].value.endsWith(', ' + dataPath)
                && !fill[i].value.startsWith(dataPath + ',')
            ) {
                if (action.overwrite) {
                    fill[i].value = dataPath;
                } else {
                    fill[i].value += (fill[i].value !== '' ? ', ' : '') + dataPath;
                }
            }
        }
    }

    callback(action.data);
};