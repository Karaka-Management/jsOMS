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

    jsOMS.Message.Notification.App.AppNotification = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor ()
        {
            this.status = 0;
        };

        /**
         * Set notification status.
         *
         * @param {int} status Notification status
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        setStatus (status)
        {
            this.status = status;
        };

        /**
         * Create notification
         *
         * @param {Object} msg Notification
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        send (msg)
        {
            const tpl = document.getElementById('app-message-tpl');

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
    }
}(window.jsOMS = window.jsOMS || {}));