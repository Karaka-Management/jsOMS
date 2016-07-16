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
    jsOMS.Animation.Canvas.ParticleAnimation = function (canvas)
    {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.width  = screen.width;
        this.height = screen.height;

        this.canvas.width  = width;
        this.canvas.height = height;

        this.particles = [];
        this.maxDistance = 70;
        this.gravitation = 10000000;
    };

    jsOMS.Animation.Canvas.ParticleAnimation.prototype.draw = function ()
    {
        this.invalidate();

        let length = this.particles.length;

        for (let i = 0; i < length; i++) {
            this.particles[i].draw(this.ctx);
        }

        this.updateParticles();
        jsOMS.Animation.Animation.requestAnimationFrame(this.draw);
    };

    jsOMS.Animation.Canvas.ParticleAnimation.prototype.invalidate = function ()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    jsOMS.Animation.Canvas.ParticleAnimation.prototype.updateParticles = function ()
    {
        let particle,
            length = this.particles.length,
            pos,
            vel,
            radius;

        for (let i = 0; i < length; i++) {
            particle = particles[i];
            pos      = particle.getPosition();
            vel      = particle.getVelocity();
            radius   = particle.getRadius();

            pos.x += vel.x;
            pos.y += vel.y;

            // Change on wall hit
            if (pos.x + radius > this.width) {
                pos.x = this.width - radius;
            } else if (pos.x - radius < 0) {
                pos.x = this.width - radius;
            }

            if (pos.y + radius > this.height) {
                pos.y = radius;
            } else if (pos.y - radius < 0) {
                pos.y = this.height - radius;
            }

            particle.setPosition(pos.x, pos.y);

            for (let j = i + 1; j < length; j++) {
                this.updateDistance(particle, particles[j]);
            }
        }
    };

    jsOMS.Animation.Canvas.ParticleAnimation.prototype.updateDistance = function (p1, p2)
    {
        let pos1 = p1.getPosition(),
            pos2 = p2.getPosition(),
            dx   = pos1.x - pos2.x,
            dy   = pos1.y - pos2.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            vel1 = p1.getVelocity(),
            vel2 = p2.getVelocity();

        // Draw line if particles are close
        if (dist <= this.maxDistance) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, ' + ((1.2 - dist / this.maxDistance) * 0.5) + ')';
            this.ctx.moveTo(pos1.x, pos1.y);
            this.ctx.lineTo(pos2.x, pos2.y);
            this.ctx.stroke();
            this.ctx.closePath();

            // Accelerate based on distance (no acceleration yet)
            let ax = dx / this.gravitation,
                ay = dy / this.gravitation;

            vel1.x -= ax;
            vel1.y -= ay;
            p1.setVelocity(vel1.x, vel1.y);

            vel2.x -= ax;
            vel2.y -= ay;
            p2.setVelocity(vel2.x, vel2.y);
        }
    };
}(window.jsOMS = window.jsOMS || {}));