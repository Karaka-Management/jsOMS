/**
 * Module factory.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.Module');
    
    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Module.ModuleFactory = function ()
    {
    };

    /**
     * Get module instance.
     *
     * @param {string} module Module name
     * @param {Object} app Application reference
     *
     * @return {Object}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Module.ModuleFactory.getInstance = function (module, app)
    {
        return new jsOMS.Modules[module](app);
    };
}(window.jsOMS = window.jsOMS || {}));
