import { Logger } from '../../Log/Logger.js';
import { NotificationLevel } from '../../Message/Notification/NotificationLevel.js';
import { NotificationMessage } from '../../Message/Notification/NotificationMessage.js';
import { NotificationType } from '../../Message/Notification/NotificationType.js';
import { Request } from '../../Message/Request/Request.js';
import { RequestMethod } from '../../Message/Request/RequestMethod.js';
import { RequestType } from '../../Message/Request/RequestType.js';
import { Response } from '../../Message/Response/Response.js';
import { FormView } from '../../Views/FormView.js';

/**
 * Form manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 *
 * data-ui-content = what is the main parent
 * data-ui-element = what are the elements to replace
 *
 * @todo Orange-Management/jsOMS#60
 *  On change listener
 *  Allow to add a on change listener in a form. This should result in automatic submits after changing a form.
 *  Consider the following cases to submit the form:
 *      * on Enter (all except textarea)
 *      * on Change (by using a timer)
 *      * on Leave (all elements)
 *  The listener should be defined in the form definition once and in js be applied to all form elements.
 *
 * @todo Orange-Management/Modules#177
 *  Hotkey for saving forms for creation/edit
 *  Instead of using the mouse to click save the user should be able to use a hotkey to save/create/update the current form.
 *  The hotkey on PC should be alt+enter or alt+shift+enter or alt+s
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
        this.app    = app;
        this.forms  = {};
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
        if (!this.forms.hasOwnProperty(id)) {
            this.bind(id);
        }

        return this.forms[id];
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
     * Unbind form
     *
     * @param {string} id Form Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    unbind (id)
    {

    };

    /**
     * Bind form
     *
     * @param {string} id Form Id (optional)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind (id)
    {
        if (typeof id !== 'undefined' && typeof this.ignore[id] === 'undefined') {
            this.bindForm(id);
        } else {
            const forms = document.querySelectorAll('form, [data-tag=form]'),
                length  = !forms ? 0 : forms.length;

            for (let i = 0; i < length; ++i) {
                let formId = forms[i].getAttribute('id');
                if (typeof formId !== 'undefined' && formId !== null && typeof this.ignore[formId] === 'undefined') {
                    this.bindForm(formId);
                }
            }
        }
    };

    /**
     * Bind form
     *
     * @param {string} id Form Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindForm (id)
    {
        if (typeof id === 'undefined' || !id) {
            Logger.instance.info('A form doesn\'t have an ID.');
            return;
        }

        // don't overwrite bind
        if (this.forms.hasOwnProperty(id)) {
            return;
        }

        const self     = this;
        this.forms[id] = new FormView(id);
        let length     = 0;

        const submits      = this.forms[id].getSubmit()
        const submitLength = submits.length;

        this.unbind(id);

        const removable = this.forms[id].getRemove();
        length          = removable === null ? 0 : removable.length;
        for (let i = 0; i < length; ++i) {
            this.bindRemovable(removable[i], id);
        }

        const addable = this.forms[id].getAdd();
        length        = addable === null ? 0 : addable.length;
        for (let i = 0; i < length; ++i) {
            this.bindAddInline(addable[i], id);
        }

        const save = this.forms[id].getSave();
        length     = save === null ? 0 : save.length;
        for (let i = 0; i < length; ++i) {
            this.bindSaveInline(save[i], id);
        }

        if (document.getElementById(id).getAttribute('data-ui-form') !== null) {
            this.bindAddExternal(id);
        }

        const cancel = this.forms[id].getCancel();
        length       = cancel === null ? 0 : cancel.length;
        for (let i = 0; i < length; ++i) {
            this.bindCancelInline(cancel[i], id);
        }

        const update = this.forms[id].getUpdate();
        length       = update === null ? 0 : update.length;
        for (let i = 0; i < length; ++i) {
            this.bindUpdatable(update[i], id);
        }

        const imgPreviews = this.forms[id].getImagePreviews();
        length            = imgPreviews === null ? 0 : imgPreviews.length;
        for (let i = 0; i < length; ++i) {
            this.bindImagePreview(imgPreviews[i], id);
        }

        for (let i = 0; i < submitLength; ++i) {
            submits[i].addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);
                self.submit(self.forms[id], submits[i].getAttribute('formaction'));
            });
        }
    };

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
    bindImagePreview(imageUpload, id) {
        const self = this;

        imageUpload.addEventListener('change', function () {
            const formElement = document.getElementById(id);
            const preview     = formElement.querySelector('img#preview-' + imageUpload.getAttribute('name'));

            preview.src    = window.URL.createObjectURL(imageUpload.files[0]);
            preview.onload = function () {
                window.URL.revokeObjectURL(this.src);
            }
        });
    }

    /**
     * Unbind form
     *
     * @param {string} id Form Id
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    unbindForm (id)
    {
        if ((findex = this.forms[id]) !== 'undefined') {
            this.forms[id].unbind();
            this.forms.splice(id, 1);

            return true;
        }

        return false;
    };

    /**
     * Submit form
     *
     * Calls injections first before executing the actual form submit
     *
     * @param {Object} form   Form object
     * @param {string} [action] Action different from the form action (e.g. formaction=*)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submit (form, action = null)
    {
        action = typeof action !== 'undefined' ? action : null;

        /* Handle injects */
        const self  = this,
            injects = form.getSubmitInjects();
        let counter = 0;

        // Register normal form behavior
        if (!this.app.eventManager.isAttached(form.getId())) {
            this.app.eventManager.attach(form.getId(), function ()
            {
                self.submitForm(form, action);
            }, true);
        }

        // Run all injects first
        for (const property in injects) {
            if (injects.hasOwnProperty(property)) {
                ++counter;
                //this.app.eventManager.addGroup(form.getId(), counter);
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
    };

    /**
     * Submit form data
     *
     * Submits the main form data
     *
     * @param {Object} form   Form object
     * @param {string} [action] Action different from the form action (e.g. formaction=*)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submitForm (form, action = null)
    {
        action = typeof action !== 'undefined' ? action : null;

        if (!form.isValid()) {
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
        const request = new Request(),
            self      = this;

        request.setData(form.getData());
        request.setType(RequestType.FORM_DATA);
        request.setUri(action ? action : form.getAction());
        request.setMethod(form.getMethod());
        request.setSuccess(function (xhr)
        {
            console.log(xhr.response);

            try {
                const o           = JSON.parse(xhr.response)[0],
                    response      = new Response(o);
                let successInject = null;

                if ((successInject = form.getSuccess()) !== null) {
                    successInject(response);
                } else if (typeof response.get('type') !== 'undefined') {
                    self.app.responseManager.run(response.get('type'), response.get(), request);
                } else if (typeof o.status !== 'undefined' && o.status !== NotificationLevel.HIDDEN) {
                    self.app.notifyManager.send(
                        new NotificationMessage(o.status, o.title, o.message), NotificationType.APP_NOTIFICATION
                    );
                }
            } catch (e) {
                console.log(e);

                Logger.instance.error('Invalid form response. \n'
                    + 'URL: ' + form.getAction() + '\n'
                    + 'Request: ' + JSON.stringify(form.getData()) + '\n'
                    + 'Response: ' + xhr.response
                );
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

    /**
     * Create the ui element
     *
     * @param {string} createForm Create form
     * @param {Object} id         Form id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindAddExternal(id)
    {
        const createForm = document.getElementById(id).getAttribute('data-ui-form');

        /**
         * @todo Orange-Management/jsOMS#75
         *  Currently only one add button is allowed per form. Allow multiple/different add buttons in a form.
         */
        this.app.uiManager.getFormManager().get(createForm).injectSubmit(function () {
            const formElement = document.getElementById(id);
            const subMain     = formElement.getAttribute('data-ui-content').charAt(0) === '#'
                ? document.querySelector(formElement.getAttribute('data-ui-content'))
                : formElement.querySelector(formElement.getAttribute('data-ui-content'));

            /**
             * @todo Orange-Management/jsOMS#76
             *  In the beginning there was a fixed amount of templates required (even if some were not used) for adding new dom elements to a lest, table etc.
             *  This no longer works especially for inline editing
             *  ```js
             *  const newEle = subMain.getElementsByTagName('template')[0].content.cloneNode(true);
             *  ```
             */
            const newEle = subMain.getElementsByTagName('template')[0].content.cloneNode(true);

            // set internal value
            let fields      = newEle.querySelectorAll('[data-tpl-value]');
            let fieldLength = fields.length;
            let uuid        = '';
            let value       = '';

            for (let j = 0; j < fieldLength; ++j) {
                /**
                 * @todo Orange-Management/jsOMS#77
                 *  We need to check what kind of tag the selector above returns in order to get the correct value.
                 *  Currently this only makes sense for input elements but for selection, checkboxes etc.
                 *  This doesn't make sense there we need .innerHTML or [data-text=]
                 */
                value = document.querySelectorAll(
                        '#' + createForm + ' [data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"], [data-form="' + createForm + '"][data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"]'
                    )[0].getAttribute('data-value');

                fields[j].setAttribute('data-value', value);

                uuid += value;
            }

            // don't allow duplicate
            if (subMain.querySelectorAll('[data-tpl-uuid="' + uuid + '"').length !== 0) {
                return;
            }

            newEle.firstElementChild.setAttribute('data-tpl-uuid', uuid);

            // set readable text
            fields      = newEle.querySelectorAll('[data-tpl-text]');
            fieldLength = fields.length;

            for (let j = 0; j < fieldLength; ++j) {
                /**
                 * @todo Orange-Management/jsOMS#77
                 *  We need to check what kind of tag the selector above returns in order to get the correct value.
                 *  Currently this only makes sense for input elements but for selection, checkboxes etc.
                 *  This doesn't make sense there we need .innerHTML or [data-text=]
                 */
                fields[j].appendChild(
                    document.createTextNode(
                        document.querySelectorAll(
                            '#' + createForm + ' [data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"], [data-form="' + createForm + '"][data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"]'
                        )[0].value
                    )
                );
            }

            subMain.appendChild(newEle);

            /**
             * @todo Orange-Management/jsOMS#80
             *  Consider to do UI action as success inject after a backend response.
             *  This will prevent bugs where the backand couldn't complete a action but the user sees it in the frontend.
             *  This should be probably optional optional because sometimes there will be no calls to the backend.
             *
             * @todo Orange-Management/jsOMS#78
             *  After adding a new element some require a binding for removal
             *
             * @todo Orange-Management/jsOMS#79
             *  After adding a new element some require a binding for editing
             *
             * @todo Orange-Management/jsOMS#81
             *  A template can contain elements which must/should have an id (e.g. a form).
             *  If this element gets added to the DOM the id should be changed to a unique id because it could be added multiple times to the DOM.
             *  In order to bind these elements (e.g. forms) they must have a unique id.
             *  Maybe check all elements for ids and add a random part e.g. `-random_string`
             */

            return true;
        });
    };

    /**
     * Create the new input
     *
     * @param {string} createForm Create form
     * @param {Object} id         Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindAddInline(createForm, id)
    {
        const self = this;

        createForm.addEventListener('click', function () {
            const formElement = document.getElementById(id);
            const subMain     = formElement.getAttribute('data-ui-content').charAt(0) === '#'
                ? document.querySelector(formElement.getAttribute('data-ui-content'))
                : formElement.querySelector(formElement.getAttribute('data-ui-content'));

            /**
             * @todo Orange-Management/jsOMS#76
             *  In the beginning there was a fixed amount of templates required (even if some were not used) for adding new dom elements to a lest, table etc.
             *  This no longer works especially for inline editing
             *  ```js
             *  const newEle = subMain.getElementsByTagName('template')[0].content.cloneNode(true);
             *  ```
             */
            const newEle = subMain.getElementsByTagName('template')[1].content.cloneNode(true);
            let eleId    = '';

            do {
                eleId = 'f' + Math.random().toString(36).substring(7);
            } while (document.getElementById(eleId) !== null);

            newEle.firstElementChild.id                                 = eleId;
            newEle.firstElementChild.getElementsByTagName('form')[0].id = eleId + '-form';

            const fields = newEle.firstElementChild.querySelectorAll('[data-form="' + id + '"]');
            const length = fields.length;

            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId + '-form');
            }

            subMain.appendChild(newEle.firstElementChild);

            /**
             * @todo Orange-Management/jsOMS#82
             *  The container element for inline adding isn't always tbody
             *
             * @todo Orange-Management/jsOMS#83
             *  Removing a dynamically added form from the dom should also be removed and unbound from the FormManager
             */
            self.app.uiManager.getFormManager().get(eleId + '-form').injectSubmit(function () {
                document.getElementById(id).getElementsByTagName('tbody')[0].removeChild(
                    document.getElementById(eleId)
                );
            });

            /**
             * @todo Orange-Management/jsOMS#78
             *  After adding a new element some require a binding for removal
             *
             * @todo Orange-Management/jsOMS#79
             *  After adding a new element some require a binding for editing
             */
        });

        /**
         * @todo Orange-Management/jsOMS#80
         *  Consider to do UI action as success inject after a backend response.
         *  This will prevent bugs where the backand couldn't complete a action but the user sees it in the frontend.
         *  This should be probably optional optional because sometimes there will be no calls to the backend.
         *
         * @todo Orange-Management/jsOMS#81
         *  A template can contain elements which must/should have an id (e.g. a form).
         *  If this element gets added to the DOM the id should be changed to a unique id because it could be added multiple times to the DOM.
         *  In order to bind these elements (e.g. forms) they must have a unique id.
         *  Maybe check all elements for ids and add a random part e.g. `-random_string`
         */
    };

    /**
     * Bind edit button
     *
     * @param {string} update Update button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindUpdatable(update, id)
    {
        if (document.getElementById(id).getAttribute('data-ui-form') === null) {
            this.bindUpdatableInline(update, id);
        } else {
            this.bindUpdatableExternal(update, id);
        }
    };

    /**
     * Bind inline edit button
     *
     * @param {string} update Update button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindUpdatableInline(update, id)
    {
        const self = this;

        update.addEventListener('click', function () {
            const formElement  = document.getElementById(id);
            const parents      = [];
            const selectors    = formElement.getAttribute('data-ui-element').split(','),
                selectorLength = selectors.length;

            const subMain = formElement.getAttribute('data-ui-content').charAt(0) === '#'
                ? document.querySelector(formElement.getAttribute('data-ui-content'))
                : formElement.querySelector(formElement.getAttribute('data-ui-content'));

            let values   = [];
            let text     = [];
            const newEle = [];

            for (let i = 0; i < selectorLength; ++i) {
                // this handles selectors such as 'ancestor > child/or/sibling' and many more
                const selector = selectors[i].trim(' ').split(' ');
                const closest  = selector[0].trim();

                let subSelector = '';
                if (selector.length !== 0) {
                    selector.shift();
                    subSelector = selector.join(' ').trim();
                }

                parents.push(
                    selector.length === 0 ? this.closest(closest) : this.closest(closest).querySelector(subSelector)
                );

                values = values.concat(
                        parents[i].hasAttribute('data-tpl-value') ? parents[i] : Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-value]'))
                    );
                text   = text.concat(
                        parents[i].hasAttribute('data-tpl-text') ? parents[i] : Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-text]'))
                    );

                jsOMS.addClass(parents[i], 'hidden');

                newEle.push(subMain.getElementsByTagName('template')[selectorLength + i].content.cloneNode(true));

                if (newEle[i].firstElementChild.id === null) {
                    let eleId = '';

                    do {
                        eleId = 'f' + Math.random().toString(36).substring(7);
                    } while (document.getElementById(eleId) !== null);

                    // root element is form even if it has a different tag than <form> also <tr> can be a form!
                    newEle[i].firstElementChild.id = eleId;
                }
            }

            const fields = [];
            for (let i = 0; i < selectorLength; ++i) {
                fields.concat(
                        newEle[i].firstElementChild.hasAttribute('data-form') ? newEle[i].firstElementChild : newEle[i].firstElementChild.querySelectorAll('[data-form="' + id + '"]')
                    );
            }

            let length = fields.length;
            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            length = values.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = newEle[j].firstElementChild.hasAttribute('data-tpl-value') ? [newEle[j].firstElementChild] : newEle[j].firstElementChild.querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        if (values[i].getAttribute('data-tpl-value').startsWith('http')
                            || values[i].getAttribute('data-tpl-value').startsWith('{')
                        ) {
                            const request = new Request(values[i].getAttribute('data-tpl-value'));
                            request.setResultCallback(200, function(xhr) {
                                /**
                                 * @todo Orange-Management/jsOMS#84
                                 *  Remote data responses need to be parsed
                                 *  The data coming from the backend/api usually is not directly usable in the frontend.
                                 *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                                 */
                                self.setValueOfElement(matches[c], xhr.response);
                            });

                            request.send();
                        } else {
                            self.setValueOfElement(matches[c], self.getValueFromDataSource(values[i]));
                        }
                    }
                }
            }

            // insert row text data into form
            length = text.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = newEle[j].firstElementChild.hasAttribute('data-tpl-text') ? [newEle[j].firstElementChild] : newEle[j].firstElementChild.querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        if (text[i].getAttribute('data-tpl-text').startsWith('http')
                            || text[i].getAttribute('data-tpl-text').startsWith('{')
                        ) {
                            const request = new Request(text[i].getAttribute('data-tpl-text'));
                            request.setResultCallback(200, function(xhr) {
                                /**
                                 * @todo Orange-Management/jsOMS#84
                                 *  Remote data responses need to be parsed
                                 *  The data coming from the backend/api usually is not directly usable in the frontend.
                                 *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                                 */
                                self.setTextOfElement(matches[c], xhr.response);
                            });

                            request.send();
                        } else {
                            self.setTextOfElement(matches[c], self.getTextFromDataSource(text[i]));
                        }
                    }
                }
            }

            for (let i = 0; i < selectorLength; ++i) {
                newEle[i].firstElementChild.setAttribute('data-marker', 'tpl');
                parents[i].parentNode.insertBefore(newEle[i].firstElementChild, parents[i]);
            }

            //self.bindCreateForm(eleId, id); // todo: why this bind???
            // todo: this is not working!!!!!!!!!!
            /*
            self.app.uiManager.getFormManager().get(eleId).injectSubmit(function () {
                // todo: simplify this?
                self.closest(self.getAttribute('data-ui-element')).parentNode.removeChild(
                    document.getElementById(eleId)
                );
            });*/

            jsOMS.addClass(this, 'hidden');

            const saveButtons = self.forms[id].getSave();
            length            = saveButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.removeClass(saveButtons[i], 'hidden');
            }

            const cancelButtons = self.forms[id].getCancel();
            length              = cancelButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.removeClass(cancelButtons[i], 'hidden');
            }

            // todo: on save button click insert data into hidden row and show hidden row again, delete form row
        });

        /**
         * @todo Orange-Management/jsOMS#85
         *  Invalid backend/api responses (!201) should undo/stop UI changes
         */
    };

    /**
     * Bind inline cancel button
     *
     * @param {string} cancel Cancel button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindCancelInline(cancel, id)
    {
        const self = this;

        cancel.addEventListener('click', function () {
            self.removeEditTemplate(this, id);
        });
    };

    /**
     * Bind inline save button
     *
     * @param {string} save Save button
     * @param {Object} id   Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindSaveInline(save, id)
    {
        const self = this;

        save.addEventListener('click', function () {
            const formElement    = document.getElementById(id);
            const parentsTpl     = [];
            const parentsContent = [];
            const selectors      = formElement.getAttribute('data-ui-element').split(','),
                selectorLength   = selectors.length;

            let values = [];
            let text   = [];

            for (let i = 0; i < selectorLength; ++i) {
                // todo: similar logic is in updatable Inline and probably in External... pull out?
                // this handles selectors such as 'ancestor > child/or/sibling' and many more
                let selector = selectors[i].trim(' ').split(' ');
                let closest  = selector[0].trim();

                // template elements
                let subSelector = '';
                if (selector.length !== 0) {
                    selector.shift();
                    subSelector = selector.join(' ').trim() + '[data-marker=tpl]';
                } else {
                    closest += '[data-marker=tpl]';
                }

                parentsTpl.push(
                    selector.length === 0 ? this.closest(closest) : this.closest(closest).querySelector(subSelector)
                );

                // content elements
                selector    = selectors[i].trim(' ').split(' ');
                closest     = selector[0].trim();
                subSelector = '';
                if (selector.length !== 0) {
                    selector.shift();
                    subSelector = selector.join(' ').trim() + ':not([data-marker=tpl])';
                } else {
                    closest += ':not([data-marker=tpl])';
                }

                parentsContent.push(
                    selector.length === 0 ? this.closest(closest) : this.closest(closest).querySelector(subSelector).parentNode
                    /* parentNode because of media edit. maybe I need a data-ui-parent element? */
                );

                values = values.concat(
                    parentsTpl[i].hasAttribute('data-tpl-value') ? parentsTpl[i] : Array.prototype.slice.call(parentsTpl[i].querySelectorAll('[data-tpl-value]'))
                );
                text   = text.concat(
                    parentsTpl[i].hasAttribute('data-tpl-text') ? parentsTpl[i] : Array.prototype.slice.call(parentsTpl[i].querySelectorAll('[data-tpl-text]'))
                );
            }

            // overwrite old values data in ui
            length = values.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = parentsContent[j].querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        if (values[i].getAttribute('data-tpl-value').startsWith('http')
                            || values[i].getAttribute('data-tpl-value').startsWith('{')
                        ) {
                            const request = new Request(values[i].getAttribute('data-tpl-value'));
                            request.setResultCallback(200, function(xhr) {
                                /**
                                 * @todo Orange-Management/jsOMS#84
                                 *  Remote data responses need to be parsed
                                 *  The data coming from the backend/api usually is not directly usable in the frontend.
                                 *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                                 */
                                self.setValueOfElement(matches[c], xhr.response);
                            });

                            request.send();
                        } else {
                            self.setValueOfElement(matches[c], self.getValueFromDataSource(values[i]));
                        }
                    }
                }
            }

            // overwrite old text data in ui
            length = text.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = parentsContent[j].querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        if (text[i].getAttribute('data-tpl-text').startsWith('http')
                            || text[i].getAttribute('data-tpl-text').startsWith('{')
                        ) {
                            const request = new Request(text[i].getAttribute('data-tpl-text'));
                            request.setResultCallback(200, function(xhr) {
                                /**
                                 * @todo Orange-Management/jsOMS#84
                                 *  Remote data responses need to be parsed
                                 *  The data coming from the backend/api usually is not directly usable in the frontend.
                                 *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                                 */
                                self.setTextOfElement(matches[c], xhr.response);
                            });

                            request.send();
                        } else {
                            self.setTextOfElement(matches[c], self.getTextFromDataSource(text[i]));
                        }
                    }
                }
            }

            // todo bind failure here, if failure do cancel, if success to remove edit template
            self.submit(self.forms[id]);
            self.removeEditTemplate(this, id);
        });
    }

    /**
     * Remove inline edit template
     *
     * @param {string} ele Inline edit element
     * @param {Object} id  Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    removeEditTemplate(ele, id)
    {
        const formElement  = document.getElementById(id);
        const selectors    = formElement.getAttribute('data-ui-element').split(','),
            selectorLength = selectors.length;

        for (let i = 0; i < selectorLength; ++i) {
            let selector = selectors[i].trim(' ').split(' ');
            let closest  = selector[0].trim();

            let subSelector = '';
            if (selector.length !== 0) {
                selector.shift();
                subSelector = selector.join(' ').trim();
            }

            let content    = selector.length === 0 ? ele.closest(closest) : ele.closest(closest).querySelector(subSelector);
            const tpls     = content.parentNode.querySelectorAll('[data-marker=tpl]'),
                tplsLength = tpls.length;

            for (let j = 0; j < tplsLength; ++j) {
                tpls[j].parentNode.removeChild(tpls[j]);
            }

            content = selector.length === 0 ? ele.closest(closest) : ele.closest(closest).querySelector(subSelector);
            jsOMS.removeClass(content, 'hidden');
        }

        const saveButtons = this.forms[id].getSave();
        let length        = saveButtons.length;
        for (let i = 0; i < length; ++i) {
            jsOMS.addClass(saveButtons[i], 'hidden');
        }

        const cancelButtons = this.forms[id].getCancel();
        length              = cancelButtons.length;
        for (let i = 0; i < length; ++i) {
            jsOMS.addClass(cancelButtons[i], 'hidden');
        }

        const update = this.forms[id].getUpdate();
        length       = update === null ? 0 : update.length;
        for (let i = 0; i < length; ++i) {
            jsOMS.removeClass(update[i], 'hidden');
        }
    };

    /**
     * Bind edit button where data is edited externally
     *
     * @param {string} update Update button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindUpdatableExternal(update, id)
    {
        const self = this;

        update.addEventListener('click', function () {
            const formElement = document.getElementById(id);
            const parent      = this.closest(formElement.getAttribute('data-ui-element'));
            const formId      = formElement.getAttribute('data-ui-form');
            const values      = parent.querySelectorAll('[data-tpl-value]');
            const text        = parent.querySelectorAll('[data-tpl-text]');

            const fields = document.getElementById(formId).querySelectorAll('[data-form="' + id + '"]');
            let length   = fields.length;

            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            length = values.length;
            for (let i = 0; i < length; ++i) {
                const matches = document.getElementById(formId).querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');

                const matchLength = matches.length;
                for (let c = 0; c < matchLength; ++c) {
                    if (values[i].getAttribute('data-tpl-value').startsWith('http')
                            || values[i].getAttribute('data-tpl-value').startsWith('{')
                        ) {
                            const request = new Request(values[i].getAttribute('data-tpl-value'));
                            request.setResultCallback(200, function(xhr) {
                                /**
                                 * @todo Orange-Management/jsOMS#84
                                 *  Remote data responses need to be parsed
                                 *  The data coming from the backend/api usually is not directly usable in the frontend.
                                 *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                                 */
                                self.setValueOfElement(matches[c], xhr.response);
                            });

                            request.send();
                        } else {
                            self.setValueOfElement(matches[c], self.getValueFromDataSource(values[i]));
                        }
                }
            }

            // insert row text data into form
            length = text.length;
            for (let i = 0; i < length; ++i) {
                const matches = document.getElementById(formId).querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                // todo: consider pulling this out because it exists like 3x2 = 6 times in a similar way or at least 3 times very similarly
                const matchLength = matches.length;
                for (let c = 0; c < matchLength; ++c) {
                    if (text[i].getAttribute('data-tpl-text').startsWith('http')
                        || text[i].getAttribute('data-tpl-text').startsWith('{')
                    ) {
                        const request = new Request(text[i].getAttribute('data-tpl-text'));
                        request.setResultCallback(200, function(xhr) {
                            /**
                             * @todo Orange-Management/jsOMS#84
                             *  Remote data responses need to be parsed
                             *  The data coming from the backend/api usually is not directly usable in the frontend.
                             *  For that purpose some kind of value path should be defined to handle json responses in order to get only the data that is needed.
                             */
                            self.setTextOfElement(matches[c], xhr.response);
                        });

                        request.send();
                    } else {
                        self.setTextOfElement(matches[c], self.getTextFromDataSource(text[i]));
                    }
                }
            }

            /**
             * @todo Orange-Management/jsOMS#86
             *  On edit replace add button with save and cancel
             *
             * @todo Orange-Management/jsOMS#85
             *  Invalid backend/api responses (!201) should undo/stop UI changes
             *
             * @todo Orange-Management/jsOMS#87
             *  On edit highlight the data which is changed
             */
        });
    };

    /**
     * Removes the closest row on click.
     *
     * @param {Element} remove Remove button
     * @param {Object}  id     Element id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindRemovable(remove, id)
    {
        remove.addEventListener('click', function () {
            const callback = function() {
                const parent = remove.closest(document.getElementById(id).getAttribute('data-ui-element'));
                parent.parentNode.removeChild(parent);
            };

            const container = document.getElementById(id);

            // container can be the table tr, form or just a div
            if (container !== null
                && ((container.tagName.toLowerCase() !== 'form' && container.getAttribute('data-method') !== null)
                    || (container.tagName.toLowerCase() === 'form' && container.getAttribute('method') !== 'NONE'))
            ) {
                const deleteRequest = new Request(
                    container.tagName.toLowerCase() !== 'form' ? container.getAttribute('data-method') : container.getAttribute('method'),
                    RequestMethod.DELETE
                );
                deleteRequest.setSuccess(callback);
                deleteRequest.send();
            } else {
                callback();
            }
        });
    };

    setValueOfElement(src, value)
    {
        switch (src.tagName.toLowerCase()) {
            case 'div':
            case 'pre':
            case 'article':
            case 'section':
                src.innerHTML = jsOMS.htmlspecialchars_encode(value);
                break;
            default:
                src.value = jsOMS.htmlspecialchars_decode(value);
        }
    };

    setTextOfElement(src, value)
    {
        switch (src.tagName.toLowerCase()) {
            case 'div':
            case 'pre':
            case 'article':
            case 'section':
                src.innerHTML = jsOMS.htmlspecialchars_encode(value);
                break;
            case 'textarea':
                // textarea only has value data in it's content and nothing else!
                break;
            default:
                src.value = jsOMS.htmlspecialchars_decode(value);
        }
    };

    getValueFromDataSource(src)
    {
        switch (src.tagName.toLowerCase()) {
            case 'div':
            case 'pre':
            case 'article':
            case 'section':
                return src.innerHTML;
            default:
                return src.value;
        }
    };

    getTextFromDataSource(src)
    {
        switch (src.tagName.toLowerCase()) {
            case 'div':
            case 'pre':
            case 'article':
            case 'section':
                return src.innerHTML;
            default:
                return src.value;
        }
    };
};