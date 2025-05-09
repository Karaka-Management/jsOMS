/**
 * Apped element to a table.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function tableAppend (action, callback)
{
    'use strict';

    const table        = document.getElementById(action.id);
    const tbody        = table !== null && typeof table !== 'undefined' ? table.getElementsByTagName('tbody')[0] : null;
    const headers      = table !== null && typeof table !== 'undefined' ? table.getElementsByTagName('thead')[0].getElementsByTagName('th') : null;
    const dataLength   = action.data.length;
    const headerLength = headers !== null && typeof headers !== 'undefined' ? headers.length : 0;

    let row;
    let cell;
    let rawText;

    for (let i = 0; i < dataLength; ++i) {
        if (tbody === null) {
            break;
        }

        row = tbody.insertRow(tbody.rows.length);

        for (let j = 0; j < headerLength; ++j) {
            if (row === null) {
                break;
            }

            cell    = row.insertCell(j);
            rawText = action.data[i][headers[j].getAttribute('data-name')];

            if (typeof rawText === 'undefined') {
                rawText = '';
            }

            cell.appendChild(document.createTextNode(rawText));
        }
    }

    if (typeof callback === 'function') {
        callback();
    }
};
