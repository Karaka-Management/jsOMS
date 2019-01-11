/**
 * Tab manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Component');

    jsOMS.UI.Component.Tab = class {
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
         * @since  1.0.0
         */
        bind (id)
        {
            if (typeof id !== 'undefined') {
                const e = document.getElementById(id);

                if (e) {
                    this.bindElement(e);
                }
            } else {
                const tabs = document.querySelectorAll('.tabview'),
                length = !tabs ? 0 : tabs.length;

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
         * @since  1.0.0
         */
        bindElement (e)
        {
            this.activateTabUri(e);

            const nodes = e.querySelectorAll('.tab-links li'),
                length = nodes.length;

            for (let i = 0; i < length; ++i) {
                nodes[i].addEventListener('click', function (evt)
                {
                    let fragmentString = window.location.href.includes('#') ? jsOMS.Uri.Http.parseUrl(window.location.href).fragment : '';

                    /* Change Tab */
                    /* Remove selected tab */
                    fragmentString = jsOMS.ltrim(fragmentString.replace(this.parentNode.getElementsByClassName('active')[0].getElementsByTagName('label')[0].getAttribute('for'), ''), ',');
                    jsOMS.removeClass(this.parentNode.getElementsByClassName('active')[0], 'active');
                    jsOMS.addClass(this, 'active');

                    /* Add selected tab */
                    window.history.pushState(null,'',
                        jsOMS.Uri.UriFactory.build(
                            '{%}#' + (fragmentString === '' ? '' : fragmentString + ',') + this.getElementsByTagName('label')[0].getAttribute('for')
                        )
                    );
                });
            }
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
         * @since  1.0.0
         */
        activateTabUri(e)
        {
            const fragmentString = window.location.href.includes('#') ? jsOMS.Uri.Http.parseUrl(window.location.href).fragment : '';
            const fragments      = fragmentString.split(','),
                fragLength = fragments.length;

            for (let i = 0; i < fragLength; ++i) {
                let label = e.querySelectorAll('label[for="' + fragments[i] + '"]')[0];
                if (typeof label !== 'undefined') {
                    label.click();
                }
            }
        };
    }
}(window.jsOMS = window.jsOMS || {}));
