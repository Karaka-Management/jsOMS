import { RequestMethod } from './RequestMethod.js'
import { RequestType } from './RequestType.js'
import { BrowserType } from './BrowserType.js'
import { OSType } from './OSType.js'
import { UriFactory } from '../../Uri/UriFactory.js'
import { Logger } from '../../Log/Logger.js'

/**
 * Request class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class Request {
    /**
     * @constructor
     *
     * @param {string} uri    Request uri
     * @param {string} method Request method/verb
     * @param {string} type   Request content type
     *
     * @since 1.0.0
     */
    constructor (uri = null, method, type)
    {
        this.uri           = uri;
        this.method        = typeof method !== 'undefined' ? method : RequestMethod.GET;
        this.requestHeader = [];
        this.result        = {};
        this.type          = typeof type !== 'undefined' ? type : RequestType.JSON;
        this.data          = {};

        this.requestHeader['Content-Type'] = this.setContentTypeBasedOnType(this.type);

        this.result[0] = function(xhr)
        {
            Logger.getInstance().info('Unhandled response from "' + xhr.responseURL + '" with response data "' + xhr.response + '"');
        };

        /** global: XMLHttpRequest */
        this.xhr = new XMLHttpRequest();
    };

    /**
     * Defines the request content type based on the type
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    setContentTypeBasedOnType(type)
    {
        switch(type) {
            case RequestType.JSON:
                return 'application/json';
            case RequestType.URL_ENCODE:
                return 'application/x-www-form-urlencoded';
            case RequestType.FILE:
                return '';
            default:
                return 'text/plain';
        }
    };

    /**
     * Get browser.
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    static getBrowser()
    {
        /** global: InstallTrigger */
        /** global: navigator */
        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            return BrowserType.OPERA;
        } else if (typeof InstallTrigger !== 'undefined') {
            return BrowserType.FIREFOX;
        } else if (Object.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
            return BrowserType.SAFARI;
        } else if (/*@cc_on!@*/false || !!document.documentMode) {
            return BrowserType.IE;
        } else if (!!window.StyleMedia) {
            return BrowserType.EDGE;
        } else if (!!window.chrome && !!window.chrome.webstore) {
            return BrowserType.CHROME;
        } else if (((typeof isChrome !== 'undefined' && isChrome)
                || (typeof isOpera !== 'undefined' && isOpera))
            && !!window.CSS
        ) {
            return BrowserType.BLINK;
        }

        return BrowserType.UNKNOWN;
    };

    /**
     * Get os.
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    static getOS()
    {
        for (let os in OSType) {
            if (OSType.hasOwnProperty(os)) {
                /** global: navigator */
                if (navigator.appVersion.toLowerCase().indexOf(OSType[os]) !== -1) {
                    return OSType[os];
                }
            }
        }

        return OSType.UNKNOWN;
    };

    /**
     * Set request method.
     *
     * EnumRequestMethod
     *
     * @param {string} method Method type
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    setMethod(method)
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
     * @since  1.0.0
     */
    getMethod()
    {
        return this.method;
    };

    /**
     * Set response type.
     *
     * EnumResponseType
     *
     * @param {string} type Method type
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    setResponseType(type)
    {
        this.xhr.responseType = type;
    };

    /**
     * Get response type.
     *
     * EnumResponseType
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    getResponseType()
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
     * @since  1.0.0
     */
    setRequestHeader(type, header)
    {
        this.requestHeader[type] = header;
    };

    /**
     * Get request header.
     *
     * @return {Array}
     *
     * @since  1.0.0
     */
    getRequestHeader()
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
     * @since  1.0.0
     */
    setUri(uri)
    {
        this.uri = uri;
    };

    /**
     * Get request uri.
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    getUri()
    {
        return this.uri;
    };

    /**
     * Set success callback.
     *
     * @param {requestCallback} callback - Success callback
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    setSuccess(callback)
    {
        this.result[200] = callback;
    };

    /**
     * Set result callback.
     *
     * @param {int}      status   Http response status
     * @param {function} callback Callback
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    setResultCallback(status, callback)
    {
        this.result[status] = callback;
    };

    /**
     * Set request data.
     *
     * @param {Array} data Request data
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    setData(data)
    {
        this.data = data;
    };

    /**
     * Get request data.
     *
     * @return {Array}
     *
     * @since  1.0.0
     */
    getData()
    {
        return this.data;
    };

    /**
     * Set request type.
     *
     * EnumRequestType
     *
     * @param {string} type Method type
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    setType(type)
    {
        this.type                          = type;
        this.requestHeader['Content-Type'] = this.setContentTypeBasedOnType(this.type);
    };

    /**
     * Get request type.
     *
     * EnumRequestType
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    getType()
    {
        return this.type;
    };

    /**
     * Create query from object.
     *
     * @return {string}
     *
     * @since  1.0.0
     */
    queryfy(obj)
    {
        const str = [];
        for (let p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }

        return str.join("&");
    };

    /**
     * Get request data.
     *
     * @return {Array}
     *
     * @since  1.0.0
     */
    send()
    {
        if (this.uri === '') {
            return;
        }

        const self = this;

        if (this.xhr.readyState !== 1) {
            this.xhr.open(this.method, UriFactory.build(this.uri));

            for (let p in this.requestHeader) {
                if (this.requestHeader.hasOwnProperty(p) && this.requestHeader[p] !== '') {
                    this.xhr.setRequestHeader(p, this.requestHeader[p]);
                }
            }
        }

        console.log(this.xhr);

        this.xhr.onreadystatechange = function()
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
        }
    };
};
