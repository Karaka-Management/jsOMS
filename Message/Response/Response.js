/**
 * Response manager class.
 *
 * Used for auto handling different responses.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Response */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Response');

    jsOMS.Message.Response.Response = class {
        constructor (data)
        {
            this.responses = data;
        };

        get (id)
        {
            return this.responses[id];
        };

        getByIndex (index)
        {
            return this.responses[index];
        };

        count ()
        {
            return this.responses.length;
        };
    }
}(window.jsOMS = window.jsOMS || {}));