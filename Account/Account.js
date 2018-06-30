/**
 * Account.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Account');

    jsOMS.Account.Account = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor ()
        {
            this.id = 0;
        };

        /**
         * Get id.
         *
         * @return {int}
         *
         * @method
         *
         * @since 1.0.0
         */
        getId () 
        {
            return this.id;
        };
    };
}(window.jsOMS = window.jsOMS || {}));