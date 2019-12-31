import { EventType } from '../../../../jsOMS/UI/Input/Mouse/EventType.js';

/**
 * Mouse manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class MouseManager
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        this.elements = {};
        this.click    = {time: 0};
    };

    /**
     * Add input listener.
     *
     * @param {string} element Container id
     * @param {int} type Action type
     * @param {int} button Button
     * @param {callback} callback Callback
     * @param {bool} exact ??? todo: can't remember why this was important oO!!!
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    add (element, type, button, callback, exact)
    {
        if (typeof this.elements[element] === 'undefined') {
            this.elements[element] = [];
        }

        this.bind(element, type);
        this.elements[element].push({callback: callback, type: type, button: button, exact: exact});
    };

    /**
     * Add input listener.
     *
     * @param {string} element Element id
     * @param {int} type Action type
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (element, type)
    {
        const self = this,
            e      = document.getElementById(element);

        if (!e) {
            return;
        }

        if (type === EventType.CONTEXT) {
            e.addEventListener('contextmenu', function (event)
            {
                self.run(element, event);
            }, false);
        } else if (type === EventType.LONGPRESS) {
            e.addEventListener('mousedown', function (event)
            {
                self.click.time = new Date().getTime();
            }, false);

            e.addEventListener('mouseup', function (event)
            {
                const duration = new Date().getTime() - self.click.time;

                if (duration > 650) {
                    self.run(element, event);
                }

                self.click.time = 0;
            }, false);
        } else if (type === EventType.CLICK) {
            e.addEventListener('click', function (event)
            {
                self.run(element, event);
            }, false);
        }
    };

    /**
     * Run mouse input callback.
     *
     * @param {string} element Element id
     * @param {Object} event Click event
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    run (element, event)
    {
        if (typeof this.elements[element] === 'undefined') {
            throw 'Unexpected elmenet!';
        }

        const actions = this.elements[element],
            length    = actions.length;

        for (let i = 0; i < length; ++i) {
            if ((!actions[i].exact || event.target.getAttribute('id') === element)
                && actions[i].button === event.button
            ) {
                jsOMS.preventAll(event);
                actions[i].callback();
            }
        }
    };
};
