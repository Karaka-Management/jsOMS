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

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Request = function ()
    {
        this.uri = null;
        this.method = null;
        this.requestHeader = [];
        this.success = null;
        this.type = jsOMS.EnumRequestMethod.GET;
        this.data = {};

        this.xhr = new XMLHttpRequest();
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
    jsOMS.Request.prototype.setMethod = function (method)
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
    jsOMS.Request.prototype.getMethod = function ()
    {
        return this.method;
    };

    /**
     * Set response type.
     *
     * EnumResponseType
     *
     * @param {string} method Method type
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Request.prototype.setResponseType = function (type)
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
    jsOMS.Request.prototype.getResponseType = function ()
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
    jsOMS.Request.prototype.setRequestHeader = function (type, header)
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
    jsOMS.Request.prototype.getRequestHeader = function ()
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
    jsOMS.Request.prototype.setUri = function (uri)
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
    jsOMS.Request.prototype.getUri = function ()
    {
        return this.uri;
    };

    /**
     * Set success callback.
     *
     * @param {requestCallback} success Success callback
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Request.prototype.setSuccess = function (callback)
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
    jsOMS.Request.prototype.setData = function (data)
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
    jsOMS.Request.prototype.getData = function ()
    {
        return this.data
    };

    /**
     * Set request type.
     *
     * EnumRequestType
     *
     * @param {string} method Method type
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Request.prototype.setType = function (type)
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
    jsOMS.Request.prototype.getType = function ()
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
    jsOMS.Request.prototype.queryfy = function (obj)
    {
        var str = [];
        for (var p in obj) {
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
    jsOMS.Request.prototype.send = function ()
    {
        var self = this;

        if (self.xhr.readyState !== 1) {
            self.xhr.open(this.method, this.uri);

            for (var p in this.requestHeader) {
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

        if (this.type === jsOMS.EnumRequestType.JSON) {
            if (typeof this.requestHeader !== 'undefined' && this.requestHeader['Content-Type'] === 'application/json') {
                console.log(JSON.stringify(this.data));
                self.xhr.send(JSON.stringify(this.data));
            } else {
                self.xhr.send(this.queryfy(this.data));
            }
        } else if (this.type === jsOMS.EnumRequestType.RAW) {
            self.xhr.send(this.data);
        }
    };
}(window.jsOMS = window.jsOMS || {}));
