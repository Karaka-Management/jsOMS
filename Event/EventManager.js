/**
 * Request manager class.
 *
 * Used for pooling requests.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Event');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Event.EventManager = function (logger)
    {
        this.logger    = logger;
        this.groups    = {};
        this.callbacks = {};
    };

    /**
     * Add event group (element)
     *
     * Adding the same event overwrites the existing one as "waiting"
     *
     * @param {string|int} id Event id
     * @param {string|int} group Group id
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Event.EventManager.prototype.addGroup = function (id, group)
    {
        if (typeof this.groups[group] === 'undefined') {
            this.groups[group] = {};
        }

        this.groups[group][id] = false;
    };

    /**
     * Does group have outstanding events
     *
     * @param {string|int} group Group id
     *
     * @return {boolean}
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Event.EventManager.prototype.hasOutstanding = function (group)
    {
        if (typeof this.groups[group] === 'undefined') {
            return false;
        }

        for (let id  in this.groups[group]) {
            if (this.groups[group].hasOwnProperty(id)) {
                return true;
            } else {
                this.app.logger.warning('Invalid property.');
            }
        }

        return false;
    };

    /**
     * Trigger event finished
     *
     * Executes the callback specified for this group if all events are finished
     *
     * @param {string|int} id Event id
     * @param {string|int} group Group id
     *
     * @return {boolean}
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Event.EventManager.prototype.trigger = function (id, group)
    {
        if (typeof this.groups[group] !== 'undefined') {
            delete this.groups[group][id];
        }

        if (!this.hasOutstanding(group)) {
            this.callbacks[group].func();

            if (this.callbacks[group].remove) {
                delete this.callbacks[group];
                delete this.groups[group];
            }
        }
    };

    /**
     * Attach callback to event group
     *
     * @param {string|int} group Group id
     * @param {function} callback Callback
     * @param {boolean} remove Should be removed after execution
     *
     * @return {boolean}
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Event.EventManager.prototype.attach = function (group, callback, remove)
    {
        remove = typeof remove === 'undefined' ? false : remove;

        this.callbacks[group] = {remove: remove, func: callback};
    };
}(window.jsOMS = window.jsOMS || {}));
