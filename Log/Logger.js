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
    jsOMS.Autoloader.defineNamespace('jsOMS.Log');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Log.Logger = function (verbose, ui, remote)
    {
        this.verbose = typeof verbose !== 'undefined' ? verbose : true;
        this.ui = typeof ui !== 'undefined' ? ui : true;
        this.remote = typeof remote !== 'undefined' ? remote : false;
    };

    jsOMS.Log.Logger.layout = '{datetime}; {level}; {version}; {os}; {browser}; {path}; {message}';

    jsOMS.Log.Logger.prototype.interpolate = function(message, context, level)
    {
        let newMessage = jsOMS.Log.Logger.layout;

        for(let replace in context) {
            newMessage = newMessage.replace('{'+replace+'}', context[replace]);
        }

        return newMessage;
    };

    jsOMS.Log.Logger.prototype.createContext = function(message, context, level)
    {
        context['datetime'] = (new Date()).toISOString();
        context['version'] = '1.0.0';
        context['os'] = jsOMS.Message.Request.Request.getOS();
        context['browser'] = jsOMS.Message.Request.Request.getBrowser();
        context['path'] = window.location.href;
        context['level'] = level;
        context['message'] = message;

        return context;
    };

    jsOMS.Log.Logger.prototype.write = function(message, context, level)
    {
        context = this.createContext(message, context, level);

        if(this.verbose) {
            let color = '000';

            switch(level) {
                case 'info':
                case 'notice':
                case 'log':
                    color = '000';
                    break;
                case 'debug':
                    color = '289E39';
                    break;
                case 'warning':
                case 'alert':
                    color = 'FFA600';
                    break;
                case 'error':
                case 'critical':
                case 'emergency':
                    color = 'CF304A';
                    break;
            }

            console.log('%c' + this.interpolate(message, context, level), 'color: #' + color);
        }

        if(this.ui) {
            // todo: fill log box, set class and initiate animation
        }

        if(this.remote) {
            let request = new jsOMS.Message.Request.Request();
            request.setData(context);
            request.setType(jsOMS.Message.Response.Response.ResponseType.JSON);
            request.setUri('/{/lang}/api/log');
            request.setMethod(jsOMS.Message.Request.Request.RequestMethod.POST);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setSuccess(function (xhr) {});
            request.send();
        }
    };

    jsOMS.Log.Logger.prototype.emergency = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.EMERGENCY)
    };

    jsOMS.Log.Logger.prototype.alert = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.ALERT)
    };

    jsOMS.Log.Logger.prototype.critical = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.CRITICAL)
    };

    jsOMS.Log.Logger.prototype.error = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.ERROR)
    };

    jsOMS.Log.Logger.prototype.warning = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.WARNING)
    };

    jsOMS.Log.Logger.prototype.notice = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.NOTICE)
    };

    jsOMS.Log.Logger.prototype.info = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.INFO)
    };

    jsOMS.Log.Logger.prototype.debug = function(message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.DEBUG)
    };

    jsOMS.Log.Logger.prototype.log = function(level, message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, context)
    };

    jsOMS.Log.Logger.prototype.console = function(level, message, context)
    {
        context = typeof context === 'undefined' ? {} : context;

        this.write(message, context, jsOMS.Log.LogLevel.INFO)
    };
}(window.jsOMS = window.jsOMS || {}));
