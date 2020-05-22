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
                if (typeof elements[i].getAttribute('id') !== 'undefined' && elements[i].getAttribute('id') !== null) {
                    this.bindElement(elements[i].getAttribute('id'));
                }
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
    bindElement (id)
    {
        const element = document.getElementById(id),
            self      = this;

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
            /**
             * @todo Orange-Management/jsOMS#??? [t:feature] [p:low] [d:medium]
             *  Highlight the drop area
             */
        }, false);

        element.addEventListener('dragover', function(e) {
            e.preventDefault();

            e.dataTransfer.dropEffect = 'move';
        }, false);

        element.addEventListener('dragleave', function(e) {
            e.preventDefault();

            /**
             * @todo Orange-Management/jsOMS#??? [t:feature] [p:low] [d:medium]
             *  Stop highlighting the drop area
             */
        }, false);

        element.addEventListener('dragend', function(e) {
            e.preventDefault();

            /**
             * @todo Orange-Management/jsOMS#??? [t:feature] [p:low] [d:medium]
             *  Reset all UI states
             */
        }, false);

        element.addEventListener('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();

            if (self.dragging === this) {
                return;
            }

            self.dragging.innerHTML = this.innerHTML;
            this.innerHTML          = e.dataTransfer.getData('text/html');

            /**
             * @todo Orange-Management/jsOMS#??? [t:feature] [p:low] [d:medium]
             *  Remove from old destination if UI element and add to new destination
             */

            self.dragging = null;
        }, false);
    }
};