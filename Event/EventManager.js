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
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.Event');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Event.EventManager = function ()
    {
        this.groups = {};
        this.callbacks = {};
    };

    jsOMS.Event.EventManager.prototype.addGroup = function(id, group)
    {
        if(typeof this.groups[group] == 'undefined') {
            this.groups[group] = {};
        }

        this.groups[group][id] = false;
    };

    jsOMS.Event.EventManager.prototype.hasOutstanding = function(group)
    {
        if(typeof this.groups[group] === 'undefined') {
            return false;
        }

        for (let id  in this.groups[group]) {
            if (!this.groups[group][id]) {
                return true;
            }
        }

        return false;
    };

    jsOMS.Event.EventManager.prototype.triggerDone = function(id, group)
    {
        if(typeof this.groups[group] !== 'undefined') {
            this.groups[group][id] = true;
        }

        if(!this.hasOutstanding(group)) {
            this.callbacks[group]();
            delete this.callbacks[group];
            delete this.groups[group];
        }
    };

    jsOMS.Event.EventManager.prototype.setDone = function(group, callback)
    {
        this.callbacks[group] = callback;
    };
}(window.jsOMS = window.jsOMS || {}));
