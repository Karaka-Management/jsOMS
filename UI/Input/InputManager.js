(function (jsOMS, undefined) {
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input');

        jsOMS.UI.Input.InputManager = function () 
        {
            this.keyBoardManager = new jsOMS.UI.Input.Keyboard.KeyboardManager();
        };

        jsOMS.UI.Input.InputManager.prototype.getKeyboardManager = function()
        {
            return this.keyBoardManager;
        };
}(window.jsOMS = window.jsOMS || {}));
