/**
 * LocalStorage class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.DataStorage');

    jsOMS.DataStorage.LocalStorage = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor ()
        {
        };

        /**
         * Is local storage available?
         *
         * @return {boolean}
         *
         * @method
         *
         * @since 1.0.0
         */
        available ()
        {
            try {
                return 'localStorage' in window && window.localStorage !== null;
            } catch (e) {
                return false;
            }
        };
    }
}(window.jsOMS = window.jsOMS || {}));
