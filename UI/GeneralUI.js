/**
 * UI manager for handling basic ui elements.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
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
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.GeneralUI = function ()
    {
    };
    
    /**
     * Bind button.
     *
     * @param {string} [id] Button id (optional)
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.GeneralUI.prototype.bind = function (id)
    {
        let e = null;
        if (typeof id !== 'undefined') {
            e = document.getElementById(id);
        } 
        
        this.bindHref(e);
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
    jsOMS.UI.GeneralUI.prototype.bindHref = function (e)
    {
        const e = e !== null ? e.querySelectorAll('[data-href]') : document.querySelectorAll('[data-href]'),
            length = e.length;

        for(let i = 0; i < length; i++) {
            e[i].addEventListener('click', function(event) {
                jsOMS.preventAll(event);
                window.location = jsOMS.Uri.UriFactory.build(this.getAttribute('data-href'));
            });
        }
    };
}(window.jsOMS = window.jsOMS || {}));