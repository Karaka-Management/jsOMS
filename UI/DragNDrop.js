/**
 * Drag and drop class.
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

    /** @namespace jsOMS.UI.DragNDrop*/
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.DragNDrop');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.DragNDrop = function (app)
    {
        this.app    = app;
        this.draggable  = {};
    };

    /**
     * Unbind element
     *
     * @param {Object} element DOM element
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.DragNDrop.prototype.unbind = function (element)
    {
    };

    /**
     * Bind element
     *
     * @param {Object} id DOM element
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.DragNDrop.prototype.bind = function (id)
    {
         if (typeof id !== 'undefined') {
            this.bindElement(id);
        } else {
            const elements = document.querySelectorAll('[draggable]'),
                length = elements.length;

            for (var i = 0; i < length; i++) {
                if (typeof elements[i].getAttribute('id') !== 'undefined' && elements[i].getAttribute('id') !== null) {
                    this.bindElement(elements[i].getAttribute('id'));
                }
            }
        }
    };

    /**
     * Bind DOM elment
     *
     * @param {Object} id DOM elment
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UI.DragNDrop.prototype.bindElement = function (id)
    {
        const element = document.getElementById(id);
        console.log(id);

        element.addEventListener('dragstart', function(event) {
            // todo: 
            console.log('drag start');
        });

        element.addEventListener('dragenter', function(event) {
            // todo: highlight
            console.log('drag enter');
        });

        element.addEventListener('dragover', function(event) {
            // todo: highlight if not already highlight
            console.log('drag over');
        });

        element.addEventListener('dragleave', function(event) {
            // todo: don't highlight
            console.log('drag leave');
        });

        element.addEventListener('dragend', function(event) {
            // todo: reset all changes
            console.log('drag end');
        });

        //element.addEventListener('drag', function(event) {});
        element.addEventListener('drop', function(event) {
            // todo: add to now destination
            // todo: remove from old destination
            console.log('drag drop');
        });
    }

}(window.jsOMS = window.jsOMS || {}));