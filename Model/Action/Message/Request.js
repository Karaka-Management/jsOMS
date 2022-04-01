import { Request } from '../../../Message/Request/Request.js';

/**
 * Set message.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function requestAction (action, callback)
{
    'use strict';

    /** global: jsOMS */
    const request = new Request(action.uri, action.method, action.request_type);

    request.setSuccess(function (xhr) {
        console.log(xhr.responseText);
        callback(JSON.parse(xhr.responseText));
    });

    if (typeof action.data !== 'undefined') {
        request.setData(action.data);
    }

    request.send();
};
