/**
 * Response manager class.
 *
 * Used for auto handling different responses.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Response.ResponseManager = function ()
    {
        this.messages = {};
    };

    /**
     * Add response handler.
     *
     * This allows the response handler to generally handle responses and also handle specific requests if defined.
     *
     * @param {string} key Response key
     * @param {requestCallback} message Callback for message
     * @param {string} [request=any] Request id in order to only handle a specific request
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Response.ResponseManager.prototype.add = function (key, message, request)
    {
        request = typeof request !== 'undefined' ? request : 'any';
        if (typeof this.messages[key] === 'undefined') {
            this.messages[key] = [];
        }

        this.messages[key][request] = message;
    };

    /**
     * Execute a predefined callback.
     *
     * Tries to execute a request specific callback or otherwise a general callback if defined.
     *
     * @param {string} key Response key
     * @param {Array|Object} data Date to use in callback
     * @param {string} [request] Request id for request specific execution
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Response.ResponseManager.prototype.execute = function (key, data, request)
    {
        console.log(data);
        if (typeof request !== 'undefined' && typeof this.messages[key][request] !== 'undefined') {
            this.messages[key][request](data);
        } else if (typeof this.messages[key] !== 'undefined') {
            this.messages[key].any(data);
        } else {
            console.log('does not exist');
        }
    }
}(window.jsOMS = window.jsOMS || {}));
