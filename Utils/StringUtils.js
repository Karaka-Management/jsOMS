/**
 * Standard library
 *
 * This library provides useful functionalities for the DOM and other manipulations.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
(function (jsOMS)
{
    'use strict';

    /**
     * Trim char from string
     *
     * @param {string} str    String to trim from
     * @param {string} [char] Char to trim
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.trim = function (str, char = ' ')
    {
        return jsOMS.ltrim(jsOMS.rtrim(str, char), char);
    };

    /**
     * Trim char from right part of string
     *
     * @param {string} str    String to trim from
     * @param {string} [char] Char to trim
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.rtrim = function (str, char = ' ')
    {
        return str.replace(new RegExp('[' + char + ']*$'), '');
    };

    /**
     * Trim char from left part of string
     *
     * @param {string} str    String to trim from
     * @param {string} [char] Char to trim
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.ltrim = function (str, char = ' ')
    {
        return str.replace(new RegExp('^[' + char + ']*'), '');
    };

    jsOMS.htmlspecialchars = [
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;']
    ];

    /**
     * Encode none-html string
     *
     * @param {string} str String to encode
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.htmlspecialchars_encode = function (str)
    {
        let escaped  = str;
        const length = jsOMS.htmlspecialchars.length;

        for (let i = 0; i < length; ++i) {
            escaped = escaped.replace(
                new RegExp(jsOMS.htmlspecialchars[i][0], 'g'),
                jsOMS.htmlspecialchars[i][1]
            );
        }

        return escaped;
    };

    /**
     * Decode html string
     *
     * @param {string} str String to encode
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.htmlspecialchars_decode = function (str)
    {
        let decoded  = str;
        const length = jsOMS.htmlspecialchars.length;

        for (let i = 0; i < length; ++i) {
            decoded = decoded.replace(
                new RegExp(jsOMS.htmlspecialchars[i][1], 'g'),
                jsOMS.htmlspecialchars[i][0]
            );
        }

        return decoded;
    };

    /**
     * Validate json string
     *
     * @param {string} jsonString String to validate
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    jsOMS.isValidJson = function (jsonString)
    {
        try {
            JSON.parse(jsonString);
        } catch (e) {
            return false;
        }
        return true;
    };

    /**
     * Count string in string
     *
     * @param {string} str    String to inspect
     * @param {string} substr Substring to count
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    jsOMS.substr_count = function (str, substr)
    {
        str    += '';
        substr += '';

        const step = substr.length;

        if (step <= 0) {
            return (str.length + 1);
        }

        let n   = 0;
        let pos = 0;

        while (true) {
            pos = str.indexOf(substr, pos);

            if (pos >= 0) {
                ++n;
                pos += step;
            } else {
                break;
            }
        }

        return n;
    };

    /**
     * Integer hash
     *
     * @param {string} str String to hash
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    jsOMS.hash = function (str)
    {
        let res   = 0;
        const len = str.length;

        for (let i = 0; i < len; ++i) {
            res = res * 31 + str.charCodeAt(i);
        }

        return res;
    };

    /**
     * Get the remaining string after finding a certain char
     *
     * @param {string} haystack String to to search in
     * @param {Array}  chars    Chars to search for
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.strpbrk = function (haystack, chars)
    {
        const length = chars.length;
        let found    = haystack.length;
        let min      = haystack.length;

        for (let i = 0; i < length; ++i) {
            if ((found = haystack.indexOf(chars.charAt(i))) >= 0 && min > found) {
                min = found;
            }
        }

        return haystack.slice(min);
    };
}(window.jsOMS = window.jsOMS || {}));
