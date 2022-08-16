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
     * Class finder
     *
     * Checking if a element has a class
     *
     * @param {Object} ele DOM Element
     * @param {string} cls Class to find
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    jsOMS.hasClass = function (ele, cls)
    {
        return typeof ele !== 'undefined'
            && ele !== null
            && typeof ele.className !== 'undefined'
            && ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) !== null;
    };

    /**
     * Trigger an event
     *
     * @param {Element} element Element where the event is assigned
     * @param {string}  eventName Name of the event
     *
     * @return void
     *
     * @function
     *
     * @since 1.0.0
     */
    jsOMS.triggerEvent = function (element, eventName)
    {
        if (document.createEvent) {
            const event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
            event.eventName = eventName;
            element.dispatchEvent(event);
        } else {
            const event     = document.createEventObject();
            event.eventName = eventName;
            event.eventType = eventName;
            element.fireEvent(event.eventType, event);
        }
    };

    /**
     * Add class
     *
     * Adding a class to an element
     *
     * @param {Element} DOM Element
     * @param {string}  Class to add
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    jsOMS.addClass = function (ele, cls)
    {
        if (!jsOMS.hasClass(ele, cls)) {
            ele.className += ele.className !== '' ? ' ' + cls : cls;
        }
    };

    /**
     * Remove class
     *
     * Removing a class form an element
     *
     * @param {Element} DOM Element
     * @param {string}  Class to remove
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    jsOMS.removeClass = function (ele, cls)
    {
        if (jsOMS.hasClass(ele, cls)) {
            const reg     = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, '');
        }
    };

    /**
     * Get element value
     *
     * @param {Element} DOM Element
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
     * Action prevent
     *
     * Preventing event from firing and passing through
     *
     * @param {Event} event Event to stop
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    jsOMS.preventAll = function (event)
    {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.cancelBubble = true;
    };

    /**
     * Ready invoke
     *
     * Invoking a function after page load
     *
     * @param {function} func Callback function
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    jsOMS.ready = function (func)
    {
        if (document.readyState === 'complete'
            || document.readyState === 'loaded'
            || document.readyState === 'interactive'
        ) {
            func();
        } else {
            document.addEventListener('DOMContentLoaded', function (event)
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
     * @param {Element} DOM Element
     *
     * @return {void}
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
     * Check node
     *
     * Checking if a selection is a node
     *
     * @param {Node} DOM Node
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    jsOMS.isNode = function (ele)
    {
        /** global: Node */
        return (
            typeof Node === 'object' ? ele instanceof Node : ele && typeof ele === 'object' && typeof ele.nodeType === 'number' && typeof ele.nodeName === 'string'
        );
    };

    /**
     * Check element
     *
     * Checking if a selection is a element
     *
     * @param {HTMLElement} DOM Element
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    jsOMS.isElement = function (o)
    {
        /** global: HTMLElement */
        return (
            typeof HTMLElement === 'object' ? o instanceof HTMLElement : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
        );
    };

    /**
     * Getting element by class
     *
     * Getting a element by class in the first level
     *
     * @param {Element} DOM Element
     * @param {string}  Class to find
     *
     * @return {null|Element}
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
     * @param {Element}  e        DOM Elements
     * @param {string}   event    Event name
     * @param {function} callback Event callback
     *
     * @return {void}
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
}(window.jsOMS = window.jsOMS || {}));
