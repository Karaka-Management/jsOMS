/**
 * Browser notification.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Notification.Browser */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Notification.Browser');

    jsOMS.Message.Notification.Browser.BrowserNotification = function()
    {
        this.status = 0;
    };

    jsOMS.Message.Notification.Browser.BrowserNotification.prototype.setStatus = function(status)
    {
        this.status = status;
    }

    jsOMS.Message.Notification.Browser.BrowserNotification.prototype.requestPermission = function()
    {
        let self = this;

        if(Notification.permission !== 'granted') {
            Notification.requestPermission(function(permission) {
                if(permission === 'granted') {
                    let msg = new jsOMS.Message.Notification.NotificationMessage();

                    self.notify(msg);
                }
            });
        }
    };

    jsOMS.Message.Notification.Browser.BrowserNotification.prototype.notify = function(msg)
    {

    };
}(window.jsOMS = window.jsOMS || {}));