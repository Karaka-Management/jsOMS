import { HttpUri } from '../../Uri/HttpUri.js';
import { UriFactory } from '../../Uri/UriFactory.js';

/**
 * Tab manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Tab
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor (app)
    {
        this.app = app;
    };

    /**
     * Bind & rebind UI elements.
     *
     * @param {string} [id] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (id)
    {
        if (typeof id !== 'undefined') {
            const e = document.getElementById(id);

            if (e) {
                this.bindElement(e);
            }
        } else {
            const tabs   = document.getElementsByClassName('tabview');
            const length = !tabs ? 0 : tabs.length;

            for (let i = 0; i < length; ++i) {
                this.bindElement(tabs[i]);
            }
        }
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {Object} e Element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindElement (e)
    {
        const nodes = e.querySelectorAll('.tab-links li'),
            length  = nodes.length;

        for (let i = 0; i < length; ++i) {
            nodes[i].addEventListener('click', function (evt)
            {
                let fragmentString = window.location.href.includes('#') ? HttpUri.parseUrl(window.location.href).fragment : '';

                /* Change Tab */
                /* Remove selected tab */
                const oldActive = this.parentNode.getElementsByClassName('active');
                if (oldActive.length > 0) {
                    let fragments = fragmentString.split(',');
                    const index   = fragments.indexOf(oldActive[0].getElementsByTagName('label')[0].getAttribute('for'));

                    if (index > -1) {
                        fragments.splice(index, 1);
                    }

                    // find old active and remove it
                    fragmentString = fragments.join(',');

                    jsOMS.removeClass(oldActive[0], 'active');
                }

                let fragments = fragmentString.split(',');
                const index   = fragments.indexOf(this.getElementsByTagName('label')[0].getAttribute('for'));

                if (index > -1) {
                    fragments.splice(index, 1);
                }

                // find old active and remove it
                fragmentString = fragments.join(',');

                jsOMS.addClass(this, 'active');

                /* Add selected tab */
                window.history.replaceState(null, '',
                    UriFactory.build(
                        '{%}#' + (fragmentString === '' ? '' : fragmentString + ',') + this.getElementsByTagName('label')[0].getAttribute('for')
                    )
                );
            });
        }

        this.activateTabUri(e);
    };

    /**
     * Activates the correct tab based on URI fragment.
     *
     * This allows to link a specific open tab to a user or make it a bookmark
     *
     * @param {Object} e Element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    activateTabUri(e)
    {
        const fragmentString = window.location.href.includes('#') ? HttpUri.parseUrl(window.location.href).fragment : '';
        const fragments      = fragmentString.split(','),
            fragLength       = fragments.length;

        if (fragLength > 0 && fragmentString !== '') {
            for (let i = 0; i < fragLength; ++i) {
                let label = e.querySelectorAll('label[for="' + fragments[i] + '"]')[0];
                if (typeof label !== 'undefined') {
                    label.click();
                }
            }
        }

        if (e.getElementsByClassName('active').length < 1) {
            e.querySelector('label').click();
        }
    };
};
