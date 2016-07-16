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

    /** @namespace jsOMS.Animation.Canvas */
    jsOMS.Autoloader.defineNamespace('jsOMS.Animation.Canvas');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Animation.Canvas.Particle = function (posX, posY, velX, velY, radius)
    {
        this.posX = posX;
        this.posY = posY;
        this.velX = velX;
        this.velY = velY;

        this.radius = radius;

        this.color = {r: 255, g: 255, b: 255, a: 0.5};
    };

    jsOMS.Animation.Canvas.Particle.prototype.getRadius = function ()
    {
        return this.radius;
    };

    jsOMS.Animation.Canvas.Particle.prototype.setPosition = function (posX, posY)
    {
        this.posX = posX;
        this.posY = posY;
    };

    jsOMS.Animation.Canvas.Particle.prototype.getPosition = function ()
    {
        return {x: this.posX, y: this.posY};
    };

    jsOMS.Animation.Canvas.Particle.prototype.setVelocity = function (velX, velY)
    {
        this.velX = velX;
        this.velY = velY;
    };

    jsOMS.Animation.Canvas.Particle.prototype.getVelocity = function ()
    {
        return {x: this.velX, y: this.velY};
    };

    jsOMS.Animation.Canvas.Particle.prototype.draw = function (ctx)
    {
        ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')';
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    };
}(window.jsOMS = window.jsOMS || {}));
