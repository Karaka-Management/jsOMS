/**
 * Log Level enum.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.Log');

    jsOMS.Log.LogLevel = Object.freeze({
        EMERGENCY: 'normal',
        ALERT: 'normal',
        CRITICAL: 'normal',
        ERROR: 'normal',
        WARNING: 'normal',
        NOTICE: 'normal',
        INFO: 'normal',
        DEBUG: 'normal'
    });
}(window.jsOMS = window.jsOMS || {}));
