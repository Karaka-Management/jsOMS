/**
 * Notification data enum.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS) {
    "use strict";

    /** @namespace jsOMS.Message.Notification */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Notification');

    jsOMS.Message.Notification.NotificationLevel = Object.freeze({
        OK: 'ok',
        ERROR: 'error'
    });
}(window.jsOMS = window.jsOMS || {}));
