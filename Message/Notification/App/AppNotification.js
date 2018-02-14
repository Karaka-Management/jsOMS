/**
 * App notification.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Notification.App */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Notification.App');

    jsOMS.Message.Notification.App.AppNotification = function()
    {
        this.status = 0;
    };

    jsOMS.Message.Notification.App.AppNotification.prototype.setStatus = function(status)
    {
        this.status = status;
    };

    jsOMS.Message.Notification.App.AppNotification.prototype.requestPermission = function()
    {
        const self = this;
    };

    jsOMS.Message.Notification.App.AppNotification.prototype.send = function(msg)
    {
        const tpl = document.getElementById('app-message');

        if (tpl === null) {
            return;
        }

        let output = document.importNode(tpl.content, true);
        output.querySelector('.log-msg').classList.add('log-msg-status-' + msg.status);
        output.querySelector('.log-msg-title').innerHTML   = msg.title;
        output.querySelector('.log-msg-content').innerHTML = msg.message;

        tpl.parentNode.appendChild(output);

        setTimeout(function () 
        {
            document.getElementsByClassName('log-msg')[0].remove();
        }, 3000);
    };
}(window.jsOMS = window.jsOMS || {}));