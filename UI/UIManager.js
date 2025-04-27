import { Form }           from './Component/Form.js';
import { Tab }            from './Component/Tab.js';
import { Table }          from './Component/Table.js';
import { ActionManager }  from './ActionManager.js';
import { DragNDrop }      from './DragNDrop.js';
import { Order }          from './Order.js';
import { RemoteData }     from './RemoteData.js';
import { GeneralUI }      from './GeneralUI.js';
import { UIStateManager } from './UIStateManager.js';

/**
 * UI manager for handling basic ui elements.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export class UIManager
{
    /**
     * @constructor
     *
     * @param {Object} app Application object
     *
     * @since 1.0.0
     */
    constructor (app)
    {
        this.app            = app;
        this.formManager    = new Form(this.app);
        this.tabManager     = new Tab(this.app);
        this.tableManager   = new Table(this.app);
        this.actionManager  = new ActionManager(this.app);
        this.dragNDrop      = new DragNDrop(this.app);
        this.order          = new Order(this.app);
        this.generalUI      = new GeneralUI(this.app);
        this.remoteData     = new RemoteData(this.app);
        this.uiStateManager = new UIStateManager(this.app);

        const self = this;
        /** global: MutationObserver */
        this.domObserver = new MutationObserver(function (mutations) {
            const length = mutations.length;

            for (let i = 0; i < length; ++i) {
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
     * @since 1.0.0
     */
    bind (id = null)
    {
        if (id === null) {
            this.formManager.bind();
            this.tabManager.bind();
            this.tableManager.bind();
            this.actionManager.bind();
            this.dragNDrop.bind();
            this.order.bind();
            this.generalUI.bind();
            this.remoteData.bind();
            this.uiStateManager.bind();

            return;
        }

        const tag = document.getElementById(id);
        this.generalUI.bind(tag);

        if (!tag) {
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
    };

    /**
     * Get tab manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getFormManager ()
    {
        return this.formManager;
    };

    /**
     * Get action manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getActionManager ()
    {
        return this.actionManager;
    };

    /**
     * Get drag and drop manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getDragNDrop ()
    {
        return this.dragNDrop;
    };

    /**
     * Get drag and drop manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getOrder ()
    {
        return this.order;
    };

    /**
     * Get remote data manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getRemoteData ()
    {
        return this.remoteData;
    };

    /**
     * Get remote data manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getUIStatemanager ()
    {
        return this.uiStateManager;
    };

    /**
     * Get tab manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getTabManager ()
    {
        return this.tabManager;
    };

    /**
     * Get table manager.
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getTableManager ()
    {
        return this.tabManager;
    };

    /**
     * Get DOM observer
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getDOMObserver ()
    {
        return this.domObserver;
    };

    /**
     * Get general UI
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getGeneralUI ()
    {
        return this.generalUI;
    };
};
