(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Keyboard');

    jsOMS.UI.Input.Keyboard.KeyboardManager = function ()
    {
        this.elements = {};
        this.down     = [];
    };

    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.add = function (element, keys, callback)
    {
        if (typeof this.elements[element] === 'undefined') {
            this.elements[element] = [];

            this.bind(element);
        }

        this.elements[element].push({keys: keys, callback: callback});
    };

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
            if(self.down.length > 0) {
                self.run(element, event);
                self.down = [];
            }
        });
    };

    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.run = function (element, event)
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

            if(match) {
                jsOMS.preventAll(event);
                actions[i].callback();

                break;
            }
        }
    };
}(window.jsOMS = window.jsOMS || {}));
