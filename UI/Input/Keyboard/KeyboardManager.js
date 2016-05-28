/**
 * Keyboard manager class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    /** @namespace jsOMS.UI.Input.Keyboard */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Keyboard');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Keyboard.KeyboardManager = function ()
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.add = function (element, keys, callback)
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
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.bind = function (element)
    {
        let self = this;

        // todo: implement keyboard for selected elements right now only global hotkeys possible
        document.addEventListener('keydown', function keyBind(event)
        {
            self.down.push(event.keyCode);
        });

        document.addEventListener('keyup', function keyBind(event)
        {
            if (self.down.length > 0) {
                self.run(element);
                self.down = [];
            }
        });
    };

    /**
     * Execute callback based on key presses.
     *
     * @param {string} element Container id
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.run = function (element)
    {
        if (typeof this.elements[element] === 'undefined') {
            throw 'Unexpected elmenet!';
        }

        let actions   = this.elements[element],
            length    = actions.length,
            keyLength = this.down.length,
            match     = false;

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < keyLength; j++) {
                if (actions[i].keys.indexOf(this.down[j]) === -1) {
                    match = false;

                    break;
                } else {
                    match = true;
                }
            }

            if (match) {
                jsOMS.preventAll(event);
                actions[i].callback();

                break;
            }
        }
    };
}(window.jsOMS = window.jsOMS || {}));
