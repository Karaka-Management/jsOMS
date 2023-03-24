/**
 * UI state manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class UIStateManager
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
    bind (element = null)
    {
        if (element !== null) {
            this.bindElement(element);

            return;
        }

        const elements = document.querySelectorAll('.oms-ui-state');
        const length   = !elements ? 0 : elements.length;

        for (let i = 0; i < length; ++i) {
            this.bindElement(elements[i]);
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
        if (!element) {
            return;
        }

        let state = JSON.parse(window.localStorage.getItem('ui-state-' + element.id));
        state     = state !== null ? state : {};

        switch (element.tagName.toLowerCase()) {
            case 'input':
                if ((state === '1' && !element.checked)
                    || (state === '0' && element.checked)
                ) {
                    element.click();
                }

                element.addEventListener('change', function (event) {
                    if (this.getAttribute('type') === 'checkbox'
                        || this.getAttribute('type') === 'radio'
                    ) {
                        window.localStorage.setItem('ui-state-' + this.id, JSON.stringify(this.checked ? '1' : '0'));
                    } else {
                        window.localStorage.setItem('ui-state-' + this.id, JSON.stringify(this.value));
                    }
                });

                break;
            case 'div':
                // @todo: this is not working, WHY? state is correct, but element.scrollTop is just ignored?!
                element.scrollLeft = state.x;
                element.scrollTop  = state.y;

                element.scrollTo({ top: state.y, left: state.x });

                element.addEventListener('scroll', function () {
                    window.localStorage.setItem('ui-state-' + this.id, JSON.stringify({ x: this.scrollLeft, y: this.scrollTop }));
                });

                break;
            default:
                break;
        }
    };
};
