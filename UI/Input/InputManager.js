/**
 * UI manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.UI.Input */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input');

    jsOMS.UI.Input.InputManager = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor(app)
        {
            this.keyboardManager = new jsOMS.UI.Input.Keyboard.KeyboardManager();
            this.mouseManager    = new jsOMS.UI.Input.Mouse.MouseManager();
            this.voiceManager    = new jsOMS.UI.Input.Voice.VoiceManager(app);
        };

        /**
         * Get keyboard manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getKeyboardManager ()
        {
            return this.keyboardManager;
        };

        /**
         * Get mouse manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getMouseManager ()
        {
            return this.mouseManager;
        };

        /**
         * Get voice manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getVoiceManager ()
        {
            return this.voiceManager;
        };
    }
}(window.jsOMS = window.jsOMS || {}));
