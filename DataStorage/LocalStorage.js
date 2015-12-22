/**
 * LocalStorage class.
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
    jsOMS.LocalStorage = function ()
    {
    };

    /**
     * Is local storage available?
     *
     * @return {boolean}
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.LocalStorage.prototype.available = function ()
    {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    };
}(window.jsOMS = window.jsOMS || {}));
