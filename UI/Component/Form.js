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
        this.bindButtons(id);

        const imgPreviews = this.forms[id].getImagePreviews();
        length            = imgPreviews === null ? 0 : imgPreviews.length;
        for (let i = 0; i < length; ++i) {
            this.bindImagePreview(imgPreviews[i], id);
        }

        for (let i = 0; i < submitLength; ++i) {
            submits[i].addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);
                self.submit(self.forms[id], submits[i]);
            });
        }
    };

    bindButtons (id, e = null)
    {
        let length = 0;

        const removable = this.forms[id].getRemove(e);
        length          = removable === null ? 0 : removable.length;
        for (let i = 0; i < length; ++i) {
            this.bindRemovable(removable[i], id);
        }

        const addable = this.forms[id].getAdd(e);
        length        = addable === null ? 0 : addable.length;
        for (let i = 0; i < length; ++i) {
            this.bindAdd(addable[i], id);
        }

        const save = this.forms[id].getSave(e);
        length     = save === null ? 0 : save.length;
        for (let i = 0; i < length; ++i) {
            this.bindSaveInline(save[i], id);
        }

        // @todo implement bindSaveExternal ???

        const cancel = this.forms[id].getCancel(e);
        length       = cancel === null ? 0 : cancel.length;
        for (let i = 0; i < length; ++i) {
            this.bindCancel(cancel[i], id);
        }

        const update = this.forms[id].getUpdate(e);
        length       = update === null ? 0 : update.length;
        for (let i = 0; i < length; ++i) {
            this.bindUpdatable(update[i], id);
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
    bindImagePreview (imageUpload, id) {
        imageUpload.addEventListener('change', function () {
            const preview = document.querySelector('#preview-' + imageUpload.getAttribute('name'));

            preview.src    = window.URL.createObjectURL(imageUpload.files[0]);
            preview.onload = function () {
                window.URL.revokeObjectURL(this.src);
            }
        });
    };

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
     * @param {Element} button Action different from the form action (e.g. formaction=*)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submit (form, button)
    {
        /* Handle injects */
        const self  = this,
            injects = form.getSubmitInjects();
        let counter = 0;

        let action = null;

        if (button !== null) {
            action = button.getAttribute('formaction');
        }

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

        // select first input element (this allows fast consecutive data input)
        const firstFormInputElement = form.getFirstInputElement();
        firstFormInputElement.focus();
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
        const data = form.getData();

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
        const request = new Request(),
            self      = this;

        request.setData(data);
        request.setType(RequestType.FORM_DATA);
        request.setUri(action ? action : form.getAction());
        request.setMethod(form.getMethod());
        request.setSuccess(function (xhr)
        {
            console.log(xhr.response);

            if (xhr.getResponseHeader('content-type') === 'application/octet-stream') {
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
            } else {
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

    static formClickEvent(event)
    {
        // submit button?

        // filter
        // sort
        // reorder
        // remove
        // add
        // save
        // update
        // dragndrop
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
     * @param {string} create Create form button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindAddExternal(create, id)
    {
        const self = this;

        /**
         * @todo Orange-Management/jsOMS#75
         *  Currently only one add button is allowed per form. Allow multiple/different add buttons in a form.
         */
        create.addEventListener('click', function () {
            if (!self.forms[id].isValid()) {
                return;
            }

            const formElement  = document.getElementById(id);
            const parents      = [];
            const selectors    = formElement.getAttribute('data-add-element').split(','),
                selectorLength = selectors.length;
            const addTpl       = formElement.getAttribute('data-add-tpl').split(',');

            const subMain = formElement.getAttribute('data-add-content').charAt(0) === '#'
                ? document.querySelector(formElement.getAttribute('data-add-content'))
                : formElement.querySelector(formElement.getAttribute('data-add-content'));

            let values   = [];
            let text     = [];
            const newEle = [];

            for (let i = 0; i < selectorLength; ++i) {
                // this handles selectors such as 'ancestor > child/or/sibling' and many more
                const selector = selectors[i].trim(' ').split(' ');

                let subSelector = '';
                if (selector.length !== 0) {
                    selector.shift();
                    subSelector = selector.join(' ').trim();
                }

                newEle.push(document.querySelector(addTpl[i]).content.cloneNode(true));

                const tplValue = newEle[i].querySelector('[data-tpl-value]').getAttribute('data-tpl-value');
                parents.push(
                    tplValue.startsWith('http') || tplValue.startsWith('{')
                        ? ( // data is only added from remote response after adding
                            selector.length === 0
                                ? newEle[i].firstElementChild
                                : newEle[i].firstElementChild.querySelector(subSelector)
                        )
                        : formElement // data comes from the form (even if the api returns something after adding). What if remote returns a DB id? how do we add it? is this a @todo ? probably yes, maybe first use local data and then if remote data available replace local data?
                );

                values = values.concat(
                        parents[i].hasAttribute('data-tpl-value')
                            ? parents[i]
                            : Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-value]'))
                    );
                text   = text.concat(
                        parents[i].hasAttribute('data-tpl-text')
                            ? parents[i]
                            : Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-text]'))
                    );

                    Form.setRandomIdForTemplateElement(newEle[i]);
            }

            // insert row values data into form
            const remoteUrls = {};
            Form.insertDataIntoNewFormElement('value', newEle, values, remoteUrls);

            // insert row text data into form
            Form.insertDataIntoNewFormElement('text', newEle, text, remoteUrls)

            for (let i = 0; i < selectorLength; ++i) {
                // The data could be added to an external element which uses external forms for updates.
                // The buttons then belong to the external element and not the update form!
                const formId = document.querySelector('[data-update-form="' + id + '"]');

                self.bindButtons(formId === null ? id : formId.id, newEle[i].firstElementChild);

                // @todo: bind added element in general (e.g. self.app.uiManager.bind(newEle[i].firstElementChild));
                // Problem 1 is sometimes the bind functions expect an id, sometimes an element
                // Problem 2 is that sorting is handled in the Table.js which should be part of the form? because a new sorting should also get submitted to the backend!

                subMain.appendChild(newEle[i].firstElementChild);
            }

            self.forms[id].setSuccess(function(response) {
                if (response.get('status') !== 'undefined' && response.get('status') !== NotificationLevel.HIDDEN) {
                    self.app.notifyManager.send(
                        new NotificationMessage(response.get('status'), response.get('title'), response.get('message')), NotificationType.APP_NOTIFICATION
                    );
                }

                console.log(remoteUrls);

                UriFactory.setQuery('$id', response.get('response').id);

                Form.setDataFromRemoteUrls(remoteUrls);
            });

            self.forms[id].resetValues();

            // @todo bind update
        });

        /**
         * @todo Orange-Management/jsOMS#85
         *  Invalid backend/api responses (!201) should undo/stop UI changes
         */
    };

    static setDataFromRemoteUrls (remoteUrls)
    {
        for (const e in remoteUrls) {
            const request = new Request(e);
            request.setResultCallback(200, function(xhr) {
                /**
                 * @todo Orange-Management/jsOMS#84
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

    static setRandomIdForTemplateElement (templateElement)
    {
        if (templateElement.firstElementChild.id !== null) {
            return;
        }

        let eleId = '';

        do {
            eleId = 'f' + Math.random().toString(36).substring(7);
        } while (document.getElementById(eleId) !== null);

        templateElement.firstElementChild.id = eleId;
    };

    static insertDataIntoNewFormElement (type, templateElements, data, remoteUrls = {})
    {
        const changedNodes   = []; // prevent same node touching
        const length         = data.length;
        const templateLength = templateElements.length;
        for (let i = 0; i < length; ++i) {
            const path = data[i].hasAttribute('data-tpl-' + type + '-path') ? data[i].getAttribute('data-tpl-' + type + '-path') : null;

            for (let j = 0; j < templateLength; ++j) {
                const matches = templateElements[j].firstElementChild.hasAttribute('data-tpl-' + type)
                    && templateElements[j].firstElementChild.getAttribute('data-tpl-' + type) === data[i].getAttribute('data-tpl-' + type)
                    ? [templateElements[j].firstElementChild]
                    : templateElements[j].firstElementChild.querySelectorAll(
                        '[data-tpl-' + type + '="' + data[i].getAttribute('data-tpl-' + type) + '"'
                    );

                const matchLength = matches.length;
                for (let c = 0; c < matchLength; ++c) {
                    if (changedNodes.includes(matches[c])
                        || (path !== null && path !== matches[c].getAttribute('data-tpl-' + type + '-path')) // ensure correct element. if this doesn't exist the matches from above contains alle elements with the same uri/path but eventually different tpl-paths @todo maybe fix it by improving the loop nesting or instead of storing the uri in the remoteUrls store the path? and then just check the path?
                    ) {
                        continue;
                    }

                    changedNodes.push(matches[c]);

                    if (data[i].getAttribute('data-tpl-' + type).startsWith('http')
                        || data[i].getAttribute('data-tpl-' + type).startsWith('{')
                    ) {
                        Form.populateRemoteUrls(type, data[i], path, remoteUrls)
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

    static insertDataIntoForm (type, formId, data, remoteUrls = {})
    {
        const length = data.length;
        for (let i = 0; i < length; ++i) {
            const matches = document.getElementById(formId).querySelectorAll('[data-tpl-' + type + '="' + data[i].getAttribute('data-tpl-' + type) + '"');
            const path    = data[i].hasAttribute('data-tpl-' + type + '-path') ? data[i].getAttribute('data-tpl-' + type + '-path') : null;

            const matchLength = matches.length;
            for (let c = 0; c < matchLength; ++c) {
                if (data[i].getAttribute('data-tpl-' + type).startsWith('http')
                    || data[i].getAttribute('data-tpl-' + type).startsWith('{')
                ) {
                    Form.populateRemoteUrls(type, data[i], path, remoteUrls)
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

    static populateRemoteUrls (type, data, path, remoteUrls)
    {
        const uri = data[i].getAttribute('data-tpl-' + type).startsWith('/')
            ? document.getElementsByTagName('base')[0].href
            : '';

        if (remoteUrls[uri + data[i].getAttribute('data-tpl-' + type)] === undefined) {
            remoteUrls[uri + data[i].getAttribute('data-tpl-' + type)] = [];
        }

        remoteUrls[uri + data[i].getAttribute('data-tpl-' + type)].push({
            path: path,
            element: matches[c],
            type: type
        });
    };

    /**
     * Create the new input
     *
     * @param {string} createForm Create form button
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
            const subMain     = formElement.getAttribute('data-add-content').charAt(0) === '#'
                ? document.querySelector(formElement.getAttribute('data-add-content'))
                : formElement.querySelector(formElement.getAttribute('data-add-content'));

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
     * @param {string} add Add button
     * @param {Object} id  Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindAdd(add, id)
    {
        /* The form is the UI element the user can edit.
         * This will be added to the UI on click.
         * Since the add is inline no form exists which the user can use, hence it must be created
         */
        if (document.getElementById(id).getAttribute('data-add-form') !== null) {
            this.bindAddInline(add, id);
        } else {
            this.bindAddExternal(add, id);
        }
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
        if (document.getElementById(id).getAttribute('data-update-form') === null) {
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
            const selectors    = formElement.getAttribute('data-update-element').split(','),
                selectorLength = selectors.length;
            const updatableTpl = formElement.getAttribute('data-update-tpl').split(',');

            if (formElement.getAttribute('data-id') !== null) {
                UriFactory.setQuery('$id', formElement.getAttribute('data-id'));
            }

            let values   = [];
            let text     = [];
            const newEle = [];

            for (let i = 0; i < selectorLength; ++i) {
                selectors[i] = selectors[i].trim();
                // this handles selectors such as 'ancestor > child/or/sibling' and many more
                const selector  = !selectors[i].startsWith('#') ? selectors[i].split(' ') : [selectors[i]];
                const selLength = selector.length;
                const closest   = selector[0].trim();

                let subSelector = '';
                if (selLength > 1) {
                    selector.shift();
                    subSelector = selector.join(' ').trim();
                }

                if (selLength === 1 && selector[0].startsWith('#')) {
                    parents.push(document.querySelector(selector[0]));
                } else {
                    parents.push(selLength === 1
                        ? this.closest(closest)
                        : this.closest(closest).querySelector(subSelector)
                    );
                }

                values = values.concat(
                        parents[i].hasAttribute('data-tpl-value')
                            ? parents[i]
                            : Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-value]'))
                    );
                text   = text.concat(
                        parents[i].hasAttribute('data-tpl-text')
                            ? parents[i]
                            : Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-text]'))
                    );

                jsOMS.addClass(parents[i], 'hidden');

                newEle.push(document.querySelector(updatableTpl[i]).content.cloneNode(true));

                Form.setRandomIdForTemplateElement(newEle[i]);
            }

            const fields = [];
            for (let i = 0; i < selectorLength; ++i) {
                fields.concat(
                        newEle[i].firstElementChild.hasAttribute('data-form')
                            ? newEle[i].firstElementChild
                            : newEle[i].firstElementChild.querySelectorAll('[data-form="' + id + '"]')
                    );
            }

            let length = fields.length;
            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            const remoteUrls = {};
            Form.insertDataIntoNewFormElement('value', newEle, values, remoteUrls);

            // insert row text data into form
            Form.insertDataIntoNewFormElement('text', newEle, text, remoteUrls);

            Form.setDataFromRemoteUrls(remoteUrls);

            for (let i = 0; i < selectorLength; ++i) {
                newEle[i].firstElementChild.setAttribute('data-marker', 'tpl');
                parents[i].parentNode.insertBefore(newEle[i].firstElementChild, parents[i]);
            }

            //self.bindCreateForm(eleId, id); // @todo: why this bind???
            // @todo: this is not working!!!!!!!!!!
            /*
            self.app.uiManager.getFormManager().get(eleId).injectSubmit(function () {
                // @todo: simplify this?
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

            // @todo: on save button click insert data into hidden row and show hidden row again, delete form row
        });

        /**
         * @todo Orange-Management/jsOMS#85
         *  Invalid backend/api responses (!201) should undo/stop UI changes
         */
    };

    /**
     * Bind cancel button
     *
     * @param {string} update Update button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindCancel(cancel, id)
    {
        const ele = document.getElementById(id);
        if (ele.getAttribute('data-update-form') === null && ele.tagName.toLowerCase() !== 'form') {
            this.bindCancelInline(cancel, id);
        } else {
            this.bindCancelExternal(cancel, id);
        }
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
     * Bind external/form cancel button
     *
     * @param {string} cancel Cancel button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindCancelExternal(cancel, id)
    {
        const self = this;

        cancel.addEventListener('click', function (e) {
            self.forms[id].resetValues();

            let length = 0;

            // show add button + hide update + hide cancel
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

            jsOMS.preventAll(e);
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
            const parentsTpl     = {};
            const parentsContent = {};
            const selectors      = formElement.getAttribute('data-update-element').split(','),
                selectorLength   = selectors.length;

            let values = [];
            let text   = [];

            // find all values, texts and parents for every selector
            for (let i = 0; i < selectorLength; ++i) {
                selectors[i] = selectors[i].trim();
                // this handles selectors such as 'ancestor > child/or/sibling' and many more
                let selector    = !selectors[i].startsWith('#') ? selectors[i].split(' ') : [selectors[i]];
                const selLength = selector.length;
                let closest     = selector[0].trim();

                // template elements (= elements which just got added due to the update/edit button, here the new data is stored)
                // @todo i don't really remember how this works and why this was needed. Try to understand it and write a comment afterwards
                let subSelector = '';
                if (selLength > 1) {
                    selector.shift();
                    subSelector = selector.join(' ').trim() + '[data-marker=tpl]';
                } else {
                    closest += '[data-marker=tpl]';
                }

                let parentTplName;
                if (selLength === 1 && selector[0].startsWith('#')) {
                    parentTplName = selector[0] + '[data-marker=tpl]';
                } else {
                    parentTplName = selLength === 1 ? closest : closest + subSelector;
                }

                if (!parentsTpl.hasOwnProperty(parentTplName)) {
                    if (selLength === 1 && selector[0].startsWith('#')) {
                        parentsTpl[parentTplName] = document.querySelector(selector[0]).parentNode;
                    } else {
                        parentsTpl[parentTplName] = selLength === 1
                        ? this.closest(closest)
                        : this.closest(closest).querySelector(subSelector);
                        /* @todo: parentNode because of media edit. maybe I need a data-ui-parent element? */
                    }
                }

                // content elements
                selector    = !selectors[i].startsWith('#') ? selectors[i].split(' ') : [selectors[i]];
                closest     = selector[0].trim();
                subSelector = '';
                if (selLength > 1) {
                    selector.shift();
                    subSelector = selector.join(' ').trim() + ':not([data-marker=tpl])';
                } else {
                    closest += ':not([data-marker=tpl])';
                }

                let parentContentName;
                if (selLength === 1 && selector[0].startsWith('#')) {
                    parentContentName = selector[0] + ':not([data-marker=tpl])';
                } else {
                    parentContentName = selLength === 1 ? closest : closest + subSelector;
                }

                if (!parentsContent.hasOwnProperty(parentContentName)) {
                    if (selLength === 1 && selector[0].startsWith('#')) {
                        parentsContent[parentContentName] = document.querySelector(selector[0]).parentNode;
                    } else {
                        parentsContent[parentContentName] = selLength === 1
                        ? this.closest(closest)
                        : this.closest(closest).querySelector(subSelector).parentNode;
                        /* @todo: parentNode because of media edit. maybe I need a data-ui-parent element? */
                    }
                }

                values = values.concat(
                    parentsTpl[parentTplName].hasAttribute('data-tpl-value')
                        ? parentsTpl[parentTplName]
                        : Array.prototype.slice.call(parentsTpl[parentTplName].querySelectorAll('[data-tpl-value]'))
                );
                text   = text.concat(
                    parentsContent[parentContentName].hasAttribute('data-tpl-text')
                        ? parentsContent[parentContentName]
                        : Array.prototype.slice.call(parentsContent[parentContentName].querySelectorAll('[data-tpl-text]'))
                );
            }

            values = values.filter(function(value, index, self) { return self.indexOf(value) === index; });
            text   = text.filter(function(value, index, self) { return self.indexOf(value) === index; });

            // overwrite old values data in ui
            const remoteUrls        = {};
            const changedValueNodes = []; // prevent same node touching
            length                  = values.length;
            for (let parent in parentsTpl) { // loop every selector which has elements to change
                for (let i = 0; i < length; ++i) { // loop every value
                    const matches = parentsTpl[parent].querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) { // loop every found element in the selector to change
                        if (changedValueNodes.includes(matches[c])) {
                            continue;
                        }

                        changedValueNodes.push(matches[c]);
                        const path = matches[c].hasAttribute('data-tpl-value-path') ? matches[c].getAttribute('data-tpl-value-path') : null;

                        if (values[i].getAttribute('data-tpl-value').startsWith('http')
                            || values[i].getAttribute('data-tpl-value').startsWith('{')
                        ) {
                            Form.populateRemoteUrls('value', values[i], path, remoteUrls)
                        } else {
                            GeneralUI.setValueOfElement(matches[c], GeneralUI.getValueFromDataSource(values[i]));
                        }
                    }
                }
            }

            // overwrite old text data in ui
            const changedTextNodes = [];
            length                 = text.length;
            for (let parent in parentsContent) {
                for (let i = 0; i < length; ++i) {
                    const matches = parentsContent[parent].querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        if (changedTextNodes.includes(matches[c])) {
                            continue;
                        }

                        changedTextNodes.push(matches[c]);

                        const path = matches[c].hasAttribute('data-tpl-text-path') ? matches[c].getAttribute('data-tpl-text-path') : null;
                        if (text[i].getAttribute('data-tpl-text').startsWith('http')
                            || text[i].getAttribute('data-tpl-text').startsWith('{')
                        ) {
                            Form.populateRemoteUrls('text', text[i], path, remoteUrls)
                        } else {
                            GeneralUI.setTextOfElement(matches[c], GeneralUI.getTextFromDataSource(text[i]));
                        }
                    }
                }
            }

            // todo bind failure here, if failure do cancel, if success to remove edit template
            self.forms[id].setSuccess(function() {
                // overwrite old values from remote response
                Form.setDataFromRemoteUrls(remoteUrls);
            });

            // @todo: does this submit and the previous submit in updatable mean I'm sending the data twice???? That would be bad!
            self.submit(self.forms[id]);
            self.removeEditTemplate(this, id);
        });
    };

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
        const selectors    = formElement.getAttribute('data-update-element').split(','),
            selectorLength = selectors.length;

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

        for (let i = 0; i < selectorLength; ++i) {
            selectors[i] = selectors[i].trim();

            const selector  = !selectors[i].startsWith('#') ? selectors[i].split(' ') : [selectors[i]];
            const selLength = selector.length;
            const closest   = selector[0].trim();

            let subSelector = '';
            if (selLength > 1) {
                selector.shift();
                subSelector = selector.join(' ').trim();
            }

            let content;
            if (selLength === 1 && selector[0].startsWith('#')) {
                content = document.querySelector(selector[0]);
            } else {
                content = selLength === 1 ? ele.closest(closest) : ele.closest(closest).querySelector(subSelector);
            }

            const tpls     = content.parentNode.querySelectorAll('[data-marker=tpl]'),
                tplsLength = tpls.length;

            for (let j = 0; j < tplsLength; ++j) {
                tpls[j].parentNode.removeChild(tpls[j]);
            }

            if (selLength === 1 && selector[0].startsWith('#')) {
                content = document.querySelector(selector[0]);
            } else {
                content = selLength === 1 ? ele.closest(closest) : ele.closest(closest).querySelector(subSelector);
            }

            jsOMS.removeClass(content, 'hidden');
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
            const parent      = this.closest(formElement.getAttribute('data-update-element'));
            const formId      = formElement.getAttribute('data-update-form');
            const values      = parent.querySelectorAll('[data-tpl-value]');
            const text        = parent.querySelectorAll('[data-tpl-text]');

            const fields = document.getElementById(formId).querySelectorAll('[data-form="' + id + '"]');
            let length   = 0;

            // clear form values to prevent old values getting mixed with update values
            self.forms[formId].resetValues();

            // hide add button + show update + show cancel
            const addButtons = self.forms[formId].getAdd();
            length           = addButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.addClass(addButtons[i], 'hidden');
            }

            const saveButtons = self.forms[formId].getSave();
            length            = saveButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.removeClass(saveButtons[i], 'hidden');
            }

            const cancelButtons = self.forms[formId].getCancel();
            length              = cancelButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.removeClass(cancelButtons[i], 'hidden');
            }

            // set form id to fields for easier identification
            length = fields.length;
            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            const remoteUrls = {};
            Form.insertDataIntoForm('value', formId, values, remoteUrls);

            // insert row text data into form
            Form.insertDataIntoForm('text', formId, text, remoteUrls);

            self.forms[formId].setSuccess(function(response) {
                if (response.get('status') !== 'undefined' && response.get('status') !== NotificationLevel.HIDDEN) {
                    self.app.notifyManager.send(
                        new NotificationMessage(response.get('status'), response.get('title'), response.get('message')), NotificationType.APP_NOTIFICATION
                    );
                }

                console.log(remoteUrls);

                UriFactory.setQuery('$id', response.get('response').id);

                Form.setDataFromRemoteUrls(remoteUrls);
            });

            /**
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
};