/**
 * Browser notification.
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
        constructor()
        {
            this.appNotifier     = new jsOMS.Message.Notification.App.AppNotification();
            this.browserNotifier = new jsOMS.Message.Notification.Browser.BrowserNotification();
        };

        send (message, type)
        {
            if (jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION === type) {
                this.appNotifier.send(message);
            } else {
                this.browserNotifier.send(message);
            }
        };

        getAppNotifier ()
        {
            return this.appNotifier;
        };

        getBrowserNotifier ()
        {
            return this.browserNotifier;
        };
    }
}(window.jsOMS = window.jsOMS || {}));