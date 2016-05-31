/**
 * Form manager class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    /** @namespace jsOMS.UI */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI');

    jsOMS.UI.Button = function (app)
    {
        this.app     = app;
        this.actions = {};
    };

    jsOMS.UI.Button.prototype.bind = function (id)
    {
        if (typeof id !== 'undefined') {
            this.bindButton(id)
        } else {
            let buttons = document.getElementsByTagName('button'),
                length  = buttons.length;

            for (var i = 0; i < length; i++) {
                if (typeof buttons[i].getAttribute('data-action') !== 'undefined' && buttons[i].getAttribute('id') !== null) {
                    this.bindButton(buttons[i].getAttribute('id'));
                }
            }
        }
    };

    jsOMS.UI.Button.prototype.bindButton = function (id)
    {
        let e            = document.getElementById(id),
            actions      = JSON.parse(e.getAttribute('data-action')),
            actionLength = actions.length,
            self         = this;

        // todo: carefull this means a type has to be unique in a button. no multiple actions with same type!!! CHANGE!
        for (let i = 1; i < actionLength; i++) {
            this.app.eventManager.addGroup(actions[i - 1]['type'], id + actions[i - 1]['type']);
            this.app.eventManager.setDone(id + actions[i - 1]['type'], function ()
            {
                // todo: how to pass result from previous action to next action?!
                self.runAction(document.getElementById(id), actions[i]);
            });
        }

        e.addEventListener('click', function (event)
        {
            self.runAction(document.getElementById(id), actions[0]);
        });
    };

    jsOMS.UI.Button.prototype.add = function (name, callback)
    {
        this.actions[name] = callback;
    };

    jsOMS.UI.Button.prototype.runAction = function (e, action)
    {
        let self = this;

        this.actions[action['type']](action, function ()
        {
            self.app.eventManager.triggerDone(e.getAttribute('id'), e.getAttribute('id') + action['type']);
        });
    };
}(window.jsOMS = window.jsOMS || {}));
