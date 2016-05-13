(function (jsOMS, undefined) {
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input');

        jsOMS.UI.Input.InputManager = function () 
        {
            this.keyBoardManager = new jsOMS.UI.Input.Keyboard.KeyboardManager();
            this.mouseManager = new jsOMS.UI.Input.Mouse.MouseManager();
        };

        jsOMS.UI.Input.InputManager.prototype.getKeyboardManager = function()
        {
            return this.keyBoardManager;
        };

    jsOMS.UI.Input.InputManager.prototype.getMouseManager = function()
    {
        return this.mouseManager;
    };
}(window.jsOMS = window.jsOMS || {}));
