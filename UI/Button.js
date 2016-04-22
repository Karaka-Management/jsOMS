/**
 * Form manager class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.UI');

    jsOMS.UI.Button = function()
    {
        this.buttons = {};
    };

    jsOMS.UI.Button.prototype.bind = function(id) 
    {

    };

    jsOMS.UI.Button.prototype.bindButton = function(id)
    {
        let e = document.getElementById(id),
        actions = e.getAttribute('data-action'),
        actionLength = e.length;

        for(let i = 0; i < actionLength; i++) {
            this.bindListener(e, actions[i]);
        }
    };

    jsOMS.UI.Button.prototype.bindListener = function(e, listener) 
    {
        let self = this;

        switch(listener['type']) {
            case 'click':
                e.addEventListener('click', function(event) {
                    self.runAction(this, listener['action']);
                });
                break;
        }
    };

    jsOMS.UI.Button.prototype.runAction = function(e, action)
    {
        let result = null,
        actionLength = action.length;

        for(let i = 0; i < actionLength; i++) {
            result = this.actionRunner(action[i], result);
        }
    };

    jsOMS.UI.Button.prototype.actionRunner = function(action, data)
    {
        switch(action['type']) {
            case 'load':
                return this.runLoad(action);
            case 'fill':
                return this.runFill(action, data);
            case 'show':
                return this.runShow(action);
            case 'hide':
                return this.runHide(action);
        }
    };

    jsOMS.UI.Button.prototype.runLoad = function(action)
    {
        let request = new jsOMS.Message.Request.Request();
        request.send();
    };

    jsOMS.UI.Button.prototype.runFill = function(e, data)
    {

    };

    jsOMS.UI.Button.prototype.runShow = function(e)
    {

    };

    jsOMS.UI.Button.prototype.runHide = function(e)
    {

    };
}(window.jsOMS = window.jsOMS || {}));
