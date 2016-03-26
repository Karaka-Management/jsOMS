(function (jsOMS, undefined) {
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Keyboard');
    
    jsOMS.UI.Input.Keyboard.KeyboardManager = function () 
    {
    };

    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.bind = function (element, keys, callback) 
    {
        element.addEventListener('keyup', function keyBind(event) {
            if(event.keyCode === keys.keyCode) {
                callback();
            }
        });

    };

    jsOMS.UI.Input.Keyboard.KeyboardManager.prototype.unbind = function (element) 
    {
        element.removeEventListener('keyup', keyBind, false);
    };
}(window.jsOMS = window.jsOMS || {}));
