/**
 * Response manager class.
 *
 * Used for auto handling different responses.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Response */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Response');

    jsOMS.Message.Response.Response = function (data)
    {
        this.responses = data;
    };

    jsOMS.Message.Response.Response.prototype.get = function (id)
    {
        return this.responses[id];
    };

    jsOMS.Message.Response.Response.prototype.getByIndex = function (index)
    {
        //return this.responses[Object.keys(this.responses).sort()[index]];
        return this.responses;
    };

    jsOMS.Message.Response.Response.prototype.count = function ()
    {
        return 1;
    };
}(window.jsOMS = window.jsOMS || {}));