import { Request } from '../../../Message/Request/Request.js';

/**
 * Set message.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function requestAction (action, callback, id)
{
    'use strict';

    if (action.uri === '') {
        action.uri = document.getElementById(id).href;
    }

    /** global: jsOMS */
    const request = new Request(action.uri, action.method, action.request_type);

    request.setSuccess(function (xhr) {
        window.omsApp.logger.log(xhr.responseText);
        callback(JSON.parse(xhr.responseText));
    });

    if (typeof action.data !== 'undefined' && action.data !== null) {
        request.setData(action.data);
    }

    request.send();
};
