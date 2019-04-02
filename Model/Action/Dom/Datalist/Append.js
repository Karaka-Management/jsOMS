/**
 * Set message.
 *
 * @param {{id:string},{data:object},{text:string},{value:string}} action Message data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function datalistAppend (action, callback)
{
    "use strict";

    const datalist = document.getElementById(action.id),
        dataLength = action.data.length;

    let option;

    for (let i = 0; i < dataLength; ++i) {
        option       = document.createElement('option');
        option.value = action.data[i][action.text];
        option.setAttribute('data-value', action.data[i][action.value]);
        datalist.appendChild(option);
    }

    callback();
};
