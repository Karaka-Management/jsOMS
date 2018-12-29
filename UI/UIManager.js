/**
 * UI manager for handling basic ui elements.
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

    jsOMS.UI.UIManager = class {
        /**
         * @constructor
         *
         * @param {Object} app Application object
         *
         * @since 1.0.0
         */
        constructor(app)
        {
            this.app           = app;
            this.formManager   = new jsOMS.UI.Component.Form(this.app);
            this.tabManager    = new jsOMS.UI.Component.Tab();
            this.tableManager  = new jsOMS.UI.Component.Table(this.app);
            this.actionManager = new jsOMS.UI.ActionManager(this.app);
            this.dragNDrop     = new jsOMS.UI.DragNDrop(this.app);
            this.generalUI     = new jsOMS.UI.GeneralUI();

            const self = this;
            /** global: MutationObserver */
            this.domObserver = new MutationObserver(function(mutations) {
                const length = mutations.length;

                for(let i = 0; i < length; ++i) {
                    self.app.eventManager.trigger(mutations[i].target.id + '-' + mutations[i].type, 0, mutations[i]);
                }
            });
        };

        /**
         * Bind & rebind UI elements.
         *
         * @param {string} [id] Element id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bind(id)
        {
            if (typeof id === 'undefined') {
                this.formManager.bind();
                this.tabManager.bind();
                this.tableManager.bind();
                this.actionManager.bind();
                this.dragNDrop.bind();
                this.generalUI.bind();
            } else {
                const tag = document.getElementById(id);
                this.generalUI.bind(tag);

                if(!tag) {
                    return;
                }

                switch (tag.tagName) {
                    case 'form':
                        this.formManager.bind(id);
                        break;
                    case 'table':
                        this.tableManager.bind(id);
                        break;
                    default:
                        this.actionManager.bind(tag);
                }
            }
        };

        /**
         * Get tab manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getFormManager()
        {
            return this.formManager;
        };

        /**
         * Get action manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getActionManager()
        {
            return this.actionManager;
        };

        /**
         * Get drag and drop manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getDragNDrop()
        {
            return this.dragNDrop;
        };

        /**
         * Get tab manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getTabManager()
        {
            return this.tabManager;
        };

        /**
         * Get table manager.
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getTableManager()
        {
            return this.tabManager;
        };

        /**
         * Get DOM observer
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getDOMObserver()
        {
            return this.domObserver;
        };

        /**
         * Get general UI
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        getGeneralUI()
        {
            return this.generalUI;
        };
    }
}(window.jsOMS = window.jsOMS || {}));
