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

    jsOMS.FormManager.prototype.interpolate = function(message, context, level)
    {
    };

    jsOMS.FormManager.prototype.write = function(message, context, level)
    {
        if(this.verbose) {
            console.log(this.interpolate(message, context, level)));
        }

        if(this.ui) {
            // todo: fill log box, set class and initiate animation
        }

        if(this.remote) {
            let request = new jsOMS.Request(),
            request.setData(message);
            request.setType('json');
            request.setUri(jsOMS.UriFactory.build('/{/lang}/api/log'));
            request.setMethod(jsOMS.EnumRequestMethod.POST);
            request.setRequestHeader('Content-Type', 'application/json');
            request.setSuccess(function (xhr) {});
            request.send();
        }
    };

    jsOMS.FormManager.prototype.emergency = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.EMERGENCY)
    };

    jsOMS.FormManager.prototype.alert = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.ALERT)
    };

    jsOMS.FormManager.prototype.critical = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.CRITICAL)
    };

    jsOMS.FormManager.prototype.error = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.ERROR)
    };

    jsOMS.FormManager.prototype.warning = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.WARNING)
    };

    jsOMS.FormManager.prototype.notice = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.NOTICE)
    };

    jsOMS.FormManager.prototype.info = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.INFO)
    };

    jsOMS.FormManager.prototype.debug = function(message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.DEBUG)
    };

    jsOMS.FormManager.prototype.log = function(level, message, context)
    {
        this.write(message, context, context)
    };

    jsOMS.FormManager.prototype.console = function(level, message, context)
    {
        this.write(message, context, jsOMS.EnumLogLevel.INFO)
    };
}(window.jsOMS = window.jsOMS || {}));
