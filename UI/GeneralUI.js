
import { UriFactory }    from '../Uri/UriFactory.js';
import { AdvancedInput } from './Component/AdvancedInput.js';
import { NotificationLevel }   from '../Message/Notification/NotificationLevel.js';
import { NotificationMessage } from '../Message/Notification/NotificationMessage.js';
import { NotificationType }    from '../Message/Notification/NotificationType.js';


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
        /** @type {null|IntersectionObserver} visObs */
        this.visObs = null;

        this.app = app;
    };

    /**
     * Bind button.
     *
     * @param {null|string} [id] Button id (optional)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (id = null)
    {
        let e = null;
        if (id !== null) {
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
     * @param {null|Element} [e] Element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindHref (e = null)
    {
        e = e !== null
            ? e.querySelectorAll('[data-href], [href]')
            : document.querySelectorAll('[data-href], [href]');

        const length = e.length;

        for (let i = 0; i < length; ++i) {
            /*
            @todo: bad solution, probably needs to be more navigation specific
            const link = UriFactory.buildAbsolute(
                e[i].getAttribute('href') !== null ? e[i].getAttribute('href') : e[i].getAttribute('data-href')
            );

            if (jsOMS.rtrim(link, '/') !== window.location.origin && window.location.href.startsWith(link)) {
                jsOMS.addClass(e[i], 'active');
            }
            */

            if (e[i].getAttribute('data-action') !== null) {
                continue;
            }

            // @todo: implement middle mouse click
            e[i].addEventListener('click', function (event) {
                if ((event.target.parentElement !== this
                        && event.target.parentElement.getElementsByTagName('input').length > 0)
                    || (event.target.getElementsByTagName('input').length > 0)
                ) {
                    const input = event.target.querySelector('input');

                    if (input !== null) {
                        input.click();
                        return;
                    }
                }

                jsOMS.preventAll(event);

                let uri = this.getAttribute('data-href');
                uri     = uri === null ? this.getAttribute('href') : uri;

                if (this.getAttribute('target') === '_blank'
                    || this.getAttribute(['data-target']) === '_blank'
                    || event.button === 1
                ) {
                    window.open(UriFactory.build(uri), '_blank');
                } else {
                    // window.location = UriFactory.build(uri);
                    fetch(UriFactory.build(uri))
                    .then((response) => response.text())
                    .then((html) => {
                        if (window.omsApp.state.hasChanges) {
                            let message = new NotificationMessage(NotificationLevel.WARNING, 'Unsaved changes', 'Do you want to continue?', true, true);
                            message.primaryButton = {
                                text: 'Yes',
                                style: 'ok',
                                callback: function () {
                                    document.documentElement.innerHTML = html;
                                    window.omsApp.state.hasChanges = false;
                                    this.parentNode.remove();
                                    history.pushState({}, null, UriFactory.build(uri));
                                    /* This is not working as it reloads the page ?!
                                    document.open();
                                    document.write(html);
                                    document.close();
                                    */
                                    // @todo: fix memory leak which most likely exists because of continous binding without removing binds
                                    window.omsApp.reInit();
                                },
                            };
                            message.secondaryButton = {
                                text: 'No',
                                style: 'error',
                                callback: function () {
                                    this.parentNode.remove();
                                },
                            };

                            window.omsApp.notifyManager.send(message, NotificationType.APP_NOTIFICATION);
                        } else {
                            document.documentElement.innerHTML = html;
                            window.omsApp.state.hasChanges = false;
                            this.parentNode.remove();
                            history.pushState({}, null, UriFactory.build(uri));
                            /* This is not working as it reloads the page ?!
                            document.open();
                            document.write(html);
                            document.close();
                            */
                            // @todo: fix memory leak which most likely exists because of continous binding without removing binds
                            window.omsApp.reInit();
                        }
                    })
                    .catch((error) => {
                        console.warn(error);
                    });
                }
            });
        }
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {null|Element} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindIframe (e = null)
    {
        e = e !== null
            ? e
            : document.getElementsByTagName('iframe');

        const length = e.length;

        for (let i = 0; i < length; ++i) {
            if (e[i].contentWindow.document.body !== null) {
                e[i].height = e[i].contentWindow.document.body.scrollHeight + 25;
            }

            e[i].addEventListener('load', function () {
                this.height = this.contentWindow.document.body.scrollHeight + 25;
            });
        }
    };

    /**
     * Bind & rebind UI element.
     *
     * @param {null|Element} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindLazyLoad (e = null)
    {
        e = e !== null
            ? e.querySelectorAll('[data-lazyload]')
            : document.querySelectorAll('[data-lazyload]');

        const length = e.length;

        /** global: IntersectionObserver */
        if (!this.visObs && window.IntersectionObserver) {
            this.visObs = new IntersectionObserver(function (eles, obs) {
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
     * @param {null|Element} [e] Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindInput (e = null)
    {
        e = e !== null
            ? [e]
            : document.getElementsByClassName('advancedInput');

        const length = e.length;

        for (let i = 0; i < length; ++i) {
            new AdvancedInput(e[i], this.app.eventManager, this.app.uiManager.getDOMObserver()); // eslint-disable-line no-new
        }
    };

    /**
     * Set the value for an elment
     *
     * @param {Element} src   Element to change the value for
     * @param {any}     value Value to set
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static setValueOfElement (src, value)
    {
        if (src.hasAttribute('data-value')) {
            src.setAttribute('data-value', value);
        }

        switch (src.tagName.toLowerCase()) {
            case 'div':
            case 'span':
            case 'pre':
            case 'article':
            case 'section':
            case 'h1':
                if (src.hasAttribute('data-tpl-text')) {
                    break; // prevent overwriting setTextOfElement
                }

                src.innerHTML = jsOMS.htmlspecialchars_encode(value);
                break;
            case 'select': {
                const optionLength = src.options.length;
                for (let i = 0; i < optionLength; ++i) {
                    if (src.options[i].value === value) {
                        src.options[i].selected = true;

                        break;
                    }
                }

                break;
            }
            case 'input':
                if (src.type === 'radio') {
                    src.checked = false;
                    if (src.value === value) {
                        src.checked = true;
                    }
                } else if (src.type === 'checkbox') {
                    src.checked  = false;
                    const values = value.split(',');
                    if (values.includes(src.value)) {
                        src.checked = true;
                    }
                }

                break;
            default:
                src.value = jsOMS.htmlspecialchars_decode(value);
        }
    };

    /**
     * Set the text for an elment
     *
     * @param {Element} src   Element to change the text for
     * @param {string}  value Text to set
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static setTextOfElement (src, value)
    {
        switch (src.tagName.toLowerCase()) {
            case 'select':
                break;
            case 'div':
            case 'td':
            case 'span':
            case 'pre':
            case 'article':
            case 'section':
                src.innerHTML = value;
                break;
            case 'h1':
                src.innerHTML = jsOMS.htmlspecialchars_encode(value);
                break;
            default:
                if (src.value === '') {
                    src.value = jsOMS.htmlspecialchars_decode(value);
                }
        }
    };

    /**
     * Get value from element
     *
     * @param {Element} src Element to get the value from
     *
     * @return {any}
     *
     * @since 1.0.0
     */
    static getValueFromDataSource (src)
    {
        if (src.getAttribute('data-value') !== null) {
            return src.getAttribute('data-value');
        }

        switch (src.tagName.toLowerCase()) {
            case 'td':
            case 'div':
            case 'span':
            case 'pre':
            case 'article':
            case 'section':
            case 'h1':
                return src.innerText.trim(' ');
            default:
                if (src.getAttribute('type') === 'radio') {
                    const checked = document.querySelector('input[type=radio][name="' + src.name + '"]:checked');

                    if (checked === null) {
                        return '';
                    }

                    src = checked;
                } else if (src.getAttribute('type') === 'checkbox') {
                    if (!src.checked) {
                        return '';
                    }
                }

                return src.value;
        }
    };

    /**
     * Get text from element
     *
     * @param {Element} src Element to get the text from
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static getTextFromDataSource (src)
    {
        switch (src.tagName.toLowerCase()) {
            case 'td':
            case 'div':
            case 'span':
            case 'pre':
            case 'article':
            case 'section':
            case 'h1':
                return src.innerHTML.trim(' ');
            case 'select':
                return src.options[src.selectedIndex].text;
            case 'input':
                if (src.getAttribute('type') === 'radio') {
                    const checked = document.querySelector('input[type=radio][name="' + src.name + '"]:checked');

                    if (checked === null) {
                        return '';
                    }

                    return document.querySelector('label[for="' + checked.id + '"]').innerText.trim(' ');
                } else if (src.getAttribute('type') === 'checkbox') {
                    if (!src.checked) {
                        return '';
                    }

                    return document.querySelector('label[for="' + src.id + '"]').innerText.trim(' ');
                }

                return src.value;
            default:
                return src.value;
        }
    };
};
