/**
 * Set message.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
const requestAction = function (action, callback)
{
    "use strict";

    /** global: jsOMS */
    const request = new jsOMS.Message.Request.Request(action.uri, action.method, action.request_type);

    request.setSuccess(function(xhr) {
        console.log(xhr.responseText);
        callback(JSON.parse(xhr.responseText));
    });

    if (typeof action.data !== 'undefined') {
        request.setData(action.data);
    }

    request.send();
};
