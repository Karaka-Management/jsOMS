/**
 * Table manager class.
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
    
    jsOMS.Autoloader.defineNamespace('jsOMS.UI');
    
    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.TableManager = function (responseManager)
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
    jsOMS.UI.TableManager.prototype.bind = function (id)
    {
        if (typeof id !== 'undefined') {
            const e = document.getElementById(id);

            if(e) {
                this.bindElement(e);
            }
        } else {
            const tables = document.getElementsByTagName('table'),
                length = !tables ? 0 : tables.length;

            for (var i = 0; i < length; i++) {
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
    jsOMS.UI.TableManager.prototype.bindElement = function (e)
    {
        const rows = e.querySelectorAll('[data-href]'),
            length = rows.length;

        for(let i = 0; i < length; i++) {
            rows[i].addEventListener('click', function(event) {
                jsOMS.preventAll(event);
                window.location = jsOMS.Uri.UriFactory.build(this.getAttribute('data-href'));
            });
        }
    };
}(window.jsOMS = window.jsOMS || {}));
