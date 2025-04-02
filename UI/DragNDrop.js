import { jsOMS } from '../Utils/oLib.js';
/**
 * Drag and drop class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export class DragNDrop
{
    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     */
    constructor (app)
    {
        this.app       = app;
        this.draggable = {};
        this.dragging  = null;
    };

    /**
     * Bind element
     *
     * @param {null|Element} element DOM element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (element = null)
    {
        if (element !== null) {
            this.bindElement(element);
        } else {
            const elements = document.querySelectorAll('.oms-dragcontainer');
            const length   = !elements ? 0 : elements.length;

            for (let i = 0; i < length; ++i) {
                this.bindElement(elements[i]);
            }
        }
    };

    /**
     * Bind DOM element
     *
     * @param {Element} element DOM element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindElement (element)
    {
        const self = this;

        if (!element) {
            return;
        }

        element.addEventListener('dragstart', function (e) {
            if (self.dragging === null) {
                self.dragging                = e.target;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
            }
        }, false);

        element.addEventListener('dragenter', function (e) {
            const thisElement = e.target.closest('.oms-dragcontainer ' + this.children[this.children.length - 1].tagName);

            const rowIndex  = Array.from(this.children).indexOf(thisElement);
            const dragIndex = Array.from(self.dragging.children).indexOf(self.dragging);

            const oldPlaceholder = this.querySelector('.oms-drag-placeholder');
            if (oldPlaceholder !== null) {
                this.removeChild(oldPlaceholder);
            }

            const placeholder = document.createElement(self.dragging.tagName);

            if (self.dragging.tagName.toLowerCase() === 'tr') {
                const placeholderTd = document.createElement('td');
                placeholderTd.setAttribute('colspan', 42);
                placeholder.appendChild(placeholderTd);
            }

            placeholder.setAttribute('draggable', 'true');

            jsOMS.addClass(placeholder, 'oms-drag-placeholder');

            if (dragIndex < rowIndex) {
                this.insertBefore(placeholder, thisElement.nextSibling);
            } else {
                this.insertBefore(placeholder, thisElement);
            }
        }, false);

        element.addEventListener('dragover', function (e) {
            e.preventDefault();

            e.dataTransfer.dropEffect = 'move';
        }, false);

        element.addEventListener('dragleave', function (e) {
            e.preventDefault();
        }, false);

        element.addEventListener('dragend', function (e) {
            e.preventDefault();

            const oldPlaceholder = this.querySelector('.oms-drag-placeholder');
            if (oldPlaceholder === null) {
                return;
            }

            this.insertBefore(self.dragging, oldPlaceholder);
            this.removeChild(oldPlaceholder);

            self.dragging = null;
        }, false);

        element.addEventListener('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }
};
