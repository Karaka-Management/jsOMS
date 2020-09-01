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
    "use strict";

    /**
     * Trigger an event
     *
     * @param {element} element Element where the event is assigned
     * @param {string}  eventName Name of the event
     *
     * @return void
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.triggerEvent = function(element, eventName)
    {
        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
            event.eventName = eventName;
            element.dispatchEvent(event);
        } else {
            event           = document.createEventObject();
            event.eventName = eventName;
            event.eventType = eventName;
            element.fireEvent(event.eventType, event);
        }
    };

    /**
     * Trim char from string
     *
     * @param {string} path Array path
     * @param {Object} data Object
     * @param {string} delim Path delimiter
     *
     * @return
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.getArray = function(path, data, delim = '/')
    {
        const pathParts = jsOMS.ltrim(path, delim).split(delim);
        let current     = data;

        for (const key in pathParts) {
            if (!pathParts.hasOwnProperty(key)) {
                continue;
            }

            if (typeof current === 'undefined' || !current.hasOwnProperty(pathParts[key])) {
                return null;
            }

            current = current[pathParts[key]];
        }

        return current;
    };

    /**
     * Trim char from string
     *
     * @param {string} str String to trim from
     * @param {string} char Char to trim
     *
     * @return {string}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.trim = function(str, char = ' ')
    {
        return jsOMS.ltrim(jsOMS.rtrim(str, char), char);
    };

    /**
     * Trim char from right part of string
     *
     * @param {string} str String to trim from
     * @param {string} char Char to trim
     *
     * @return {string}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.rtrim = function(str, char = ' ')
    {
        return str.replace(new RegExp("[" + char + "]*$"), '');
    };

    /**
     * Trim char from left part of string
     *
     * @param {string} str String to trim from
     * @param {string} char Char to trim
     *
     * @return {string}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.ltrim = function(str, char = ' ')
    {
        return str.replace(new RegExp("^[" + char + "]*"), '');
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
    jsOMS.htmlspecialchars_encode = function(str)
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
    jsOMS.htmlspecialchars_decode = function(str)
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
     * Count string in string
     *
     * @param {string} str String to inspect
     * @param {string} substr Substring to count
     *
     * @return {int}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.substr_count = function(str, substr) {
        str    += '';
        substr += '';

        if (substr.length <= 0) {
            return (str.length + 1);
        }

        let n    = 0,
            pos  = 0,
            step = substr.length;

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
     * Class finder
     *
     * Checking if a element has a class
     *
     * @param {Object} ele DOM Element
     * @param {string} cls Class to find
     *
     * @return {boolean}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.hasClass = function (ele, cls)
    {
        return typeof ele !== 'undefined'
            && ele !== null
            && ((typeof ele.className === 'string'
                    && ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) !== null)
                || (typeof ele.className.baseVal === 'string'
                    && ele.className.baseVal.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) !== null));
    };

    /**
     * Add class
     *
     * Adding a class to an element
     *
     * @param ele DOM Element
     * @param cls Class to add
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.addClass = function (ele, cls)
    {
        if (!jsOMS.hasClass(ele, cls)) {
            if (typeof ele.className === 'string') {
                ele.className += ele.className !== '' ? " " + cls : cls;
            } else if (typeof ele.className.baseVal === 'string') {
                ele.className.baseVal += ele.className.baseVal !== '' ? ' ' + cls : cls;
            }
        }
    };

    /**
     * Remove class
     *
     * Removing a class form an element
     *
     * @param ele DOM Element
     * @param cls Class to remove
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.removeClass = function (ele, cls)
    {
        if (jsOMS.hasClass(ele, cls)) {
            const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

            if (typeof ele.className === 'string') {
                ele.className = ele.className.replace(reg, '');
            } else if (typeof ele.className.baseVal === 'string') {
                ele.className.baseVal = ele.className.baseVal.replace(reg, '');
            }
        }
    };

    /**
     * Delayed watcher
     *
     * Used to fire event after delay
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.watcher = function ()
    {
        var timer = 0;
        return function (callback, ms)
        {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    }();

    /**
     * Action prevent
     *
     * Preventing event from firering and passing through
     *
     * @param event Event Event to stop
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.preventAll = function (event)
    {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.cancelBubble = true;

        return false;
    };

    /**
     * Ready invoke
     *
     * Invoking a function after page load
     *
     * @param func Callback function
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.ready = function (func)
    {
        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            func();
        } else {
            document.addEventListener("DOMContentLoaded", function (event)
            {
                func();
            });
        }
    };

    /**
     * Get element value
     *
     * @param ele DOM Element
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    jsOMS.getValue = function (ele)
    {
        switch (ele.tagName.toLowerCase()) {
            case 'div':
            case 'pre':
            case 'article':
            case 'section':
                return ele.innerHTML;
            default:
                return ele.value;
        }
    };

    /**
     * Empty element
     *
     * Deleting content from element
     *
     * @param ele DOM Element
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.empty = function (ele)
    {
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
    };

    /**
     * Integer hash
     *
     * @param {string} str String to hash
     *
     * @return {int}
     *
     * @function
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
     * Check node
     *
     * Checking if a selection is a node
     *
     * @param ele DOM Node
     *
     * @return {boolean}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.isNode = function (ele)
    {
        /** global: Node */
        return (
            typeof Node === "object" ? ele instanceof Node : ele && typeof ele === "object" && typeof ele.nodeType === "number" && typeof ele.nodeName === "string"
        );
    };

    /**
     * Check element
     *
     * Checking if a selection is a element
     *
     * @param o DOM Element
     *
     * @return {boolean}
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.isElement = function (o)
    {
        /** global: HTMLElement */
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    };

    /**
     * Getting element by class
     *
     * Getting a element by class in the first level
     *
     * @param ele DOM Element
     * @param cls Class to find
     *
     * @return Element
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.getByClass = function (ele, cls)
    {
        const length = ele.childNodes.length;

        for (let i = 0; i < length; ++i) {
            if (jsOMS.hasClass(ele.childNodes[i], cls)) {
                return ele.childNodes[i];
            }
        }

        return null;
    };

    /**
     * Adding event listener to multiple elements
     *
     * @param e DOM Elements
     * @param {string} event Event name
     * @param {function} callback Event callback
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.addEventListenerToAll = function (e, event, callback)
    {
        const length = e.length;

        for (let i = 0; i < length; ++i) {
            e[i].addEventListener(event, callback);
        }
    };

    /**
     * Validate json string
     *
     * @param {string} jsonString String to validate
     *
     * @function
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
     * Merging two arrays recursively
     *
     * @param target Target array
     * @param source Source array
     *
     * @return Array
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.merge = function (target, source)
    {
        const out = jsOMS.clone(target);

        for (const p in source) {
            if (source.hasOwnProperty(p)) {
                // Property in destination object set; update its value.
                if (typeof source[p] === 'object') {
                    out[p] = jsOMS.merge(out[p], source[p]);

                } else {
                    out[p] = source[p];

                }
            } else {
                out[p] = source[p];
            }
        }

        return out;
    };

    /**
     * Shallow clones an object.
     *
     * @param {Object} obj Object to clone
     *
     * @returns {Object}
     *
     * @since 1.0.0
     */
    jsOMS.clone = function (obj)
    {
        return { ...obj };
    };

    jsOMS.isset = function (variable)
    {
        return typeof variable !== 'undefined' && variable !== null;
    };

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

    jsOMS.nearest = function (e, selector) {
        // same level first
        // parent level second
        // child level third
    };
}(window.jsOMS = window.jsOMS || {}));
