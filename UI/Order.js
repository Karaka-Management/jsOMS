/**
 * Manual order class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Order
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
        this.app = app;
    };

    /**
     * Bind element
     *
     * @param {Object} [element] DOM element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (element)
    {
        if (typeof element !== 'undefined') {
            this.bindElement(element);
        } else {
            const elements = document.querySelectorAll('.ordercontainer');
            const length   = !elements ? 0 : elements.length;

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
        if (!element) {
            return;
        }

        element.addEventListener('click', function (event) {
            if (!jsOMS.hasClass(event.target, 'order-up')
                && !jsOMS.hasClass(event.target, 'order-down')
            ) {
                return;
            }

            jsOMS.preventAll(event);

            const rowLength   = element.children.length;
            const thisElement = event.target.closest('.ordercontainer ' + this.children[rowLength - 1].tagName);

            const rowId     = Array.from(element.children).indexOf(thisElement);
            const orderType = jsOMS.hasClass(event.target, 'order-up') ? 1 : -1;

            if (orderType === 1 && rowId > 0) {
                element.insertBefore(element.children[rowId], element.children[rowId - 1]);
            } else if (orderType === -1 && rowId < rowLength) {
                element.insertBefore(element.children[rowId], element.children[rowId + 2]);
            }
        }, false);
    }
};
