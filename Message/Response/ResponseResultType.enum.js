/**
 * Response result type enum.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Response */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Response');
    
    jsOMS.Message.Response.ResponseResultType = Object.freeze({
        MULTI: 0,
        MESSAGE: 1,
        INFO: 2,
        DATA: 3,
        LIST: 4
    });
}(window.jsOMS = window.jsOMS || {}));
