
import { UriFactory } from '../Uri/UriFactory.js';
import { AdvancedInput } from './Component/AdvancedInput.js';

/**
 * UI manager for handling basic ui elements.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class GeneralUI
{
    /**
     * @constructor
     *
     * @param {Object} app Application object
     *
     * @since 1.0.0
     */
    constructor (app)
    {
        this.visObs = null;
        this.app    = app;
    };

    /**
     * Bind button.
     *
     * @param {string} [id] Button id (optional)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (id)
    {
        let e = null;
        if (typeof id !== 'undefined' && id !== null) {
            e = document.getElementById(id);
        }

        this.bindHref(e);
        this.bindIframe(e);
        this.bindLazyLoad(e);
        this.bindInput(e);
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {Object} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindHref (e)
    {
        e            = e !== null ? e.querySelectorAll('[data-href], [href]') : document.querySelectorAll('[data-href], [href]');
        const length = e.length;

        for (let i = 0; i < length; ++i) {
            if (e[i].getAttribute('data-action') !== null) {
                continue;
            }

            e[i].addEventListener('mouseup', function(event) {
                if (event.button !== 0 && event.button !== 1) {
                    return;
                }

                jsOMS.preventAll(event);
                history.pushState(null, null, window.location);

                let uri = this.getAttribute('data-href');
                uri     = uri === null ? this.getAttribute('href') : uri;

                if (this.getAttribute('target') === '_blank' || this.getAttribute(['data-target']) === '_blank' || event.button === 1) {
                    window.open(UriFactory.build(uri), '_blank');
                } else {
                    window.location = UriFactory.build(uri);
                }
            });
        }
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {Object} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindIframe (e)
    {
        e            = e !== null ? e : document.getElementsByTagName('iframe');
        const length = e.length;

        for (let i = 0; i < length; ++i) {
            e[i].addEventListener('load', function() {
                this.height = this.contentWindow.document.body.scrollHeight + 25;
            });
        }
    }

    /**
     * Bind & rebind UI element.
     *
     * @param {Object} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindLazyLoad (e)
    {
        e            = e !== null ? e.querySelectorAll('[data-lazyload]') : document.querySelectorAll('[data-lazyload]');
        const length = e.length;

        /** global: IntersectionObserver */
        if (!this.visObs && window.IntersectionObserver) {
            this.visObs = new IntersectionObserver(function(eles, obs) {
                eles.forEach(ele => {
                    if (ele.intersectionRatio > 0) {
                        obs.unobserve(ele.target);
                        ele.target.src = ele.target.dataset.lazyload;
                        delete ele.target.dataset.lazyload;
                    }
                });
            });
        }

        for (let i = 0; i < length; ++i) {
            if (!this.visObs) {
                e[i].src = e[i].dataset.lazyload;
                delete e[i].dataset.lazyload;
            } else {
                this.visObs.observe(e[i]);
            }
        }
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {Object} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindInput (e)
    {
        e            = e !== null ? [e] : document.getElementsByClassName('advancedInput');
        const length = e.length;

        for (let i = 0; i < length; ++i) {
            new AdvancedInput(e[i], this.app.eventManager, this.app.uiManager.getDOMObserver());
        }
    };
};
