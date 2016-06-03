/**
 * Touch manager class.
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

    /** @namespace jsOMS.UI.Input.Touch */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Touch');

    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Touch.TouchManager = function (app)
    {
        this.app         = app;
        this.activeSwipe = {};
        this.resetSwipe();
    };

    /**
     * Reset swipe data.
     *
     * This is called in between swipes in order to reset previous swipe data.
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Touch.TouchManager.prototype.resetSwipe = function ()
    {
        this.activeSwipe = {'startX': null, 'startY': null, 'time': null};
    };

    /**
     * Adding swipe functionality.
     *
     * Forwarding swipe to arrow keyes.
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Touch.TouchManager.prototype.add = function (surface)
    {
        let e    = document.getElementById(surface),
            self = this;

        e.addEventListener('touchstart', function (event)
        {
            let touch = this.changedTouches[0];

            self.activeSwipe.startX = touch.pageX;
            self.activeSwipe.startY = touch.pageY;
            self.activeSwipe.time   = new Date().getTime();

            jsOMS.preventAll(event);
        });

        e.addEventListener('touchmove', function (event)
        {
            jsOMS.preventAll(event);
        });

        e.addEventListener('touchend', function (event)
        {
            let touch       = this.changedTouches[0],
                distX       = touch.pageX - self.activeSwipe.startX,
                distY       = touch.pageY - self.activeSwipe.startY,
                elapsedTime = new Date().getTime() - self.activeSwipe.time;

            self.resetSwipe();
            // todo: only prevent all if success
            jsOMS.preventAll(event);

            if (elapsedTime > 300 && distY < 3 && distX < 3) {
                // todo: handle long press here
            } else if (elapsedTime < 500) {
                let e = new Event('keyup');

                if (distY > 100) {
                    e.keyCode = 38;
                    document.dispatchEvent(e);
                } else if (distX > 100) {
                    e.keyCode = 39;
                    document.dispatchEvent(e);
                } else if (distY < -100) {
                    e.keyCode = 40;
                    document.dispatchEvent(e);
                } else if (distX < -100) {
                    e.keyCode = 37;
                    document.dispatchEvent(e);
                }
            }
        });
    };
}(window.jsOMS = window.jsOMS || {}));
