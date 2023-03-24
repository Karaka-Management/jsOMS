/**
 * Particle class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
(function (jsOMS)
{
    'use strict';

    /** @namespace jsOMS.Animation.Canvas */
    jsOMS.Autoloader.defineNamespace('jsOMS.Animation.Canvas');

    jsOMS.Animation.Canvas.Particle = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor (posX, posY, velX, velY, radius)
        {
            this.posX = posX;
            this.posY = posY;
            this.velX = velX;
            this.velY = velY;

            this.radius = radius;

            this.color = { r: 255, g: 255, b: 255, a: 0.5 };
        };

        /**
         * Get particle radius
         *
         * @return {number}
         *
         * @method
         *
         * @since 1.0.0
         */
        getRadius ()
        {
            return this.radius;
        };

        /**
         * Set particle position
         *
         * @param {number} posX Position x
         * @param {number} posY Position y
         *
         * @return {void}
         *
         * @method
         *
         * @since 1.0.0
         */
        setPosition (posX, posY)
        {
            this.posX = posX;
            this.posY = posY;
        };

        /**
         * Get position
         *
         * @return {Object}
         *
         * @method
         *
         * @since 1.0.0
         */
        getPosition ()
        {
            return { x: this.posX, y: this.posY };
        };

        /**
         * Set particle velocity
         *
         * @param {float} velX Velocity x
         * @param {float} velY Velocity y
         *
         * @return {void}
         *
         * @method
         *
         * @since 1.0.0
         */
        setVelocity (velX, velY)
        {
            this.velX = velX;
            this.velY = velY;
        };

        /**
         * Get velocity
         *
         * @return {Object}
         *
         * @method
         *
         * @since 1.0.0
         */
        getVelocity ()
        {
            return { x: this.velX, y: this.velY };
        };

        /**
         * Draw particle to canvas
         *
         * @param {Object} ctx Canvas
         *
         * @return {void}
         *
         * @method
         *
         * @since 1.0.0
         */
        draw (ctx)
        {
            ctx.fillStyle = 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')';
            ctx.beginPath();
            ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
        };
    };
}(window.jsOMS = window.jsOMS || {}));
