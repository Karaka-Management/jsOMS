/**
 * Log.
 *
 * @param {Object} action Action data
 * @param {function} callback Callback
 *
 * @since 1.0.0
 */
export function logAction (action, callback)
{
    "use strict";

    window.omsApp.notifyManager.send(
        new jsOMS.Message.Notification.NotificationMessage(
            action.data.status,
            action.data.title,
            action.data.message
        ), jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION
    );

    callback();
};
