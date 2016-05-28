/**
 * Event type.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    /** @namespace jsOMS.UI.Input.Mouse */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Mouse');

    jsOMS.UI.Input.Mouse.EventType = Object.freeze({
        CONTEXT: 0,
        LONGPRESS: 1,
        CLICK: 2
    });
}(window.jsOMS = window.jsOMS || {}));
