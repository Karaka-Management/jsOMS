import { jsOMS } from '../../../Utils/oLib.js';
/**
 * Keyboard manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export class KeyboardManager
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        this.elements = {};
        this.down     = [];
    };

    /**
     * Add input listener.
     *
     * @param {string}   element  Container id
     * @param {Array}    keys     Keyboard keys
     * @param {function} callback Callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    add (element, keys, callback)
    {
        if (typeof this.elements[element] === 'undefined') {
            this.elements[element] = [];

            this.bind(element);
        }

        this.elements[element].push({ keys: keys, callback: callback });
    };

    /**
     * Bind container for keyboard input.
     *
     * @param {string} element Container id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (element)
    {
        const self     = this;
        const elements = element === '' ? [document] : document.querySelectorAll(element);
        const length   = elements.length;

        for (let i = 0; i < length; ++i) {
            elements[i].addEventListener('keydown', function (event)
            {
                if (self.down.includes(event.keyCode)) {
                    // Already fired
                    return;
                }

                self.down.push(event.keyCode);
                self.run(element, event);
            });

            elements[i].addEventListener('keyup', function (event)
            {
                let index = self.down.indexOf(event.keyCode);
                while (index > -1) {
                    self.down.splice(index, 1);
                    index = self.down.indexOf(event.keyCode);
                }
            });
        }
    };

    /**
     * Execute callback based on key presses.
     *
     * @param {string} element Container id
     * @param {Event}  event   Key event
     *
     * @return {void}
     *
     * @throws {Error}
     *
     * @since 1.0.0
     */
    run (element, event)
    {
        if (typeof this.elements[element] === 'undefined') {
            throw new Error('Unexpected element!');
        }

        const actions       = this.elements[element].concat(this.elements['']);
        const actionsLength = actions.length;
        const downKeyLength = this.down.length;

        for (let i = 0; i < actionsLength; ++i) {
            const actionKeyLength = actions[i].keys.length;
            let match             = true;

            for (let j = 0; j < actionKeyLength; ++j) {
                if (this.down.indexOf(actions[i].keys[j]) === -1) {
                    match = false;

                    break;
                }
            }

            if (match) {
                for (let j = 0; j < downKeyLength; ++j) {
                    if (actions[i].keys.indexOf(this.down[j]) === -1) {
                        match = false;

                        break;
                    }
                }
            }

            if (match) {
                jsOMS.preventAll(event);
                actions[i].callback(event);

                break;
            }
        }
    };
};
