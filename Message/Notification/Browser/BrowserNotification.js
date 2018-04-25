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

    /** @namespace jsOMS.Message.Notification.Browser */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Notification.Browser');

    jsOMS.Message.Notification.Browser.BrowserNotification = class {
        constructor()
        {
            this.status = 0;
        };

        setStatus (status)
        {
            this.status = status;
        };

        requestPermission ()
        {
            const self = this;

            /** global: Notification */
            if(Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission(function(permission) {
                    if(permission === 'granted') {
                        let msg = new jsOMS.Message.Notification.NotificationMessage();

                        self.send(msg);
                    }
                });
            }
        };

        send (msg)
        {
            /** global: Notification */
            let n = new Notification(/* ... */);
        };
    }
}(window.jsOMS = window.jsOMS || {}));