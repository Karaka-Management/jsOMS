/**
 * Table manager class.
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
    jsOMS.TableManager = function (responseManager)
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
    jsOMS.TableManager.prototype.bind = function (id)
    {
        if (typeof id !== 'undefined') {
            this.bindElement(document.getElementById(id));
        } else {
            var tables = document.querySelectorAll('.tables');

            for (var i = 0; i < tabs.length; i++) {
                this.bindElement(tables[i]);
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
    jsOMS.TableManager.prototype.bindElement = function (e)
    {
    };
}(window.jsOMS = window.jsOMS || {}));
