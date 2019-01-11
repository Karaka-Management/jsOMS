/**
 * Request class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Message.Request */
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Request');

    jsOMS.Message.Request.Request = class {
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
            this.method        = typeof method !== 'undefined' ? method : jsOMS.Message.Request.RequestMethod.GET;
            this.requestHeader = [];
            this.result        = {};
            this.type          = typeof type !== 'undefined' ? type : jsOMS.Message.Request.RequestType.JSON;
            this.data          = {};

            this.requestHeader['Content-Type'] = this.setContentTypeBasedOnType(this.type);

            this.result[0] = function()
            {
                jsOMS.Log.Logger.instance.info('Unhandled response');
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
                case jsOMS.Message.Request.RequestType.JSON:
                    return 'application/json';
                case jsOMS.Message.Request.RequestType.URL_ENCODE:
                    return 'application/x-www-form-urlencoded';
                case jsOMS.Message.Request.RequestType.FILE:
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
                return jsOMS.Message.Request.BrowserType.OPERA;
            } else if (typeof InstallTrigger !== 'undefined') {
                return jsOMS.Message.Request.BrowserType.FIREFOX;
            } else if (Object.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
                return jsOMS.Message.Request.BrowserType.SAFARI;
            } else if (/*@cc_on!@*/false || !!document.documentMode) {
                return jsOMS.Message.Request.BrowserType.IE;
            } else if (!!window.StyleMedia) {
                return jsOMS.Message.Request.BrowserType.EDGE;
            } else if (!!window.chrome && !!window.chrome.webstore) {
                return jsOMS.Message.Request.BrowserType.CHROME;
            } else if ((isChrome || isOpera) && !!window.CSS) {
                return jsOMS.Message.Request.BrowserType.BLINK;
            }

            return jsOMS.Message.Request.BrowserType.UNKNOWN;
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
            for (let os in jsOMS.Message.Request.OSType) {
                if (jsOMS.Message.Request.OSType.hasOwnProperty(os)) {
                    /** global: navigator */
                    if (navigator.appVersion.toLowerCase().indexOf(jsOMS.Message.Request.OSType[os]) !== -1) {
                        return jsOMS.Message.Request.OSType[os];
                    }
                }
            }

            return jsOMS.Message.Request.OSType.UNKNOWN;
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
            const self = this;

            if (this.xhr.readyState !== 1) {
                this.xhr.open(this.method, jsOMS.Uri.UriFactory.build(this.uri));

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
                        jsOMS.Log.Logger.instance.warning('Unhandled ready state change.');
                }
            };

            if (this.type === jsOMS.Message.Request.RequestType.JSON) {
                this.xhr.send(JSON.stringify(this.data));
            } else if (this.type === jsOMS.Message.Request.RequestType.RAW
                || this.type === jsOMS.Message.Request.RequestType.FILE
            ) {
                this.xhr.send(this.data);
            } else if (this.type === jsOMS.Message.Request.RequestType.URL_ENCODE) {
                this.xhr.send(this.queryfy(this.data));
            }
        };
    }
}(window.jsOMS = window.jsOMS || {}));
