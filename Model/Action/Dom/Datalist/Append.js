/**
 * Append datalist element.
 *
 * @param {{id:string},{data:object},{text:string},{value:string}} action   Message data
 * @param {function}                                               callback Callback
 *
 * @since 1.0.0
 */
export function datalistAppend (action, callback)
{
    'use strict';

    const datalist   = document.getElementById(action.id);
    const dataLength = action.data.length;

    let option;

    for (let i = 0; i < dataLength; ++i) {
        option       = document.createElement('option');
        option.value = action.data[i][action.text];
        option.setAttribute('data-value', action.data[i][action.value]);
        datalist.appendChild(option);
    }

    if (typeof callback === 'function') {
        callback();
    }
};
