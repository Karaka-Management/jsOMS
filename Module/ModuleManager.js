/**
 * Module manager.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Module */
    jsOMS.Autoloader.defineNamespace('jsOMS.Module');

    jsOMS.Module.ModuleManager = class {
        /**
         * @constructor
         *
         * @param {Object} app Application
         *
         * @since 1.0.0
         */
        constructor(app)
        {
            this.modules = {};
            this.app     = app;
        };

        /**
         * Get module.
         *
         * @param {string} module Module name
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        get (module)
        {
            if (typeof this.modules[module] === 'undefined') {
                this.modules[module] = jsOMS.Module.ModuleFactory.getInstance(module, this.app);
            }

            return this.modules[module];
        };
    }
}(window.jsOMS = window.jsOMS || {}));
