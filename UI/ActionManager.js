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
    jsOMS.UI.ActionManager = function (app)
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
    jsOMS.UI.ActionManager.prototype.bind = function (id)
    {
        let uiElements = typeof e === 'undefined' ? document.querySelectorAll('input, select, textarea, button') : [e],
            length     = uiElements.length;

        for (let i = 0; i < length; i++) {
            if (uiElements[i] !== null && uiElements[i].hasAttribute('data-action')) {
                this.bindElement(uiElements[i]);
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
    jsOMS.UI.ActionManager.prototype.bindElement = function (e)
    {
        let listeners      = JSON.parse(e.getAttribute('data-action')),
            listenerLength = listeners.length,
            actionLength   = 0,
            self           = this;

        // For everey action an event is registered
        for (let i = 0; i < listenerLength; i++) {
            actionLength = listeners[i].action.length;

            for (let j = 1; j < actionLength; j++) {
                // todo: right now one event type can only exist once... needs fixing!!!
                this.app.eventManager.addGroup(e.id + listeners[i].action[j - 1].type, listeners[i].action[j - 1].type);
                this.app.eventManager.setDone(e.id + listeners[i].action[j - 1].type, function ()
                {
                    // todo: how to pass result from previous action to next action?!
                    self.runAction(e, listeners[i].action[j]);
                });
            }

            // Register event for first action
            e.addEventListener(listeners[i].listener, function ()
            {
                self.runAction(this, listeners[i].action[0]);
            });
        }
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
    jsOMS.UI.ActionManager.prototype.runAction = function (e, action)
    {
        let self = this;

        console.log(action.type);
        console.log(this.actions);

        if (!this.actions.hasOwnProperty(action.type)) {
            console.log('Undefined action ' + action.type);
            return;
        }

        this.actions[action.type](action, function ()
        {
            self.app.eventManager.trigger(e.id + action.type, e.id);
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
    jsOMS.UI.ActionManager.prototype.add = function (name, callback)
    {
        this.actions[name] = callback;
    };
}(window.jsOMS = window.jsOMS || {}));
