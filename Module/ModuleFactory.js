/**
 * Module factory.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Module');

    jsOMS.Module.ModuleFactory = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor ()
        {
        };

        /**
         * Get module instance.
         *
         * @param {string} module Module name
         * @param {Object} app Application reference
         *
         * @return {Object}
         *
         * @method
         *
         * @since  1.0.0
         */
        static getInstance (module, app)
        {
            return new jsOMS.Modules[module](app);
        };
    }
}(window.jsOMS = window.jsOMS || {}));
