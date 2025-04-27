import { NotificationMessage } from '../../Message/Notification/NotificationMessage.js';
import { NotificationType }    from '../../Message/Notification/NotificationType.js';

/**
 * Notification message.
 *
 * @param {{title:string},{content:string},{level:number},{delay:number},{stay:number}} data Message data
 *
 * @since 1.0.0
 */
export function notifyMessage (data)
{
    const msg    = new NotificationMessage(data.level, data.title, data.msg);
    msg.duration = 5000;

    window.omsApp.notifyManager.send(
        msg, NotificationType.APP_NOTIFICATION
    );
};
