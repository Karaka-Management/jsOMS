/**
 * Tab manager class.
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
    jsOMS.TabManager = function (responseManager)
    {
        this.responseManager = responseManager;
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
    jsOMS.TabManager.prototype.bind = function (id)
    {
        if (typeof id !== 'undefined') {
            this.bindElement(document.getElementById(id));
        } else {
            var tabs = document.querySelectorAll('.tabview');

            for (var i = 0; i < tabs.length; i++) {
                this.bindElement(tabs[i]);
            }
        }
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {Object} [e] Element id
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.TabManager.prototype.bindElement = function (e)
    {
        var nodes = e.querySelectorAll('.tab-links a');

        nodes.addEventListener('click', function (evt)
        {
            /* Change Tab */
            var attr = this.getAttribute('href').substring(1),
                cont = this.parentNode.parentNode.parentNode.children[1];

            jsOMS.removeClass(jsOMS.getByClass(this.parentNode.parentNode, 'active'), 'active');
            jsOMS.addClass(this.parentNode, 'active');
            jsOMS.removeClass(jsOMS.getByClass(cont, 'active'), 'active');
            jsOMS.addClass(jsOMS.getByClass(cont, attr), 'active');

            /* Modify url */

            jsOMS.preventAll(evt);
        });
    };
}(window.jsOMS = window.jsOMS || {}));
