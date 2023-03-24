/**
 * Unhandled Exception class.
 *
 * This class handles all unhandled exceptions depending on the configuration.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
(function ()
{
    'use strict';

    /** @type {Error} e */
    window.addEventListener('error', function (e)
    {
        /** global: jsOMS */
        // jsOMS.Log.Logger.instance.error(e.error);

        return false;
    });
}(window.jsOMS = window.jsOMS || {}));
