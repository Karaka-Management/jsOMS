(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Mouse');

    jsOMS.UI.Input.Mouse.MouseManager = function ()
    {
        this.elements = {};
        this.click    = {time: 0};
    };

    jsOMS.UI.Input.Mouse.MouseManager.prototype.add = function (element, type, button, callback, exact)
    {
        if (typeof this.elements[element] === 'undefined') {
            this.elements[element] = [];
        }

        this.bind(element, type);
        this.elements[element].push({callback: callback, type: type, button: button, exact: exact});
    };

    jsOMS.UI.Input.Mouse.MouseManager.prototype.bind = function (element, type)
    {
        let self = this,
            e = document.getElementById(element);

        if(e === null) {
            return;
        }

        if (type === jsOMS.UI.Input.Mouse.EventType.CONTEXT) {
            e.addEventListener('contextmenu', function (event)
            {
                self.run(element, event);
            }, false);
        } else if (type === jsOMS.UI.Input.Mouse.EventType.LONGPRESS) {
            e.addEventListener('mousedown', function (event)
            {
                self.click.time = new Date().getTime();
            }, false);

            e.addEventListener('mouseup', function (event)
            {
                let duration = new Date().getTime() - self.click.time;

                if (duration > 650) {
                    self.run(element, event);
                }

                self.click.time = 0;
            }, false);
        } else if (type === jsOMS.UI.Input.Mouse.EventType.CLICK) {
            e.addEventListener('click', function (event)
            {
                self.run(element, event);
            }, false);
        }
    };

    jsOMS.UI.Input.Mouse.MouseManager.prototype.run = function (element, event)
    {
        if (typeof this.elements[element] === 'undefined') {
            throw 'Unexpected elmenet!';
        }

        let actions = this.elements[element],
            length  = actions.length;

        for (let i = 0; i < length; i++) {
            if ((!actions[i].exact || event.target.getAttribute('id') === element) && actions[i].button === event.button) {
                jsOMS.preventAll(event);
                actions[i].callback();
            }
        }
    };
}(window.jsOMS = window.jsOMS || {}));
