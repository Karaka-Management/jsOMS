import { Logger }              from '../../Log/Logger.js';
import { NotificationLevel }   from '../../Message/Notification/NotificationLevel.js';
import { NotificationMessage } from '../../Message/Notification/NotificationMessage.js';
import { NotificationType }    from '../../Message/Notification/NotificationType.js';
import { Request }             from '../../Message/Request/Request.js';
import { RequestMethod }       from '../../Message/Request/RequestMethod.js';
import { RequestType }         from '../../Message/Request/RequestType.js';
import { Response }            from '../../Message/Response/Response.js';
import { FormView }            from '../../Views/FormView.js';
import { GeneralUI }           from '../GeneralUI.js';
import { UriFactory }          from '../../Uri/UriFactory.js';

/**
 * Form manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Form
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

        /** @type {FormView[]} forms */
        this.forms = {};

        /** @type {Object} ignore Forms to ignore */
        this.ignore = {};
    };

    /**
     * Get form
     *
     * @param {string} id Form Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    get (id)
    {
        if (!Object.prototype.hasOwnProperty.call(this.forms, id)) {
            this.bind(id);
        }

        return this.forms[id];
    };

    hasChanges ()
    {
        const length = this.forms.length;

        for (let i = 0; i < length; ++i) {
            if (this.forms[i].hasChange()) {
                return true;
            }
        }

        return false;
    };

    /**
     * Is form ignored?
     *
     * @param {string} id Form Id
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    isIgnored (id)
    {
        return this.ignore.indexOf(id) !== -1;
    };

    /**
     * Bind form
     *
     * @param {string} id Form Id (optional, if omitted all forms are searched and bound)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (id = null)
    {
        if (id !== null && typeof this.ignore[id] === 'undefined') {
            this.bindForm(id);

            return;
        }

        const forms  = document.querySelectorAll('form, [data-tag=form]');
        const length = !forms ? 0 : forms.length;

        for (let i = 0; i < length; ++i) {
            const formId = forms[i].getAttribute('id');

            if (typeof formId !== 'undefined' && formId !== null && typeof this.ignore[formId] === 'undefined') {
                this.bindForm(formId);
            } else {
                Logger.instance.info('A form doesn\'t have an ID.');
            }
        }
    };

    /**
     * Bind form
     *
     * @param {null|string} id Form Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindForm (id = null)
    {
        if (id === null) {
            Logger.instance.info('A form doesn\'t have an ID.');
            return;
        }

        // don't overwrite existing bind
        /*
        @todo: removed because sometimes it is already bound but bound in a wrong way (e.g. no success is defined)
        if (Object.prototype.hasOwnProperty.call(this.forms, id)) {
            return;
        } */

        this.forms[id] = new FormView(id);
        const self     = this;
        let length     = 0;

        // bind form clicks
        const toBind       = this.forms[id].getElementsToBind();
        const toBindLength = toBind.length;

        for (let i = 0; i < toBindLength; ++i) {
            toBind[i].addEventListener('click', function (event) {
                self.formActions(self, event, id);
            });

            if (!this.forms[id].isOnChange()) {
                toBind[i].addEventListener('change', function (evnt) {
                    if (window.omsApp.state) {
                        window.omsApp.state.hasChanges = true;
                    }
                });
            }
        }

        const imgPreviews = this.forms[id].getImagePreviews();
        length            = imgPreviews === null ? 0 : imgPreviews.length;
        for (let i = 0; i < length; ++i) {
            this.bindImagePreview(imgPreviews[i], id);
        }

        // if true submit form on change
        if (this.forms[id].isOnChange()) {
            const hasUiContainer    = this.forms[id].getFormElement().getAttribute('data-ui-container');
            const onChangeContainer = hasUiContainer !== null
                ? this.forms[id].getFormElement().querySelector(hasUiContainer)
                : this.forms[id].getFormElement();

            onChangeContainer.addEventListener('change', function (event)
            {
                jsOMS.preventAll(event);
                if (window.omsApp.state) {
                    window.omsApp.state.hasChanges = true;
                }

                const target = event.target.tagName.toLowerCase();

                if (target === 'input' || target === 'textarea') {
                    let dataParent = null;
                    if (self.forms[id].getFormElement().tagName.toLowerCase() === 'table') {
                        dataParent = event.srcElement.closest(self.forms[id].getFormElement().getAttribute('data-ui-element'));
                    }

                    self.submit(self.forms[id], null, dataParent);
                }
            });
        }
    };

    formActions (self, event, id) {
        let elementIndex = 0;

        if ((elementIndex = Array.from(self.forms[id].getRemove()).indexOf(event.target)) !== -1) {
            // handle remove

            const remove   = self.forms[id].getRemove()[elementIndex];
            const callback = function () {
                /**
                 * @var {Element} elementContainer Container which holds all the data for a specific element
                 *                                 (e.g. table row (tr), div, ...)
                 */
                const elementContainer = remove.closest(document.getElementById(id).getAttribute('data-ui-element'));
                window.omsApp.logger.log(document.getElementById(id).getAttribute('data-ui-element'));
                elementContainer.parentNode.removeChild(elementContainer);
            };

            /** @var {Element} formElement Form element */
            const formElement = self.forms[id].getFormElement();

            // Perform the element deletion.
            // If the form has a remote endpoint this is called in advance
            if (formElement !== null
                && ((formElement.tagName.toLowerCase() !== 'form' && formElement.getAttribute('data-method') !== null)
                    || (formElement.tagName.toLowerCase() === 'form' && formElement.getAttribute('method') !== 'NONE'))
            ) {
                const deleteRequest = new Request(
                    formElement.hasAttribute('data-method-delete')
                        ? formElement.getAttribute('data-method-delete')
                        : (formElement.tagName.toLowerCase() !== 'form'
                            ? formElement.getAttribute('data-method')
                            : formElement.getAttribute('method')
                        ),
                    RequestMethod.DELETE
                );
                deleteRequest.setSuccess(callback);
                deleteRequest.send();
            } else {
                callback();
            }
        } else if ((elementIndex = Array.from(self.forms[id].getAdd()).indexOf(event.target)) !== -1) {
            // handle add

            if (!self.forms[id].isValid()) {
                return;
            }

            if (document.getElementById(id).getAttribute('data-add-form') === null) {
                // handle inline add
                // Since the add is inline no form exists which the user can use, hence it must be created

                /** @var {HTMLElement} formElement */
                const formElement = self.forms[id].getFormElement();

                /** @var {string} uiContainerName Container which holds all elements (e.g. div, tbody) */
                const uiContainerName = formElement.getAttribute('data-ui-container');

                /** @var {HTMLElement} uiContainer Container which holds all elements (e.g. div, tbody) */
                const uiContainer = uiContainerName.charAt(0) === '#'
                    ? document.querySelector(uiContainerName)
                    : formElement.querySelector(uiContainerName);

                if (formElement.getAttribute('data-update-tpl')) {
                    /** @var {HTMLElement} newElement New element to add  */
                    const newElement = uiContainer.querySelector(formElement.getAttribute('data-update-tpl')).content.cloneNode(true);
                    uiContainer.appendChild(newElement.firstElementChild);
                } else {
                    /** @var {HTMLElement} newElement New element to add  */
                    const newElement = uiContainer.querySelector(formElement.getAttribute('data-add-tpl')).content.cloneNode(true);
                    uiContainer.appendChild(newElement.firstElementChild);
                }
            } else {
                // handle external add

                /** @var {HTMLElement} formElement External form */
                const formElement = self.forms[id].getFormElement();

                /** @var {string} uiContainerName Container which holds all elements (e.g. div, tbody) */
                const uiContainerName = formElement.getAttribute('data-ui-container');

                /** @var {HTMLElement} uiContainer Container which holds all elements (e.g. div, tbody) */
                const uiContainer = uiContainerName.charAt(0) === '#'
                    ? document.querySelector(uiContainerName)
                    : formElement.querySelector(uiContainerName);

                /** @var {string[]} addTpl Templates to add to container (usually only one) */
                const addTpl       = formElement.getAttribute('data-add-tpl').split(',');
                const addTplLength = addTpl.length;

                /** @var {string[]} values Values to add (values can be different from the displayed text) */
                let values = [];

                /** @var {string[]} texts Text to add (values can be different from the displayed text) */
                let texts = [];

                /**
                 * @var {Element[]} newElements Array of added elements
                 *                              (this is actually only one element/model/object but sometimes one
                 *                              element might be split up into multiple templates)
                 */
                const newElements = [];

                // iterate over all add templates and find the elements
                for (let i = 0; i < addTplLength; ++i) {
                    // add template to elements which should be added to the DOM
                    newElements.push(document.querySelector(addTpl[i]).content.cloneNode(true));

                    /** @var {string} tplValue Where does the value come from for this template input element */
                    const tplValue = newElements[i].querySelector('[data-tpl-value]').getAttribute('data-tpl-value');

                    /** @var {Element} dataOriginElement Element where the value data comes from  */
                    const dataOriginElement = tplValue.startsWith('http') || tplValue.startsWith('{')
                        ? newElements[i].firstElementChild // data comes from remote source
                        : formElement; // data comes from the form (even if the api returns something after adding).
                                        // What if remote returns a DB id? how do we add it?
                                        // is this a @todo ? probably yes.
                                        // maybe first use local data and then if remote data available replace local data?

                    values = values.concat(
                            dataOriginElement.hasAttribute('data-tpl-value')
                                ? dataOriginElement
                                : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-value]'))
                        );
                    texts  = texts.concat(
                            dataOriginElement.hasAttribute('data-tpl-text')
                                ? dataOriginElement
                                : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-text]'))
                        );

                    // set random id for element
                    Form.setRandomIdForElement(newElements[i].firstElementChild);
                }

                /** @var {object} remoteUrls Texts and values which come from remote sources */
                const remoteUrls = {};

                // insert values into form (populate values)
                Form.setDataInElement('value', newElements, values, remoteUrls);

                // insert text data into form (populate text)
                Form.setDataInElement('text', newElements, texts, remoteUrls);

                // add new elements to the DOM
                for (let i = 0; i < addTplLength; ++i) {
                    uiContainer.appendChild(newElements[i].firstElementChild);
                }

                // define remote response behavior
                self.forms[id].setSuccess(function (response) {
                    if (response.get('status') !== 'undefined' && response.get('status') !== NotificationLevel.HIDDEN) {
                        self.app.notifyManager.send(
                            new NotificationMessage(response.get('status'), response.get('title'), response.get('message')), NotificationType.APP_NOTIFICATION
                        );
                    }

                    window.omsApp.logger.log(remoteUrls);

                    UriFactory.setQuery('$id', response.get('response').id);

                    // fill elements with remote data after submit (if the template expects data from a remote source)
                    // this is usually the case for element ids, which can only be generated by the backend
                    Form.setDataFromRemoteUrls(remoteUrls);
                });

                // reset the form after adding an element
                self.forms[id].resetValues();
            }
        } else if ((elementIndex = Array.from(self.forms[id].getSave()).indexOf(event.target)) !== -1) {
            // handle save button

            const mainForm = document.querySelector('[data-update-form="' + id  + '"');
            if (mainForm === null) {
                // handle inline save

                if (!self.forms[id].isValid()) {
                    return;
                }

                /** @var {HTMLElement} formElement */
                const formElement = self.forms[id].getFormElement();

                /** @var {string} uiContainerName Container which holds all elements (e.g. div, tbody) */
                const uiContainerName = formElement.getAttribute('data-ui-container');

                /** @var {HTMLElement} uiContainer Container which holds all elements (e.g. div, tbody) */
                const uiContainer = uiContainerName.charAt(0) === '#'
                    ? document.querySelector(uiContainerName)
                    : formElement.querySelector(uiContainerName);

                /**
                 * @var {string[]} updateElementNames Names/selectors of the containers which hold the data of a single element
                 *                                    (this is not the container which holds all elements. Most of the time this is just a single element (e.g. tr))
                 */
                const updateElementNames  = formElement.getAttribute('data-ui-element').split(',');
                const updateElementLength = updateElementNames.length;

                /**
                 * @var {Element[]} updateElements Array of update elements
                 *                                 (this is actually only one element/model/object but sometimes one
                 *                                 element might be split up into multiple containers)
                 */
                const updateElements = [];

                /** @var {Element} elementContainer Element container that holds the data that should get updated */
                const elementContainer = event.target.closest(formElement.getAttribute('data-ui-element'));

                /** @var {string[]} values New values */
                let values = [];

                /** @var {string[]} texts New texts */
                let texts = [];

                if (elementContainer.getAttribute('data-id') === null
                    || elementContainer.getAttribute('data-id') === ''
                ) {
                    // is save from add

                    /** @var {string[]} addTpl Templates to add to container (usually only one) */
                    const addTpl       = formElement.getAttribute('data-add-tpl').split(',');
                    const addTplLength = addTpl.length;

                    /**
                     * @var {Element[]} newElements Array of added elements
                     *                              (this is actually only one element/model/object but sometimes one
                     *                              element might be split up into multiple templates)
                     */
                    const newElements = [];

                    // iterate over all add templates and find the elements
                    for (let i = 0; i < addTplLength; ++i) {
                        // add template to elements which should be added to the DOM
                        newElements.push(document.querySelector(addTpl[i]).content.cloneNode(true));

                        /** @var {string} tplValue Where does the value come from for this template input element */
                        const tplValue = newElements[i].querySelector('[data-tpl-value]').getAttribute('data-tpl-value');

                        /** @var {Element} dataOriginElement Element where the value data comes from  */
                        const dataOriginElement = tplValue.startsWith('http') || tplValue.startsWith('{')
                            ? newElements[i].firstElementChild // data comes from remote source
                            : elementContainer; // data comes from the form (even if the api returns something after adding).
                                                // What if remote returns a DB id? how do we add it?
                                                // is this a @todo ? probably yes.
                                                // maybe first use local data and then if remote data available replace local data?

                        values = values.concat(
                                dataOriginElement.hasAttribute('data-tpl-value')
                                    ? dataOriginElement
                                    : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-value]'))
                            );
                        texts  = texts.concat(
                                dataOriginElement.hasAttribute('data-tpl-text')
                                    ? dataOriginElement
                                    : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-text]'))
                            );

                        // set random id for element
                        Form.setRandomIdForElement(newElements[i].firstElementChild);
                    }

                    /** @var {object} remoteUrls Texts and values which come from remote sources */
                    const remoteUrls = {};

                    // insert values into form (populate values)
                    Form.setDataInElement('value', newElements, values, remoteUrls);

                    // insert text data into form (populate text)
                    Form.setDataInElement('text', newElements, texts, remoteUrls);

                    // add new elements to the DOM
                    for (let i = 0; i < addTplLength; ++i) {
                        uiContainer.appendChild(newElements[i].firstElementChild);
                    }

                    elementContainer.parentNode.removeChild(elementContainer);

                    // define remote response behavior
                    self.forms[id].setSuccess(function (response) {
                        if (response.get('status') !== 'undefined' && response.get('status') !== NotificationLevel.HIDDEN) {
                            self.app.notifyManager.send(
                                new NotificationMessage(response.get('status'), response.get('title'), response.get('message')), NotificationType.APP_NOTIFICATION
                            );
                        }

                        window.omsApp.logger.log(remoteUrls);

                        UriFactory.setQuery('$id', response.get('response').id);

                        // fill elements with remote data after submit (if the template expects data from a remote source)
                        // this is usually the case for element ids, which can only be generated by the backend
                        Form.setDataFromRemoteUrls(remoteUrls);
                    });
                } else {
                    // is save from update

                    // iterate all element containers (very often only one element container) and find the elements
                    for (let i = 0; i < updateElementLength; ++i) {
                        updateElementNames[i] = updateElementNames[i].trim();

                        // get the elment to update
                        // @todo: maybe stupid, because same as elementContainer. however this is more general? anyway, one can be replaced
                        updateElements.push(
                            formElement.querySelector(updateElementNames[i] + '[data-id="' + elementContainer.getAttribute('data-id') + '"]')
                        );

                        /** @var {string} updateValue Where does the value come from for this template input element */
                        const updateValue = updateElements[i].querySelector('[data-tpl-value]').getAttribute('data-tpl-value');

                        /** @var {Element} dataOriginElement Element where the value data comes from  */
                        const dataOriginElement = updateValue.startsWith('http') || updateValue.startsWith('{')
                            ? updateElements[i].firstElementChild // data comes from remote source
                            : elementContainer; // data comes from the form (even if the api returns something after adding).
                                                // What if remote returns a DB id? how do we add it?
                                                // is this a @todo ? probably yes.
                                                // maybe first use local data and then if remote data available replace local data?

                        values = values.concat(
                            dataOriginElement.hasAttribute('data-tpl-value')
                                ? dataOriginElement
                                : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-value]'))
                            );
                        texts  = texts.concat(
                                dataOriginElement.hasAttribute('data-tpl-text')
                                    ? dataOriginElement
                                    : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-text]'))
                            );
                    }
                    /** @var {Element} elementContainer Original element */
                    const element = uiContainer.querySelector('.hidden[data-id="' + elementContainer.getAttribute('data-id') + '"]');

                    /** @var {object} remoteUrls Texts and values which come from remote sources */
                    const remoteUrls = {};

                    // update values in form (overwrite values)
                    Form.setDataInElement('value', [element], values, remoteUrls);

                    // update text data in form (overwrite text)
                    Form.setDataInElement('text', [element], texts, remoteUrls);

                    jsOMS.removeClass(element, 'hidden');

                    elementContainer.parentNode.removeChild(elementContainer);

                    // todo bind failure here, if failure do cancel, if success to remove edit template
                    self.forms[id].setSuccess(function () {
                        // overwrite old values from remote response
                        Form.setDataFromRemoteUrls(remoteUrls);
                    });
                }
            } else {
                // handle external save

                const externalFormId = id;
                id                   = mainForm.getAttribute('id');

                if (!self.forms[id].isValid()) {
                    return;
                }

                /** @var {HTMLElement} formElement */
                const formElement = self.forms[id].getFormElement();

                /** @var {HTMLElement} externalFormElement External form element */
                const externalFormElement = self.forms[externalFormId].getFormElement();

                /**
                 * @var {string[]} updateElementNames Names/selectors of the containers which hold the data of a single element
                 *                                    (this is not the container which holds all elements. Most of the time this is just a single element (e.g. tr))
                 */
                const updateElementNames  = formElement.getAttribute('data-ui-element').split(',');
                const updateElementLength = updateElementNames.length;

                /**
                 * @var {Element[]} updateElements Array of update elements
                 *                                 (this is actually only one element/model/object but sometimes one
                 *                                 element might be split up into multiple containers)
                 */
                const updateElements = [];

                /** @var {string[]} values New values */
                let values = [];

                /** @var {string[]} texts New texts */
                let texts = [];

                // iterate all element containers (very often only one element container) and find the elements
                for (let i = 0; i < updateElementLength; ++i) {
                    updateElementNames[i] = updateElementNames[i].trim();

                    // get the elment to update
                    updateElements.push(
                        formElement.querySelector(updateElementNames[i] + '[data-id="' + externalFormElement.getAttribute('data-id') + '"]')
                    );

                    /** @var {string} updateValue Where does the value come from for this template input element */
                    const updateValue = updateElements[i].querySelector('[data-tpl-value]').getAttribute('data-tpl-value');

                    /** @var {Element} dataOriginElement Element where the value data comes from  */
                    const dataOriginElement = updateValue.startsWith('http') || updateValue.startsWith('{')
                        ? updateElements[i].firstElementChild // data comes from remote source
                        : externalFormElement; // data comes from the form (even if the api returns something after adding).
                                                // What if remote returns a DB id? how do we add it?
                                                // is this a @todo ? probably yes.
                                                // maybe first use local data and then if remote data available replace local data?

                    values = values.concat(
                        dataOriginElement.hasAttribute('data-tpl-value')
                            ? dataOriginElement
                            : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-value]'))
                        );
                    texts  = texts.concat(
                            dataOriginElement.hasAttribute('data-tpl-text')
                                ? dataOriginElement
                                : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-text]'))
                        );
                }

                /** @var {object} remoteUrls Texts and values which come from remote sources */
                const remoteUrls = {};

                // update values in form (overwrite values)
                Form.setDataInElement('value', updateElements, values, remoteUrls);

                // update text data in form (overwrite text)
                Form.setDataInElement('text', updateElements, texts, remoteUrls);

                // todo bind failure here, if failure do cancel, if success to remove edit template
                self.forms[externalFormId].setSuccess(function () {
                    // overwrite old values from remote response
                    Form.setDataFromRemoteUrls(remoteUrls);
                });

                // clear element id after saving
                externalFormElement.setAttribute('data-id', '');

                // reset form values to default values after performing the update
                self.forms[externalFormId].resetValues();

                // show add button + hide update button + hide cancel button
                const addButtons = self.forms[externalFormId].getAdd();
                let buttonLength = addButtons.length;

                for (let i = 0; i < buttonLength; ++i) {
                    jsOMS.removeClass(addButtons[i], 'hidden');
                }

                const saveButtons = self.forms[externalFormId].getSave();
                buttonLength      = saveButtons.length;
                for (let i = 0; i < buttonLength; ++i) {
                    jsOMS.addClass(saveButtons[i], 'hidden');
                }

                const cancelButtons = self.forms[externalFormId].getCancel();
                buttonLength        = cancelButtons.length;
                for (let i = 0; i < buttonLength; ++i) {
                    jsOMS.addClass(cancelButtons[i], 'hidden');
                }
            }
        } else if ((elementIndex = Array.from(self.forms[id].getCancel()).indexOf(event.target)) !== -1) {
            // handle cancel
            // @todo currently only handling update cancel, what about add cancel?

            const ele = document.getElementById(id);
            if (ele.getAttribute('data-update-form') === null && ele.tagName.toLowerCase() !== 'form') {
                // handle inline cancel

                 /** @var {HTMLElement} formElement Form */
                 const formElement = self.forms[id].getFormElement();

                 /** @var {string} uiContainerName Container which holds all elements (e.g. div, tbody) */
                 const uiContainerName = formElement.getAttribute('data-ui-container');

                 /** @var {HTMLElement} uiContainer Container which holds all elements (e.g. div, tbody) */
                const uiContainer = uiContainerName.charAt(0) === '#'
                    ? document.querySelector(uiContainerName)
                    : formElement.querySelector(uiContainerName);

                 /** @var {Element} elementContainer Element container that holds the data that should get updated */
                 const elementContainer = event.target.closest(formElement.getAttribute('data-ui-element'));

                 /** @var {Element} elementContainer Original element */
                const element = uiContainer.querySelector('.hidden[data-id="' + elementContainer.getAttribute('data-id') + '"]');

                jsOMS.removeClass(element, 'hidden');

                elementContainer.parentNode.removeChild(elementContainer);
            } else {
                // handle external cancel

                // reset form values to default values
                self.forms[id].resetValues();

                // reset element id
                self.forms[id].getFormElement().setAttribute('data-id', '');

                let length = 0;

                // show add button + hide update button + hide cancel button
                const addButtons = self.forms[id].getAdd();
                length           = addButtons.length;
                for (let i = 0; i < length; ++i) {
                    jsOMS.removeClass(addButtons[i], 'hidden');
                }

                const saveButtons = self.forms[id].getSave();
                length            = saveButtons.length;
                for (let i = 0; i < length; ++i) {
                    jsOMS.addClass(saveButtons[i], 'hidden');
                }

                const cancelButtons = self.forms[id].getCancel();
                length              = cancelButtons.length;
                for (let i = 0; i < length; ++i) {
                    jsOMS.addClass(cancelButtons[i], 'hidden');
                }

                jsOMS.preventAll(event);
            }
        } else if ((elementIndex = Array.from(self.forms[id].getUpdate()).indexOf(event.target)) !== -1) {
            // handle update
            // this doesn't handle setting new values but populating the update form

            if (document.getElementById(id).getAttribute('data-update-form') === null) {
                // handle inline update

                /** @var {HTMLElement} formElement Form */
                const formElement = self.forms[id].getFormElement();

                /** @var {string} uiContainerName Container which holds all elements (e.g. div, tbody) */
                const uiContainerName = formElement.getAttribute('data-ui-container');

                /** @var {Element} elementContainer Element container that holds the data that should get updated */
                const elementContainer = event.target.closest(formElement.getAttribute('data-ui-element'));
                jsOMS.addClass(elementContainer, 'hidden');

                /** @var {NodeListOf<Element>} values Value elements of the element to update */
                const values = elementContainer.querySelectorAll('[data-tpl-value]');

                /** @var {NodeListOf<Element>} texts Text elements of the element to update */
                const texts = elementContainer.querySelectorAll('[data-tpl-text]');

                /** @var {HTMLElement} uiContainer Container which holds all elements (e.g. div, tbody) */
                const uiContainer = uiContainerName.charAt(0) === '#'
                    ? document.querySelector(uiContainerName)
                    : formElement.querySelector(uiContainerName);

                /** @var {string[]} addTpl Templates to add to container (usually only one) */
                const addTpl       = formElement.getAttribute('data-update-tpl').split(',');
                const addTplLength = addTpl.length;

                /**
                 * @var {Element[]} newElements Array of added elements
                 *                              (this is actually only one element/model/object but sometimes one
                 *                              element might be split up into multiple templates)
                 */
                const newElements = [];

                // iterate over all add templates and find the elements
                for (let i = 0; i < addTplLength; ++i) {
                    // add template to elements which should be added to the DOM
                    newElements.push(document.querySelector(addTpl[i]).content.cloneNode(true));

                    // set random id for element
                    newElements[i].firstElementChild.setAttribute('data-id', elementContainer.getAttribute('data-id'));
                }

                /** @var {object} remoteUrls Texts and values which come from remote sources */
                const remoteUrls = {};

                // insert values into form (populate values)
                Form.setDataInElement('value', newElements, values, remoteUrls);

                // insert text data into form (populate text)
                Form.setDataInElement('text', newElements, texts, remoteUrls);

                // add new elements to the DOM
                for (let i = 0; i < addTplLength; ++i) {
                    uiContainer.insertBefore(newElements[i].firstElementChild, elementContainer);
                }

                const saveButtons = self.forms[id].getSave();
                let buttonLength  = saveButtons.length;
                for (let i = 0; i < buttonLength; ++i) {
                    jsOMS.removeClass(saveButtons[i], 'hidden');
                }

                const cancelButtons = self.forms[id].getCancel();
                buttonLength        = cancelButtons.length;
                for (let i = 0; i < buttonLength; ++i) {
                    jsOMS.removeClass(cancelButtons[i], 'hidden');
                }
            } else {
                // handle external update

                /** @var {HTMLElement} formElement */
                const formElement = self.forms[id].getFormElement();

                /** @var {Element} elementContainer Element container that holds the data that should get updated */
                const elementContainer = event.target.closest(formElement.getAttribute('data-ui-element'));

                /** @var {string} externalFormId Id of the form where the data should get populated to (= external form) */
                const externalFormId = formElement.getAttribute('data-update-form');

                /** @var {NodeListOf<Element>} values Value elements of the element to update */
                const values = elementContainer.querySelectorAll('[data-tpl-value]');

                /** @var {NodeListOf<Element>} texts Text elements of the element to update */
                const texts = elementContainer.querySelectorAll('[data-tpl-text]');

                let length = 0;

                // clear form values to prevent old values getting mixed with update values
                self.forms[externalFormId].resetValues();

                // set the element id in the update form so we know which element is getting updated
                self.forms[externalFormId].getFormElement().setAttribute('data-id', elementContainer.getAttribute('data-id'));

                // hide add button + show update button + show cancel button
                const addButtons = self.forms[externalFormId].getAdd();
                length           = addButtons.length;
                for (let i = 0; i < length; ++i) {
                    jsOMS.addClass(addButtons[i], 'hidden');
                }

                const saveButtons = self.forms[externalFormId].getSave();
                length            = saveButtons.length;
                for (let i = 0; i < length; ++i) {
                    jsOMS.removeClass(saveButtons[i], 'hidden');
                }

                const cancelButtons = self.forms[externalFormId].getCancel();
                length              = cancelButtons.length;
                for (let i = 0; i < length; ++i) {
                    jsOMS.removeClass(cancelButtons[i], 'hidden');
                }

                /** @var {object} remoteUrls Texts and values which come from remote sources */
                const remoteUrls = {};

                // insert values into form (populate values)
                Form.insertDataIntoForm(self, 'value', externalFormId, values, remoteUrls);

                // insert text data into form (populate text)
                Form.insertDataIntoForm(self, 'text', externalFormId, texts, remoteUrls);

                // define remote response behavior
                self.forms[externalFormId].setSuccess(function (response) {
                    if (response.get('status') !== 'undefined'
                        && response.get('status') !== NotificationLevel.HIDDEN
                    ) {
                        self.app.notifyManager.send(
                            new NotificationMessage(response.get('status'), response.get('title'), response.get('message')), NotificationType.APP_NOTIFICATION
                        );
                    }

                    window.omsApp.logger.log(remoteUrls);

                    UriFactory.setQuery('$id', response.get('response').id);

                    // fill elements with remote data after submit (if the template expects data from a remote source)
                    Form.setDataFromRemoteUrls(remoteUrls);
                });
            }
        } else if ((elementIndex = Array.from(self.forms[id].getSubmit()).indexOf(event.target)) !== -1
            || (elementIndex = Array.from(self.forms[id].getSubmit()).indexOf(event.target.parentNode)) !== -1
        ) {
            jsOMS.preventAll(event);
            self.submit(self.forms[id], self.forms[id].getSubmit()[elementIndex]);
        } else if (false) { // eslint-disable-line no-constant-condition
            // @todo: if table head input field in popups changes -> check if input empty -> deactivate -> checkbox : else activate checkbox
            // careful: the same checkbox is used for showing the filter popup. maybe create a separate checkbox, which only handles the highlighting if filter is defined.
            // this means popup active highlights filter icon AND different content checkbox also highlights filter
            // -> two hiddin checkboxes are necessary (one is already implemented)
            // Consider: It might make sense to do this in the Table.js??? Kinda depends on additional functionality together with the form probably.
        }

        // remote actions (maybe solvable with callbacks?):
        // filter
        // sort
        // reorder
        // remove
        // add
        // save
        // update
        // dragndrop
    }

    /**
    * Create the new input
    *
    * @param {string} imageUpload Create form
    * @param {Object} id         Id
    *
    * @return {void}
    *
    * @since  1.0.0
    */
    bindImagePreview (imageUpload, id) {
        imageUpload.addEventListener('change', function () {
            const preview = document.querySelector('#preview-' + imageUpload.getAttribute('name'));

            preview.src    = window.URL.createObjectURL(imageUpload.files[0]);
            preview.onload = function () {
                window.URL.revokeObjectURL(this.src);
            };
        });
    };

    /**
     * Submit form
     *
     * Calls injections first before executing the actual form submit
     *
     * @param {FormView} form   Form object
     * @param {Element}  button Action different from the form action (e.g. formaction=*)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submit (form, button = null, container = null)
    {
        /* Handle injects */
        const self    = this;
        const injects = form.getSubmitInjects();
        let counter   = 0;

        let action = null;

        if (button !== null) {
            action = button.getAttribute('formaction');
        }

        // Register normal form behavior
        if (!this.app.eventManager.isAttached(form.getId())) {
            this.app.eventManager.attach(form.getId(), function ()
            {
                self.submitForm(form, action, container);
            }, true);
        }

        // Run all injects first
        for (const property in injects) {
            if (Object.prototype.hasOwnProperty.call(injects, property)) {
                ++counter;
                // this.app.eventManager.addGroup(form.getId(), counter);
                const result = injects[property](form, form.getId());

                if (result === false) {
                    return;
                }
            } else {
                Logger.instance.warning('Invalid property.');
            }
        }

        if (counter < 1) {
            this.app.eventManager.trigger(form.getId());
        }

        // select first input element (this allows fast consecutive data input)
        const firstFormInputElement = form.getFirstInputElement();

        if (firstFormInputElement !== null) {
            firstFormInputElement.focus();
        }
    };

    /**
     * Submit form data
     *
     * Submits the main form data
     *
     * @param {FormView} form     Form object
     * @param {string}   [action] Action different from the form action (e.g. formaction=*)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submitForm (form, action = null, container = null)
    {
        const data = form.getData(container);

        if (!form.isValid(data)) {
            this.app.notifyManager.send(
                new NotificationMessage(
                    NotificationLevel.INFO,
                    jsOMS.lang.Info,
                    jsOMS.lang.invalid_form
                ), NotificationType.APP_NOTIFICATION
            );

            Logger.instance.debug('Form "' + form.getId() + '" has invalid values.');
            return;
        }

        if (form.getMethod() !== RequestMethod.GET
            && Math.abs(Date.now() - form.getLastSubmit()) < 500
        ) {
            return;
        }

        form.updateLastSubmit();

        /* Handle default submit */
        const request = new Request();
        const self    = this;

        request.setData(data);
        request.setType(RequestType.FORM_DATA); // @todo: consider to allow different request type
        request.setUri(action !== null ? action : form.getAction());
        request.setMethod(form.getMethod());
        request.setSuccess(function (xhr)
        {
            window.omsApp.logger.log(xhr.response);

            if (xhr.getResponseHeader('content-type').includes('application/octet-stream')) {
                const blob = new Blob([xhr.response], { type: 'application/octet-stream' });
                const doc  = document.createElement('a');
                doc.style  = 'display: none';
                document.body.appendChild(doc);

                const url = window.URL.createObjectURL(blob);
                doc.href  = url;

                const disposition = xhr.getResponseHeader('content-disposition');
                let filename      = '';
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches       = filenameRegex.exec(disposition);

                    if (matches !== null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                doc.download = filename;
                doc.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(doc);
            } else if (xhr.getResponseHeader('content-type').includes('text/html')) {
                // window.location = UriFactory.build(uri);

                document.documentElement.innerHTML = xhr.response;
                /* This is not working as it reloads the page ?!
                document.open();
                document.write(html);
                document.close();
                */

                window.omsApp.reInit(); // @todo: fix memory leak which most likely exists because of continous binding without removing binds
            } else {
                try {
                    const o           = JSON.parse(xhr.response)[0];
                    const response    = new Response(o);
                    let successInject = null;

                    if ((successInject = form.getSuccess()) !== null) {
                        successInject(response);
                    } else if (typeof response.get('type') !== 'undefined') {
                        self.app.responseManager.run(response.get('type'), response.get(), null);
                    } else if (typeof o.status !== 'undefined' && o.status !== NotificationLevel.HIDDEN) {
                        self.app.notifyManager.send(
                            new NotificationMessage(o.status, o.title, o.message), NotificationType.APP_NOTIFICATION
                        );
                    }
                } catch (e) {
                    Logger.instance.log(e);

                    Logger.instance.error('Invalid form response. \n'
                        + 'URL: ' + form.getAction() + '\n'
                        + 'Request: ' + JSON.stringify(form.getData()) + '\n'
                        + 'Response: ' + xhr.response
                    );
                }
            }
        });

        request.setResultCallback(0, function (xhr)
        {
            self.app.notifyManager.send(
                new NotificationMessage(
                    NotificationLevel.ERROR,
                    'Failure',
                    'Some failure happened'
                ), NotificationType.APP_NOTIFICATION
            );
        });

        if (window.omsApp.state) {
            window.omsApp.state.hasChanges = false;
        }

        request.send();

        if (form.getFinally() !== null) {
            form.getFinally()();
        }
    };

    /**
     * Count the bound forms
     *
     * @return {int}
     *
     * @since 1.0.0
     */
    count ()
    {
        return this.forms.length;
    };

    static setDataFromRemoteUrls (remoteUrls)
    {
        for (const e in remoteUrls) {
            const request = new Request(e);
            request.setResultCallback(200, function (xhr) {
                /**
                 * @todo Karaka/jsOMS#84
                 *  Remote data responses need to be parsed
                 *  The data coming from the backend/api usually is not directly usable in the frontend.
                 *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                 */
                const remoteUrlsLength = remoteUrls[e].length;
                for (let k = 0; k < remoteUrlsLength; ++k) {
                    const path = remoteUrls[e][k].path;

                    if (remoteUrls[e][k].type === 'value') {
                        GeneralUI.setValueOfElement(remoteUrls[e][k].element,
                            path !== null ? jsOMS.getArray(path, JSON.parse(xhr.response)) : xhr.response
                        );
                    } else {
                        GeneralUI.setTextOfElement(remoteUrls[e][k].element,
                            path !== null ? jsOMS.getArray(path, JSON.parse(xhr.response)) : xhr.response
                        );
                    }
                }
            });

            request.send();
        }
    };

    /**
     * Set random data-id of a element
     *
     * @param {HTMLElement} element Element to set the data-id for
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static setRandomIdForElement (element)
    {
        if (element.getAttribute('data-id') !== null && element.getAttribute('data-id') !== '') {
            return;
        }

        let eleId = '';

        do {
            eleId = 'r-' + Math.random().toString(36).substring(7);
        } while (document.querySelector('[data-id="' + eleId + '"]') !== null);

        element.setAttribute('data-id', eleId);

        return eleId;
    };

    static setDataInElement (type, elements, data, remoteUrls = {})
    {
        const changedNodes   = []; // prevent same node touching
        const length         = data.length;
        const elementsLength = elements.length;

        for (let i = 0; i < length; ++i) {
            // data path if data comes from remote object
            const path = data[i].hasAttribute('data-tpl-' + type + '-path')
                ? data[i].getAttribute('data-tpl-' + type + '-path')
                : null;

            for (let j = 0; j < elementsLength; ++j) {
                // sometimes elements contains templates, they need to get handled differently
                const element = elements[j] instanceof DocumentFragment
                    ? elements[j].firstElementChild // is template -> need first element
                    : elements[j]; // is element

                const matches = element.hasAttribute('data-tpl-' + type)
                        && element.getAttribute('data-tpl-' + type) === data[i].getAttribute('data-tpl-' + type)
                    ? [element]
                    : element.querySelectorAll(
                        '[data-tpl-' + type + '="' + data[i].getAttribute('data-tpl-' + type) + '"'
                    );

                const matchLength = matches.length;
                for (let c = 0; c < matchLength; ++c) {
                    // ensure correct element.
                    // if this doesn't exist the matches from above contains alle elements with the same uri/path but eventually different tpl-paths
                    if (changedNodes.includes(matches[c])
                        || (path !== null && path !== matches[c].getAttribute('data-tpl-' + type + '-path'))
                    ) {
                        continue;
                    }

                    changedNodes.push(matches[c]);

                    if (data[i].getAttribute('data-tpl-' + type).startsWith('http')
                        || data[i].getAttribute('data-tpl-' + type).startsWith('{')
                    ) {
                        Form.populateRemoteUrls(matches[c], type, data[i], path, remoteUrls);
                    } else {
                        if (type === 'value') {
                            GeneralUI.setValueOfElement(matches[c], GeneralUI.getValueFromDataSource(data[i]));
                        } else {
                            GeneralUI.setTextOfElement(matches[c], GeneralUI.getTextFromDataSource(data[i]));
                        }
                    }
                }
            }
        }
    };

    static insertDataIntoForm (self, type, formId, data, remoteUrls = {})
    {
        const length = data.length;
        for (let i = 0; i < length; ++i) {
            const matches = self.forms[formId].getFormElement().querySelectorAll('[data-tpl-' + type + '="' + data[i].getAttribute('data-tpl-' + type) + '"');
            const path    = data[i].hasAttribute('data-tpl-' + type + '-path')
                ? data[i].getAttribute('data-tpl-' + type + '-path')
                : null;

            const matchLength = matches.length;
            for (let c = 0; c < matchLength; ++c) {
                if (data[i].getAttribute('data-tpl-' + type).startsWith('http')
                    || data[i].getAttribute('data-tpl-' + type).startsWith('{')
                ) {
                    Form.populateRemoteUrls(matches[c], type, data[i], path, remoteUrls);
                } else {
                    if (type === 'value') {
                        GeneralUI.setValueOfElement(matches[c], GeneralUI.getValueFromDataSource(data[i]));
                    } else {
                        GeneralUI.setTextOfElement(matches[c], GeneralUI.getTextFromDataSource(data[i]));
                    }
                }
            }
        }
    };

    static populateRemoteUrls (ele, type, data, path, remoteUrls)
    {
        const uri = data.getAttribute('data-tpl-' + type).startsWith('/')
            ? document.getElementsByTagName('base')[0].href
            : '';

        if (remoteUrls[uri + data.getAttribute('data-tpl-' + type)] === undefined) {
            remoteUrls[uri + data.getAttribute('data-tpl-' + type)] = [];
        }

        remoteUrls[uri + data.getAttribute('data-tpl-' + type)].push({
            path: path,
            element: ele,
            type: type
        });
    };
};
