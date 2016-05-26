/**
 * Core JS functionality
 *
 * This logic is supposed to minimize coding and support core javascript functionality.
 *
 * @since      1.0.0
 */
(function (jsOMS, undefined)
{

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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.hasClass = function (ele, cls)
    {
        return ele !== undefined && ele !== null && ele.className !== undefined && ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.addClass = function (ele, cls)
    {
        if (!jsOMS.hasClass(ele, cls)) {
            ele.className += " " + cls;
        }
    };

    jsOMS.hasProperty = function(obj) {
        let args = Array.prototype.slice.call(arguments, 1);

        for (let i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.removeClass = function (ele, cls)
    {
        if (jsOMS.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, '');
        }
    };

    /**
     * Delayed watcher
     *
     * Used to fire event after delay
     *
     * @function
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.preventAll = function (event)
    {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }

        event.preventDefault();
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.ready = function (func)
    {
        // TODO: IE problems? + Maybe interactive + loaded can cause problems since elements might not be loaded yet?!!?!!?!
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
     * Empty element
     *
     * Deleting content from element
     *
     * @param ele DOM Element
     *
     * @function
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.empty = function (ele)
    {
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
    };

    jsOMS.hash = function (str)
    {
        var res = 0,
            len = str.length;
        for (var i = 0; i < len; i++) {
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.isNode = function (ele)
    {
        return (
            typeof Node === "object" ? ele instanceof Node :
            ele && typeof ele === "object" && typeof ele.nodeType === "number" && typeof ele.nodeName === "string"
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.isElement = function (o)
    {
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.getByClass = function (ele, cls)
    {
        var length = ele.childNodes.length;

        for (var i = 0; i < length; i++) {
            if (jsOMS.hasClass(ele.childNodes[i], cls)) {
                return ele.childNodes[i];
            }
        }

        return null;
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.merge = function (target, source)
    {
        let out = jsOMS.clone(target);

        for (let p in source) {
            try {
                // Property in destination object set; update its value.
                if ( source[p].constructor==Object ) {
                    out[p] = jsOMS.merge(out[p], source[p]);

                } else {
                    out[p] = source[p];

                }

            } catch(e) {
                // Property in destination object not set; create it and set its value.
                out[p] = source[p];

            }
        }

        return out;
    };

    /**
     * todo: implement deep clone/copy
     * @param obj
     * @returns {*}
     */
    jsOMS.clone = function (obj)
    {
        return obj;
    }
}(window.jsOMS = window.jsOMS || {}));
