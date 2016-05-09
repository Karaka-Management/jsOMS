
/**
 * Touch manager class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Touch');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Touch.TouchManager = function (app)
    {
        this.app    = app;
        this.surfaces = {};
    };

    jsOMS.UI.FormManager.prototype.add = function (id, callback)
    {
    };
    
}(window.jsOMS = window.jsOMS || {}));
