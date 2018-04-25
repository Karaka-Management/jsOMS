/**
 * Form manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
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
     */
    jsOMS.UI.ActionManager = function (app)
    {
        this.app     = app;
        this.actions = {};
    };

    /**
     * Bind element.
     *
     * @param {string} [id] Element id (optional)
     *
     * @return {void}
     *
     * @method
     *
     * @since 1.0.0
     */
    jsOMS.UI.ActionManager.prototype.bind = function (id)
    {
        const uiElements = typeof id === 'undefined' ? document.querySelectorAll('[data-action]') : (typeof id.length !== 'undefined' ? id : [id]),
            length       = uiElements.length;

        for (let i = 0; i < length; ++i) {
            if (uiElements[i] !== null && uiElements[i].hasAttribute('data-action')) {
                this.bindElement(uiElements[i]);
            }
        }
    };

    /**
     * Bind element.
     *
     * @param {Element} e Element to bind
     *
     * @return {void}
     *
     * @method
     *
     * @since 1.0.0
     */
    jsOMS.UI.ActionManager.prototype.bindElement = function (e)
    {
        const listeners    = JSON.parse(e.getAttribute('data-action')),
            listenerLength = listeners.length,
            self           = this;

        // For everey action an event is registered
        for (let i = 0; i < listenerLength; ++i) {
            let c = [e], hasSelector = false;

            if (listeners[i].hasOwnProperty('selector')) {
                c           = document.querySelectorAll(listeners[i].selector);
                hasSelector = true;
            }

            let childLength = c.length;

            for (let j = 0; j < childLength; ++j) {
                this.bindListener(c[j].id, listeners[i]);
            }

            // if it has selector then a listener for child events must be implemented since these can potentially changed without any knowledge
            // todo: what if the selector parent is different from "e"? then this doesn't make sense! Maybe this isn't allowed to happen!
            // todo: careful this could cause bugs if there is another component relying on a listener for this dom element. Maybe create actionManager domlistener?
            //       Maybe just use this listener for ALL action listeners and check if delete, then remove otherwise do current stuff.
            //       Problem is, the listener doesn't work for the node itself only for children and listening to ALL document nodes might be a bad idea?!?!?!
            const observeConfig = { childList: false, attributes: true, subtree: false };

            if (hasSelector) {
                this.app.eventManager.attach(e.id + '-childList', function(data) {
                    const length = data.addedNodes.length;

                    for (let j = 0; j < length; ++j) {
                        self.bindListener(data.addedNodes[j].id, listeners[i], true);
                        // todo only make removable if action itself is defined as auto removable
                    }
                });

                observeConfig.childList = true;
                observeConfig.subtree   = true;
            }

            this.app.eventManager.attach(e.id + '-attributes', function(data) {});
            this.app.uiManager.getDOMObserver().observe(e, observeConfig);
        }
    };

    /**
     * Bind listener for object
     *
     * @param {string} id Element to bind
     * @param {object} listener Listener object
     *
     * @return {void}
     *
     * @method
     *
     * @since  1.0.0
     */
    jsOMS.UI.ActionManager.prototype.bindListener = function(id, listener, removable = false)
    {
        const self       = this,
            actionLength = listener.action.length;

        for (let j = 1; j < actionLength; ++j) {
            if (typeof id === 'undefined' || typeof listener.key === 'undefined') {
                jsOMS.Log.Logger.instance.error('Invalid element id/key: ' + id + '/' + listener.key);
                return;
            }

            this.app.eventManager.attach(id + '-' + listener.key + '-' + listener.action[j - 1].key, function (data)
            {
                self.runAction(id, listener, listener.action[j], data);
            }, removable, true);
        }
        // todo: the true here is a memory leak since it should be removed at some point?!
        // todo: handle onload action right after registering everything. this will be used for onload api calls in order to get content such as lists or models. Maybe in the main application after registering a invoke('onload') should be called if the application wants to execute the onload elements

        // Register event for first action
        document.getElementById(id).addEventListener(listener.listener, function (event)
        {
            if (listener.preventDefault) {
                event.preventDefault();
            }

            self.runAction(this.id, listener, listener.action[0], event);
        });
    };

    /**
     * Run event action.
     *
     * @param {string} id Element
     * @param {Object} listener Listener
     * @param {Object} action Action
     * @param {Object} data Data for the next action
     *
     * @return {void}
     *
     * @method
     *
     * @since 1.0.0
     */
    jsOMS.UI.ActionManager.prototype.runAction = function (id, listener, action, data)
    {
        const self = this;

        if (!this.actions.hasOwnProperty(action.type)) {
            jsOMS.Log.Logger.instance.warning('Undefined action ' + action.type);
            return;
        }

        action.data = data;

        this.actions[action.type](action, function (data)
        {
            self.app.eventManager.trigger(id + '-' + listener.key + '-' + action.key, id, data);
        }, id);
    };

    /**
     * Add action callback.
     *
     * @param {string} name Action identifier
     * @param {function} callback Action callback
     *
     * @return {void}
     *
     * @method
     *
     * @since 1.0.0
     */
    jsOMS.UI.ActionManager.prototype.add = function (name, callback)
    {
        this.actions[name] = callback;
    };
}(window.jsOMS = window.jsOMS || {}));
