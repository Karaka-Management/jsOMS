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
        /**
         * @constructor
         *
         * @param {mixed} data Response data
         *
         * @since 1.0.0
         */
        constructor (data)
        {
            this.responses = data;
        };

        /**
         * Get response by id.
         *
         * @param {string} id Response id
         *
         * @return {mixed}
         *
         * @since  1.0.0
         */
        get (id)
        {
            return this.responses[id];
        };

        /**
         * Count the amount of responses.
         *
         * @return {int}
         *
         * @since  1.0.0
         */
        count ()
        {
            return this.responses.length;
        };
    }
}(window.jsOMS = window.jsOMS || {}));