(function (jsOMS, undefined) {
    jsOMS.UI.Input.KeyboardManager = function () 
    {
    };

    jsOMS.UI.Input.KeyboardManager.prototype.bind = function (element, keys, callback) 
    {
        element.addEventListener('keyup', function keyBind(event) {
            if(event.keyCode === keys.keyCode) {
                callback();
            }
        });

    };

    jsOMS.UI.Input.KeyboardManager.prototype.unbind = function (element) 
    {
        element.removeEventListener('keyup', keyBind, false);
    };
}(window.jsOMS = window.jsOMS || {}));
