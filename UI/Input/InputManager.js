(function (jsOMS, undefined) {
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input');

    jsOMS.Autoloader.include(['jsOMS/UI/Input/Keyboard/KeyBoardManager.js'], function() {
        jsOMS.UI.Input.InputManager = function () 
        {
            this.keyBoardManager = new jsOMS.UI.Input.Keyboard.KeyBoardManager();
        };

        jsOMS.UI.Input.InputManager.prototype.getKeyboardManager = function()
        {
            return this.keyBoardManager;
        };
    });
}(window.jsOMS = window.jsOMS || {}));
