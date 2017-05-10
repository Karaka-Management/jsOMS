/**
 * UI manager for handling basic ui elements.
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
     * @constructor
     *
     * @param {Object} app Application object
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager = function (app)
    {
        this.app           = app;
        this.formManager   = new jsOMS.UI.Component.Form(this.app);
        this.tabManager    = new jsOMS.UI.Component.Tab(this.app.responseManager);
        this.tableManager  = new jsOMS.UI.Component.Table(this.app.responseManager);
        this.actionManager = new jsOMS.UI.ActionManager(this.app);
        this.dragNDrop     = new jsOMS.UI.DragNDrop(this.app);
    };

    /**
     * Bind & rebind UI elements.
     *
     * @param {string} [id] Element id
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager.prototype.bind = function (id)
    {
        if (typeof id === 'undefined') {
            this.formManager.bind();
            this.tabManager.bind();
            this.tableManager.bind();
            this.actionManager.bind();
            this.dragNDrop.bind();
        } else {
            const tag = document.getElementById(id);

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
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager.prototype.getFormManager = function ()
    {
        return this.formManager;
    };

    /**
     * Get action manager.
     *
     * @return {Object}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager.prototype.getActionManager = function ()
    {
        return this.actionManager;
    };

    /**
     * Get drag and drop manager.
     *
     * @return {Object}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager.prototype.getDragNDrop = function ()
    {
        return this.dragNDrop;
    };

    /**
     * Get tab manager.
     *
     * @return {Object}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager.prototype.getTabManager = function ()
    {
        return this.tabManager;
    };

    /**
     * Get table manager.
     *
     * @return {Object}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager.prototype.getTableManager = function ()
    {
        return this.tabManager;
    };
}(window.jsOMS = window.jsOMS || {}));
