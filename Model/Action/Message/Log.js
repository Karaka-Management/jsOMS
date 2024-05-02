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
            action.data[0].status,
            action.data[0].title,
            action.data[0].message
        ), NotificationType.APP_NOTIFICATION
    );

    if (typeof callback === 'function') {
        callback();
    }
};
