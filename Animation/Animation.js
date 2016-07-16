/**
 * Particle class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Animation */
    jsOMS.Autoloader.defineNamespace('jsOMS.Animation');

    jsOMS.Animation.Animation.requestAnimationFrame = (function ()
    {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback)
            {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}(window.jsOMS = window.jsOMS || {}));
