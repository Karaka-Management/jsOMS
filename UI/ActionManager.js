import { Logger } from '../Log/Logger.js';

/**
 * Action manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 *
 * @todo Orange-Management/jsOMS#26
 *  Sync/Async events
 *  Events so fare can be created sync and async depending on the implementation.
 *  It would be better to make it sync/async depending on a option flag.
 *
 * @todo Orange-Management/jsOMS#35
 *  Template actions cannot be overwritten
 *  Templates by nature get added and removed from a page (often in order to reuse existing html to minimize the html load).
 *  The problem with templates is that they need to register in the ActionManager.js.
 *  A listener currently is only registered once per id.
 *  Since templates often keep the same id for some elements this results in a problem because the new template will not register a new listener.
 *  Possible solutions:
 *      1. Force unique ids for templates during setup (pro: fast and easy initial solution, con: action event pollution not solved)
 *      2. Whenever a dom element with action elements is removed, also unregister the listeners (pro: clean solution, con: difficult to implement)
 *  Solution 2 will be implemented.
 *  Maybe this can be performed in the dom removing action events or a dom listener would be required to listen for these dom elements.
 */
export class ActionManager
{
    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     */
    constructor(app)
    {
        this.logger  = Logger.getInstance();
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
     * @since 1.0.0
     */
    bind(id)
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
     * @since 1.0.0
     */
    bindElement (e)
    {
        if (!jsOMS.isValidJson(e.getAttribute('data-action'))) {
            this.logger.error('Invalid json string: \'' + e.getAttribute('data-action') + '\'');

            return;
        }

        const listeners    = JSON.parse(e.getAttribute('data-action')),
            listenerLength = listeners.length,
            self           = this;

        // For every action an event is registered
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
     * @param {Object} listener Listener object
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindListener (id, listener, removable = false)
    {
        const self       = this,
            actionLength = listener.action.length;

        for (let j = 1; j < actionLength; ++j) {
            if (typeof id === 'undefined' || typeof listener.key === 'undefined') {
                this.logger.error('Invalid element id/key: ' + id + '/' + listener.key);
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
                jsOMS.preventAll(event);
            }

            self.runAction(this.id, listener, listener.action[0], event);
        });
    };

    /**
     * Run event action.
     *
     * @param {string} id       Element
     * @param {Object} listener Listener
     * @param {Object} action   Action
     * @param {Object} data     Data for the next action
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    runAction (id, listener, action, data)
    {
        const self = this;

        if (!this.actions.hasOwnProperty(action.type)) {
            this.logger.warning('Undefined action ' + action.type);
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
     * @param {string}   name     Action identifier
     * @param {function} callback Action callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    add (name, callback)
    {
        this.actions[name] = callback;
    };
};