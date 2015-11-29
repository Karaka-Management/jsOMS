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

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UIManager = function (app)
    {
        this.app = app;
        this.formManager = new jsOMS.FormManager(this.app.responseManager);
        this.tabManager = new jsOMS.TabManager(this.app.responseManager);
        this.tableManager = new jsOMS.TableManager(this.app.responseManager);
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
    jsOMS.UIManager.prototype.bind = function (id)
    {
        if (typeof id === 'undefined') {
            this.formManager.bind();
            this.tabManager.bind();
            this.tableManager.bind();
        } else {
            var tag = document.getElementById(id);

            if (tag.tagName === 'form') {
                this.formManager.bind(id);
            } else if (tag.tagName === 'table') {
                this.tableManager.bind(id);
            } else if (tag.tagName === 'div') {
                // Todo: be more specific in order to handle tab
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
    jsOMS.UIManager.prototype.getFormManager = function ()
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
    jsOMS.UIManager.prototype.getTabManager = function ()
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
    jsOMS.UIManager.prototype.getTableManager = function ()
    {
        return this.tabManager;
    };
}(window.jsOMS = window.jsOMS || {}));
