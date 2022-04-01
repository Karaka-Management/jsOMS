import { KeyboardManager } from '../../../jsOMS/UI/Input/Keyboard/KeyboardManager.js';
import { MouseManager }    from '../../../jsOMS/UI/Input/Mouse/MouseManager.js';
import { VoiceManager }    from '../../../jsOMS/UI/Input/Voice/VoiceManager.js';

/**
 * UI manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class InputManager
{
    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     */
    constructor (app)
    {
        this.keyboardManager = new KeyboardManager();
        this.mouseManager    = new MouseManager();
        this.voiceManager    = new VoiceManager(app);
    };

    /**
     * Get keyboard manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
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
     * @since 1.0.0
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
     * @since 1.0.0
     */
    getVoiceManager ()
    {
        return this.voiceManager;
    };
};
