/**
 * UI manager class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    /** @namespace jsOMS.UI.Input */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.InputManager = function ()
    {
        this.keyBoardManager = new jsOMS.UI.Input.Keyboard.KeyboardManager();
        this.mouseManager    = new jsOMS.UI.Input.Mouse.MouseManager();
    };

    /**
     * Get keyboard manager.
     *
     * @return {Object}
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.InputManager.prototype.getKeyboardManager = function ()
    {
        return this.keyBoardManager;
    };

    /**
     * Get mouse manager.
     *
     * @return {Object}
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.InputManager.prototype.getMouseManager = function ()
    {
        return this.mouseManager;
    };
}(window.jsOMS = window.jsOMS || {}));
