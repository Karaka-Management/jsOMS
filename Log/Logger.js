/**
 * Logger class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
 (function (jsOMS, undefined)
 {
    "use strict";

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Logger = function (verbose, ui, remote)
    {
        this.verbose = typeof verbose !== 'undefined' ? verbose : true;
        this.ui = typeof ui !== 'undefined' ? ui : true;
        this.remote = typeof remote !== 'undefined' ? remote : false;
    };

    jsOMS.Log.Logger.layout = '{datetime}; {level}; {version}; {os}; {browser}; {path}; {message}';

    jsOMS.Log.Logger.prototype.interpolate = function(message, context, level)
    {
        let newMessage = jsOMS.Log.Logger.layout;

        for(replace in context) {
            newMessage = newMessage.replace('{'+replace+'}', context[replace]);
        }

        return newMessage;
    };

    jsOMS.Log.Logger.prototype.createContext = function(message, context, level)
    {
        context['datetime'] = (new Date()).toISOString();
        context['version'] = '1.0.0';
        context['os'] = jsOMS.Message.Request.getOS();
        context['browser'] = jsOMS.Message.Request.getBrowser();
        context['path'] = window.location.href;
        context['level'] = level;
        context['message'] = message;

        return context;
    }

    jsOMS.Log.Logger.prototype.write = function(message, context, level)
    {
        context = this.createContext(message, context, level);

        if(this.verbose) {
            console.log(this.interpolate(message, context, level)));
        }

        if(this.ui) {
            // todo: fill log box, set class and initiate animation
        }

        if(this.remote) {
            let request = new jsOMS.Message.Request(),
            request.setData(context);
            request.setType(jsOMS.Message.Response.ResponseType.JSON);
            request.setUri('/{/lang}/api/log');
            request.setMethod(jsOMS.Message.Request.RequestMethod.POST);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setSuccess(function (xhr) {});
            request.send();
        }
    };

    jsOMS.Log.Logger.prototype.emergency = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.EMERGENCY)
    };

    jsOMS.Log.Logger.prototype.alert = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.ALERT)
    };

    jsOMS.Log.Logger.prototype.critical = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.CRITICAL)
    };

    jsOMS.Log.Logger.prototype.error = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.ERROR)
    };

    jsOMS.Log.Logger.prototype.warning = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.WARNING)
    };

    jsOMS.Log.Logger.prototype.notice = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.NOTICE)
    };

    jsOMS.Log.Logger.prototype.info = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.INFO)
    };

    jsOMS.Log.Logger.prototype.debug = function(message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.DEBUG)
    };

    jsOMS.Log.Logger.prototype.log = function(level, message, context)
    {
        this.write(message, context, context)
    };

    jsOMS.Log.Logger.prototype.console = function(level, message, context)
    {
        this.write(message, context, jsOMS.Log.LogLevel.INFO)
    };
}(window.jsOMS = window.jsOMS || {}));
