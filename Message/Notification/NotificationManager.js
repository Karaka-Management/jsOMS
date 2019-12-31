import { AppNotification } from '../../../jsOMS/Message/Notification/App/AppNotification.js';
import { BrowserNotification } from '../../../jsOMS/Message/Notification/Browser/BrowserNotification.js';
import { NotificationType } from '../../../jsOMS/Message/Notification/NotificationType.js';

/**
 * Notification manager.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class NotificationManager
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor()
    {
        this.appNotifier     = new AppNotification();
        this.browserNotifier = new BrowserNotification();
    };

    /**
     * Create notification.
     *
     * @param {Object} message Message object
     * @param {int}    type    Notification type
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    send (message, type)
    {
        if (NotificationType.APP_NOTIFICATION === type) {
            this.appNotifier.send(message);
        } else {
            this.browserNotifier.send(message);
        }
    };

    /**
     * Get the app notification manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getAppNotifier ()
    {
        return this.appNotifier;
    };

    /**
     * Get the browser notification manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getBrowserNotifier ()
    {
        return this.browserNotifier;
    };
};