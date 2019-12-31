import { Request } from '../../Message/Request/Request.js';
import { RequestMethod } from '../../Message/Request/RequestMethod.js';
import { RequestType } from '../../Message/Request/RequestType.js';

/**
 * Auth class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Auth
{
    /**
     * @constructor
     *
     * @param {string} uri Login uri
     *
     * @since 1.0.0
     */
    constructor (uri)
    {
        this.account = null;
        this.uri     = uri;
    };

    /**
     * Set account for authentication.
     *
     * @param {Object} account Account
     *
     * @since 1.0.0
     */
    setAccount (account)
    {
        this.account = account;
    };

    /**
     * Get account.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getAccount ()
    {
        return this.account;
    };

    /**
     * Login account.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    login ()
    {
        const authRequest = new Request();

        authRequest.setUri(this.uri);
        authRequest.setMethod(RequestMethod.POST);
        authRequest.setResponseType(RequestType.JSON);
        authRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        authRequest.setSuccess(function (xhr)
        {
            this.loginResult(xhr);
        });

        authRequest.send();
    };

    /**
     * Logout account.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    logout ()
    {
        location.reload();
    };

    /**
     * Handle login result.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    loginResult (xhr)
    {
        location.reload();
    };
};
