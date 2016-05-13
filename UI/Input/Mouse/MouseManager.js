(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Mouse');

    jsOMS.UI.Input.Mouse.MouseManager = function ()
    {
        this.elements = {};
        this.down     = [];
    };

    jsOMS.UI.Input.Mouse.MouseManager.prototype.add = function (element, callback, exact)
    {
        if (typeof this.elements[element] === 'undefined') {
            this.elements[element] = [];

            this.bind(element);
        }

        this.elements[element].push({callback: callback, exact: exact});
    };

    jsOMS.UI.Input.Mouse.MouseManager.prototype.bind = function (element)
    {
        let self = this;

        document.getElementById(element).addEventListener('contextmenu', function (event)
        {
            self.run(element, event);
        }, false);
    };

    jsOMS.UI.Input.Mouse.MouseManager.prototype.run = function (element, event)
    {
        if (typeof this.elements[element] === 'undefined') {
            throw 'Unexpected elmenet!';
        }

        let actions = this.elements[element],
            length  = actions.length;

        console.log();

        for (let i = 0; i < length; i++) {
            if(!actions[i].exact || event.target.getAttribute('id') === element) {
                jsOMS.preventAll(event);
                actions[i].callback();
            }
        }
    };
}(window.jsOMS = window.jsOMS || {}));
