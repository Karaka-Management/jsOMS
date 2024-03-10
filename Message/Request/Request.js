import { Logger }        from '../../Log/Logger.js';
import { UriFactory }    from '../../Uri/UriFactory.js';
import { RequestMethod } from './RequestMethod.js';
import { RequestType }   from './RequestType.js';

/**
 * Request class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 *
 * @question Consider to completely remove and replace with fetch
 */
export class Request
{
    /**
     * @constructor
     *
     * @param {null|string} [uri]    Request uri
     * @param {null|string} [method] Request method/verb
     * @param {null|string} [type]   Request content type
     *
     * @since 1.0.0
     */
    constructor (uri = null, method = null, type = null)
    {
        /** @type {null|string} uri */
        this.uri = uri;

        /** @type {string} method */
        this.method = method !== null ? method : RequestMethod.GET;

        /** @type {Object} requestHeader */
        this.requestHeader = {};

        /** @type {Object} result */
        this.result = {};

        /** @type {string} type */
        this.type = type !== null ? type : RequestType.JSON;

        /** @type {Object} data */
        this.data = {};

        this.requestHeader['Content-Type'] = this.setContentTypeBasedOnType(this.type);
        if (this.type === RequestType.FORM_DATA) {
            delete this.requestHeader['Content-Type'];
        }

        /** @type {XMLHttpRequest} xhr */
        this.result[0] = function (xhr)
        {
            Logger.getInstance().info('Unhandled response from "' + xhr.responseURL + '" with response data "' + xhr.response + '"');
        };

        // global: XMLHttpRequest
        /** @type {XMLHttpRequest} xhr */
        this.xhr = new XMLHttpRequest();
    };

    /**
     * Defines the request content type based on the type
     *
     * @param {string} type Request type
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    setContentTypeBasedOnType (type)
    {
        switch (type) {
            case RequestType.JSON:
                return 'application/json';
            case RequestType.URL_ENCODE:
                return 'application/x-www-form-urlencoded';
            case RequestType.FILE:
                return '';
            case RequestType.FORM_DATA:
                return 'multipart/form-data';
            default:
                return '*/*';
        }
    };

    /**
     * Set request method.
     *
     * @param {string} method Method type
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setMethod (method)
    {
        this.method = method;
    };

    /**
     * Get request method.
     *
     * EnumRequestMethod
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getMethod ()
    {
        return this.method;
    };

    /**
     * Set response type.
     *
     * @param {string} type Method type
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setResponseType (type)
    {
        this.xhr.responseType = type;
    };

    /**
     * Get response type.
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getResponseType ()
    {
        return this.responseType;
    };

    /**
     * Set request header.
     *
     * @param {string} type   Request type
     * @param {string} header Request header
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setRequestHeader (type, header)
    {
        this.requestHeader[type] = header;

        if (header === 'multipart/form-data') {
            delete this.requestHeader[type];
        }
    };

    /**
     * Get request header.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getRequestHeader ()
    {
        return this.requestHeader;
    };

    /**
     * Set request uri.
     *
     * @param {string} uri Request uri
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setUri (uri)
    {
        this.uri = uri;
    };

    /**
     * Get request uri.
     *
     * @return {null|string}
     *
     * @since 1.0.0
     */
    getUri ()
    {
        return this.uri;
    };

    /**
     * Set success callback.
     *
     * @param {function} callback - Success callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setSuccess (callback)
    {
        this.result[200] = callback;
    };

    /**
     * Set result callback.
     *
     * @param {number}   status   Http response status
     * @param {function} callback Callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setResultCallback (status, callback)
    {
        this.result[status] = callback;
    };

    /**
     * Set request data.
     *
     * @param {Object} data Request data
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setData (data)
    {
        this.data = data;
    };

    /**
     * Get request data.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getData ()
    {
        return this.data;
    };

    /**
     * Set request type.
     *
     * @param {string} type Method type
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setType (type)
    {
        this.type                          = type;
        this.requestHeader['Content-Type'] = this.setContentTypeBasedOnType(this.type);
    };

    /**
     * Get request type.
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getType ()
    {
        return this.type;
    };

    /**
     * Create query from object.
     *
     * @param {Object} obj Object to turn into uri query
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    queryfy (obj)
    {
        const str = [];
        for (const p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }

        return str.join('&');
    };

    /**
     * Send request.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    send ()
    {
        if (this.uri === '') {
            return;
        }

        const self = this;

        // @question Consider to change to fetch
        if (this.xhr.readyState !== 1) {
            if (this.type === RequestType.FORM_DATA) {
                // GET request doesn't allow body/payload. Therefor we have to put the data into the uri
                if (this.method === RequestMethod.GET) {
                    let url = this.uri;
                    for (const pair of this.data.entries()) {
                        url += '&' + pair[0] + '=' + pair[1];
                    }

                    this.xhr.open(this.method, UriFactory.build(url));
                } else {
                    this.xhr.open(this.method, UriFactory.build(this.uri));
                }
            } else {
                console.log(UriFactory.build(this.uri));

                this.xhr.open(this.method, UriFactory.build(this.uri));
            }

            for (const p in this.requestHeader) {
                if (Object.prototype.hasOwnProperty.call(this.requestHeader, p) && this.requestHeader[p] !== '') {
                    if (this.requestHeader[p] !== 'multipart/form-data') {
                        // note: If not excluded for multipart/form-data you need to set the boundary= manually for php which is not wanted
                        this.xhr.setRequestHeader(p, this.requestHeader[p]);
                    }
                }
            }
        }

        window.omsApp.logger.log(UriFactory.build(this.uri));
        window.omsApp.logger.log(this.xhr);

        this.xhr.onreadystatechange = function ()
        {
            switch (self.xhr.readyState) {
                case 4:
                    if (typeof self.result[self.xhr.status] === 'undefined') {
                        self.result[0](self.xhr);
                    } else {
                        self.result[self.xhr.status](self.xhr);
                    }
                    break;
                default:
            }
        };

        if (this.type === RequestType.JSON) {
            this.xhr.send(JSON.stringify(this.data));
        } else if (this.type === RequestType.RAW
            || this.type === RequestType.FILE
        ) {
            this.xhr.send(this.data);
        } else if (this.type === RequestType.URL_ENCODE) {
            this.xhr.send(this.queryfy(this.data));
        } else if (this.type === RequestType.FORM_DATA) {
            this.xhr.send(this.data);
        }
    };
};
