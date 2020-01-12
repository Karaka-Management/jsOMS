/**
 * Keyboard manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
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
     * @param {string} element Container id
     * @param {Array} keys Keyboard keys
     * @param {callback} callback Callback
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

        this.elements[element].push({keys: keys, callback: callback});
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
        const elements = document.querySelectorAll(element);
        const self     = this,
            length     = elements.length;


        for (let i = 0; i < length; ++i) {
            elements[i].addEventListener('keydown', function keyBind(event)
            {
                self.down.push(event.keyCode);
            });

            elements[i].addEventListener('keyup', function keyBind(event)
            {
                if (self.down.length > 0) {
                    self.run(element, event);
                    self.down = [];
                }
            });
        }
    };

    /**
     * Execute callback based on key presses.
     *
     * @param {string} element Container id
     * @param {Object} event Key event
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
            throw 'Unexpected elmenet!';
        }

        const actions = this.elements[element],
            length    = actions.length,
            keyLength = this.down.length;
        let match     = false;

        for (let i = 0; i < length; ++i) {
            for (let j = 0; j < keyLength; ++j) {
                if (actions[i].keys.indexOf(this.down[j]) === -1) {
                    match = false;

                    break;
                }

                match = true;
            }

            if (match) {
                jsOMS.preventAll(event);
                actions[i].callback();

                break;
            }
        }
    };
};
