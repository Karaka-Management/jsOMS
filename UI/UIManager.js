/**
 * UI manager for handling basic ui elements.
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
    
    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.UIManager = function (app)
    {
        this.app = app;
        this.formManager = new jsOMS.UI.FormManager(this.app);
        this.tabManager = new jsOMS.UI.TabManager(this.app.responseManager);
        this.tableManager = new jsOMS.UI.TableManager(this.app.responseManager);
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
        } else {
            let tag = document.getElementById(id);

            switch(tag.tagName) {
                case 'form':
                    this.formManager.bind(id);
                    break;
                case 'table':
                    this.tableManager.bind(id);
                    break;
            };
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
