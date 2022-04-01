import { NotificationMessage } from '../../../Message/Notification/NotificationMessage.js';
import { NotificationType } from '../../../Message/Notification/NotificationType.js';

/**
 * Log.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function logAction (action, callback, id)
{
    'use strict';

    window.omsApp.notifyManager.send(
        new NotificationMessage(
            action.data.status,
            action.data.title,
            action.data.message
        ), NotificationType.APP_NOTIFICATION
    );

    callback();
};
