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
        const uiElements = typeof e === 'undefined' ? document.querySelectorAll('input, select, textarea, button, data') : [e],
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
        const listeners      = JSON.parse(e.getAttribute('data-action')),
            listenerLength = listeners.length,
            self           = this;

        let actionLength   = 0;

        // For everey action an event is registered
        for (let i = 0; i < listenerLength; i++) {
            actionLength = listeners[i].action.length;

            for (let j = 1; j < actionLength; j++) {
                this.app.eventManager.attach(e.id + listeners[i].action[j - 1].type, function (data)
                {
                    // todo: how to pass result from previous action to next action?!
                    self.runAction(e, listeners[i].action[j], data);
                }, false, true);
                // todo: handle onload action right after registering everything. this will be used for onload api calls in order to get content such as lists or models. Maybe in the main application after registering a invoke('onload') should be called if the application wants to execute the onload elements
                // todo: right now one event type can only exist once... needs fixing!!!
                //this.app.eventManager.addGroup(e.id + listeners[i].action[j - 1].type, listeners[i].action[j - 1].type);
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
    jsOMS.UI.ActionManager.prototype.runAction = function (e, action, data)
    {
        const self = this;

        console.log(action.type);

        if (!this.actions.hasOwnProperty(action.type)) {
            console.log('Undefined action ' + action.type);
            return;
        }

        action.data = data;

        this.actions[action.type](action, function (data)
        {
            self.app.eventManager.trigger(e.id + action.type, e.id, data);
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
