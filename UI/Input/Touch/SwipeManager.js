/**
 * Swipe manager class.
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
    jsOMS.UI.Input.Touch.SwipeManager = function (app)
    {
        this.app     = app;
        this.surface = {};

        this.activeSwipe = {};
        this.resetSwipe();
    };

    jsOMS.UI.Input.Touch.SwipeManager.prototype.resetSwipe = function ()
    {
        this.activeSwipe = {'startX': null, 'startY': null, 'time': null};
    };

    jsOMS.UI.Input.Touch.SwipeManager.prototype.add = function (surface, id, cUp, cRight, cDown, cLeft)
    {
        cUp    = typeof cUp === 'undefined' ? null : cUp;
        cRight = typeof cRight === 'undefined' ? null : cRight;
        cDown  = typeof cDown === 'undefined' ? null : cDown;
        cLeft  = typeof cLeft === 'undefined' ? null : cLeft;

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

            if (elapsedTime < 500) {
                if (distY > 100 && cUp !== null) {
                    cUp();
                } else if (distX > 100 && cRight !== null) {
                    cRight();
                } else if (distY < -100 && cDown !== null) {
                    cDown();
                } else if (distX < -100 && cLeft !== null) {
                    cLeft();
                }
            }

            self.resetSwipe();

            jsOMS.preventAll(event);
        });
    };


}(window.jsOMS = window.jsOMS || {}));
