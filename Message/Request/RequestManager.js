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
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Request');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.RequestManager = function ()
    {
        this.groups    = {};
        this.callbacks = {};
    };

    /**
     * Add request group.
     *
     * @return {string} id Request id
     * @return {string} group Group id
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.RequestManager.prototype.addGroup = function (id, group)
    {
        if (typeof this.groups[group] == 'undefined') {
            this.groups[group] = {};
        }

        this.groups[group][id] = false;
    };

    /**
     * Group has outstanding/pending requests?
     *
     * @return {string} group Group id
     *
     * @return {boolean}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.RequestManager.prototype.hasOutstanding = function (group)
    {
        if (typeof this.groups[group] === 'undefined') {
            return false;
        }

        for (let id  in this.groups[group]) {
            if (!this.groups[group][id]) {
                return true;
            }
        }

        return false;
    };

    /**
     * Mark request as done.
     *
     * @return {string} id Request id
     * @return {string} group Group id
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.RequestManager.prototype.triggerDone = function (id, group)
    {
        if (typeof this.groups[group] !== 'undefined') {
            this.groups[group][id] = true;
        }

        if (!this.hasOutstanding(group)) {
            this.callbacks[group]();
            delete this.callbacks[group];
            delete this.groups[group];
        }
    };

    /**
     * Create callback for request pool.
     *
     * @return {string} group Group id
     * @return {callback} callback Callback
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.RequestManager.prototype.setDone = function (group, callback)
    {
        this.callbacks[group] = callback;
    };
}(window.jsOMS = window.jsOMS || {}));
