/**
 * Request class.
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
    jsOMS.Message.Request.Request = function (uri, method, type)
    {
        this.uri           = typeof uri !== 'undefined' ? uri : null;
        this.method        = typeof method !== 'undefined' ? method : jsOMS.Message.Request.RequestMethod.GET;
        this.requestHeader = [];
        this.success       = null;
        this.type          = typeof type !== 'undefined' ? type : jsOMS.Message.Response.ResponseType.JSON;
        this.data          = {};
        this.xhr           = new XMLHttpRequest();
    };

    jsOMS.Message.Request.Request.getBrowser = function ()
    {
        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            return jsOMS.Message.Request.BrowserType.OPERA;
        } else if (typeof InstallTrigger !== 'undefined') {
            return jsOMS.Message.Request.BrowserType.FIREFOX;
        } else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
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
    };

    jsOMS.Message.Request.Request.getOS = function ()
    {
        for (let os in jsOMS.Message.Request.OSType) {
            if (navigator.appVersion.toLowerCase().indexOf(jsOMS.Message.Request.OSType[os]) !== -1) {
                return jsOMS.Message.Request.OSType[os];
            }
        }
    };

    /**
     * Set request method.
     *
     * EnumRequestMethod
     *
     * @param {string} method Method type
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setMethod = function (method)
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
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.getMethod = function ()
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
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setResponseType = function (type)
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
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.getResponseType = function ()
    {
        return this.responseType;
    };

    /**
     * Set request header.
     *
     * @param {string} type Request type
     * @param {string} header Request header
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setRequestHeader = function (type, header)
    {
        this.requestHeader[type] = header;
    };

    /**
     * Get request header.
     *
     * @return {string}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.getRequestHeader = function ()
    {
        return this.requestHeader;
    };

    /**
     * Set request uri.
     *
     * @param {string} uri Request uri
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setUri = function (uri)
    {
        this.uri = uri;
    };

    /**
     * Get request uri.
     *
     * @return {string}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.getUri = function ()
    {
        return this.uri;
    };

    /**
     * Set success callback.
     *
     * @callback requestCallback
     * @param {requestCallback} callback - Success callback
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setSuccess = function (callback)
    {
        this.success = callback;
    };

    /**
     * Set request data.
     *
     * @param {Array} data Request data
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setData = function (data)
    {
        this.data = data;
    };

    /**
     * Get request data.
     *
     * @return {Array}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.getData = function ()
    {
        return this.data
    };

    /**
     * Set request type.
     *
     * EnumRequestType
     *
     * @param {string} type Method type
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.setType = function (type)
    {
        this.type = type;
    };

    /**
     * Get request type.
     *
     * EnumRequestType
     *
     * @return {string}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.getType = function ()
    {
        return this.type;
    };

    /**
     * Create query from object.
     *
     * @return {string}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.queryfy = function (obj)
    {
        let str = [];
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
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Message.Request.Request.prototype.send = function ()
    {
        let self = this;

        if (self.xhr.readyState !== 1) {
            self.xhr.open(this.method, jsOMS.Uri.UriFactory.build(this.uri));

            for (let p in this.requestHeader) {
                if (this.requestHeader.hasOwnProperty(p)) {
                    self.xhr.setRequestHeader(p, this.requestHeader[p]);
                }
            }
        }

        self.xhr.onreadystatechange = function ()
        {
            if (self.xhr.readyState === 4 && self.xhr.status === 200) {
                self.success(self.xhr);
            }
        };

        if (this.type === jsOMS.Message.Request.RequestType.JSON) {
            if (typeof this.requestHeader !== 'undefined' && this.requestHeader['Content-Type'] === 'application/json') {
                console.log(JSON.stringify(this.data));
                self.xhr.send(JSON.stringify(this.data));
            } else {
                self.xhr.send(this.queryfy(this.data));
            }
        } else if (this.type === jsOMS.Message.Request.RequestType.RAW) {
            self.xhr.send(this.data);
        }
    };
}(window.jsOMS = window.jsOMS || {}));
