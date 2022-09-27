import { Request } from '../Request/Request.js';

/**
 * Response manager class.
 *
 * Used for auto handling different responses.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class ResponseManager
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        /** @type {Object} messages */
        this.messages = {};
    };

    /**
     * Add response handler.
     *
     * This allows the response handler to generally handle responses and also handle specific requests if defined.
     *
     * @param {string}      key       Response key
     * @param {function}    message   Callback for message
     * @param {null|string} [request] Request id in order to only handle a specific request
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    add (key, message, request = null)
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
     * @param {string}       key       Response key
     * @param {Object}       data      Date to use in callback
     * @param {null|Request} [request] Request id for request specific execution
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    run (key, data, request = null)
    {
        if (request !== null
            && typeof this.messages[key] !== 'undefined'
            && typeof this.messages[key][request] !== 'undefined'
        ) {
            this.messages[key][request](data);
        } else if (typeof this.messages[key] !== 'undefined') {
            this.messages[key].null(data);
        } else {
            jsOMS.Log.Logger.instance.warning('Undefined type: ' + key);
        }
    };
};
