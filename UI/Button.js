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
    "use strict";

    /** @namespace jsOMS.UI */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI');

    /**
     * Constructor
     *
     * @param {Object} app Application
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Button = function (app)
    {
        this.app     = app;
        this.actions = {};
    };

    /**
     * Bind button.
     *
     * @param {string} [id] Button id (optional)
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Button.prototype.bind = function (id)
    {
        if (typeof id !== 'undefined') {
            this.bindButton(document.getElementById(id));
        } else {
            let buttons = document.getElementsByTagName('button'),
                length  = buttons.length;

            for (var i = 0; i < length; i++) {
                if (buttons[i].getAttribute('data-action') !== null) {
                    this.bindButton(buttons[i]);
                }
            }
        }
    };

    /**
     * Bind button.
     *
     * @param {Element} e Button element
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Button.prototype.bindButton = function (e)
    {
        let actions      = JSON.parse(e.getAttribute('data-action')),
            actionLength = actions.length,
            self         = this;

        // For everey action an event is registered
        for (let i = 1; i < actionLength; i++) {
            // todo: right now one event type can only exist once... needs fixing!!!
            this.app.eventManager.addGroup(actions[i - 1].type, e.id + actions[i - 1].type);
            this.app.eventManager.setDone(e.id + actions[i - 1].type, function ()
            {
                // todo: how to pass result from previous action to next action?!
                self.runAction(e, actions[i]);
            });
        }

        // Register event for first action
        e.addEventListener('click', function ()
        {
            self.runAction(this, actions[0]);
        });
    };

    /**
     * Add action callback.
     *
     * @param {string} name Action identifier
     * @param {function} callback Action callback
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Button.prototype.add = function (name, callback)
    {
        this.actions[name] = callback;
    };

    /**
     * Run event action.
     *
     * @param {Element} e Button
     * @param {Object} action Action
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.Button.prototype.runAction = function (e, action)
    {
        let self = this;

        this.actions[action.type](action, function ()
        {
            self.app.eventManager.trigger(e.id, e.id + action.type, false);
        });
    };
}(window.jsOMS = window.jsOMS || {}));
