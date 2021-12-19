/**
 * Drag and drop class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
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
     * Unbind element
     *
     * @param {Object} element DOM element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    unbind (element)
    {
    };

    /**
     * Bind element
     *
     * @param {Object} [id] DOM element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (id)
    {
        if (typeof id !== 'undefined') {
            this.bindElement(id);
        } else {
            const elements = document.querySelectorAll('[draggable]'),
                length     = !elements ? 0 : elements.length;

            for (let i = 0; i < length; ++i) {
                    this.bindElement(elements[i]);
            }
        }
    };

    /**
     * Bind DOM element
     *
     * @param {string} id DOM element
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

        element.addEventListener('dragstart', function(e) {
            if (self.dragging === null) {
                self.dragging                = this;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            }
        }, false);

        element.addEventListener('dragenter', function(e) {
            const rowIndex = Array.from(this.parentElement.children).indexOf(this);
            const dragIndex = Array.from(self.dragging.parentElement.children).indexOf(self.dragging);

            const oldPlaceholder = this.parentNode.querySelector('.drag-placeholder');
            if (oldPlaceholder !== null) {
                this.parentNode.removeChild(oldPlaceholder);
            }

            const placeholder = document.createElement(self.dragging.tagName);

            if (self.dragging.tagName.toLowerCase() === 'tr') {
                const placeholderTd = document.createElement('td');
                placeholderTd.setAttribute('colspan', 42);
                placeholder.appendChild(placeholderTd);
            }

            placeholder.setAttribute('draggable', 'true');

            jsOMS.addClass(placeholder, 'drag-placeholder');

            if (dragIndex < rowIndex) {
                this.parentNode.insertBefore(placeholder, this.nextSibling);
            } else {
                this.parentNode.insertBefore(placeholder, this);
            }
        }, false);

        element.addEventListener('dragover', function(e) {
            e.preventDefault();

            e.dataTransfer.dropEffect = 'move';
        }, false);

        element.addEventListener('dragleave', function(e) {
            e.preventDefault();
        }, false);

        element.addEventListener('dragend', function(e) {
            e.preventDefault();

            const oldPlaceholder = this.parentNode.querySelector('.drag-placeholder');
            if (oldPlaceholder === null) {
                return;
            }

            this.parentNode.insertBefore(self.dragging, oldPlaceholder);
            this.parentNode.removeChild(oldPlaceholder);

            self.dragging = null;
        }, false);

        element.addEventListener('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }
};