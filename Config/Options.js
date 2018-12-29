/**
 * Options class.
 *
 * This is a generic options class for storing options. This is usefull for handling options in other modules
 * without redefining the same behaviour multiple times.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Config */
    jsOMS.Autoloader.defineNamespace('jsOMS.Config');

    jsOMS.Config.Options = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor ()
        {
            this.options = {};
        };

        /**
         * Set option.
         *
         * @param {int|string}                     key         Option key
         * @param {boolean|int|float|string|Array} value       Option value
         * @param {boolean}                        [overwrite] Overwrite value
         *
         * @return {boolean}
         *
         * @since 1.0.0
         */
        set (key, value, overwrite = false)
        {
            if (overwrite || typeof this.options[key] === 'undefined') {
                this.options[key] = value;

                return true;
            }

            return false;
        };

        /**
         * Get option.
         *
         * @param {int|string} key Option key
         *
         * @return {boolean|int|float|string|Array}
         *
         * @since 1.0.0
         */
        get (key)
        {
            if (typeof this.options[key] !== 'undefined') {
                return this.options[key];
            }

            return null;
        };

        /**
         * Remove option.
         *
         * @param {int|string} key Option key
         *
         * @return {boolean}
         *
         * @since 1.0.0
         */
        remove (key)
        {
            if (typeof this.options[key] !== 'undefined') {
                delete this.options[key];

                return true;
            }

            return false;
        };
    }
}(window.jsOMS = window.jsOMS || {}));
