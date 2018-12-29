/**
 * Notification manager.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Notification */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Notification');

    jsOMS.Message.Notification.NotificationManager = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor()
        {
            this.appNotifier     = new jsOMS.Message.Notification.App.AppNotification();
            this.browserNotifier = new jsOMS.Message.Notification.Browser.BrowserNotification();
        };

        /**
         * Create notification.
         *
         * @param {Object} message Message object
         * @param {int}    type    Notification type
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        send (message, type)
        {
            if (jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION === type) {
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
         * @since  1.0.0
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
         * @since  1.0.0
         */
        getBrowserNotifier ()
        {
            return this.browserNotifier;
        };
    }
}(window.jsOMS = window.jsOMS || {}));