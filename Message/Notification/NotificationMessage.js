/**
 * App notification.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS) {
    "use strict";

    /** @namespace jsOMS.Message.Notification.App */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Notification');

    jsOMS.Message.Notification.NotificationMessage = function (status, title, message) 
    {
        this.status  = status;
        this.title   = title;
        this.message = message;
    };
}(window.jsOMS = window.jsOMS || {}));