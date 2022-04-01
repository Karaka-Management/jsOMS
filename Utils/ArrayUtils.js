/**
 * Standard library
 *
 * This library provides useful functionalities for the DOM and other manipulations.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
(function (jsOMS)
{
    'use strict';

    /**
     * Get value from array/object
     *
     * @param {string} path    Array path
     * @param {Object} data    Object
     * @param {string} [delim] Path delimiter
     *
     * @return {any}
     *
     * @since 1.0.0
     */
    jsOMS.getArray = function (path, data, delim = '/')
    {
        /** @type {Object} pathParts */
        const pathParts = jsOMS.ltrim(path, delim).split(delim);
        let current     = data;

        for (const key in pathParts) {
            if (!Object.prototype.hasOwnProperty.call(pathParts, key)) {
                continue;
            }

            if (typeof current === 'undefined' || !Object.prototype.hasOwnProperty.call(current, pathParts[key])) {
                return null;
            }

            current = current[pathParts[key]];
        }

        return current;
    };
}(window.jsOMS = window.jsOMS || {}));
