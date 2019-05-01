import { Logger } from '../../Log/Logger.js';
import { FormView } from '../../Views/FormView.js';
import { Request } from '../../Message/Request/Request.js';
import { RequestMethod } from '../../Message/Request/RequestMethod.js';
import { Response } from '../../Message/Response/Response.js';
import { ResponseType } from '../../Message/Response/ResponseType.js';
import { NotificationMessage } from '../../Message/Notification/NotificationMessage.js';
import { NotificationLevel } from '../../Message/Notification/NotificationLevel.js';
import { NotificationType } from '../../Message/Notification/NotificationType.js';

/**
 * Form manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class Form {
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

        this.unbind(id);

        const submits = this.forms[id].getSubmit()
        let length    = submits.length;

        for (let i = 0; i < length; ++i) {
            submits[i].addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);
                self.submit(self.forms[id]);
            });
        }

        const removable = this.forms[id].getRemove();
        length = removable === null ? 0 : removable.length;
        for (let i = 0; i < length; ++i) {
            this.bindRemovable(removable[i], id);
        }

        const addable = this.forms[id].getAdd();
        length = addable === null ? 0 : addable.length;
        for (let i = 0; i < length; ++i) {
            this.bindAddInline(addable[i], id);
        }

        if (document.getElementById(id).getAttribute('data-ui-form') !== null) {
            this.bindAddExternal(id);
        }

        const update = this.forms[id].getUpdate();
        length = update === null ? 0 : update.length;
        for (let i = 0; i < length; ++i) {
            this.bindUpdatable(update[i], id);
        }
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
        // todo: do i need the findex? can't i just use id?
        let findex = 0;

        if ((findex = this.forms[id]) !== 'undefined') {
            this.forms[id].unbind();
            this.forms.splice(findex, 1);

            return true;
        }

        return false;
    };

    /**
     * Submit form
     *
     * Calls injections first befor executing the actual form submit
     *
     * @param {Object} form Form object
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submit (form)
    {
        /* Handle injects */
        const self  = this,
            injects = form.getSubmitInjects();
        let counter = 0;

        // todo: test if attach necessary (maybe already attached in event manager)
        // Register normal form behavior
        this.app.eventManager.attach(form.getId(), function ()
        {
            self.submitForm(form);
        }, true);

        // Run all injects first
        for (let property in injects) {
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
     * @param {Object} form Form object
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    submitForm (form)
    {
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
        request.setType(ResponseType.JSON);
        request.setUri(form.getAction());
        request.setMethod(form.getMethod());
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr)
        {
            console.log(xhr.response);

            try {
                const o            = JSON.parse(xhr.response)[0],
                    response       = new Response(o);
                let successInject  = null;

                if ((successInject = form.getSuccess()) !== null) {
                    successInject(response);
                } else if (typeof response.get('type') !== 'undefined') {
                    // todo: am i using this now and should all cases be handled with the successInjection?
                    // maybe there could be global response actions where injecting them to every form would not make any sense
                    // however not many if any use cases come to mind right now where this would be necessary
                    self.app.responseManager.run(response.get('type'), response.get(), request);
                } else if (typeof o.status !== 'undefined') {
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
                    'Some failure happend'
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
     * @since  1.0.0
     */
    bindAddExternal(id)
    {
        const createForm = document.getElementById(id).getAttribute('data-ui-form');
        // todo: maybe allow multiple add buttons!!!! In order to do that  do createForm.getAttribute('data-ui-form') and add this attribute to the add button instead of the pseudo form

        this.app.uiManager.getFormManager().get(createForm).injectSubmit(function () {
            const subMain = document.getElementById(id).querySelector(document.getElementById(id).getAttribute('data-ui-content'));
            const newEle  = subMain.getElementsByTagName('template')[0].content.cloneNode(true);

            // set internal value
            let fields = newEle.querySelectorAll('[data-tpl-value]');
            let fieldLength = fields.length;
            let uuid = '';
            let value = '';

            for (let j = 0; j < fieldLength; ++j) {
                value = document.querySelectorAll(
                    '#' + createForm + ' [data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"], [data-form="' + createForm + '"][data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"]')[0]
                    .getAttribute('data-value');

                // todo: we need to check what kind of tag the selector above returns in order to get the correct value. currently this only makes sense for input elements but for selection, checkboxes etc. this doesn't make sense there we need .innerHtml or [data-text=]

                fields[j].setAttribute('data-value', value);

                uuid += value;
            }

            // don't allow duplicate
            if (subMain.querySelectorAll('[data-tpl-uuid="' + uuid + '"').length !== 0) {
                return;
            }

            newEle.firstElementChild.setAttribute('data-tpl-uuid', uuid);

            // set readable text
            fields = newEle.querySelectorAll('[data-tpl-text]');
            fieldLength = fields.length;

            for (let j = 0; j < fieldLength; ++j) {
                fields[j].appendChild(
                    document.createTextNode(
                        document.querySelectorAll('#' + createForm + ' [data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"], [data-form="' + createForm + '"][data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"]')[0].value
                    )
                );

                // todo: we need to check what kind of tag the selector above returns in order to get the correct value. currently this only makes sense for input elements but for selection, checkboxes etc. this doesn't make sense there we need .innerHtml or [data-text=]
            }

            subMain.appendChild(newEle);
            // todo: consider to do ui action as success inject to the backend request... maybe optional because sometimes there will be no backend call?
            // todo: if a column has a form in the template the id of the form needs to be set unique somehow (e.g. remove button in form)

            // todo: bind removable
            // todo: bind edit

            return true;
        });
    };

    /**
     * Create the table row
     *
     * @param {string} createForm Create form
     * @param {Object} id         Table id
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    bindAddInline(createForm, id)
    {
        const self = this;

        createForm.addEventListener('click', function () {
            const subMain = document.getElementById(id).querySelector(document.getElementById(id).getAttribute('data-ui-content'));
            const newEle  = subMain.getElementsByTagName('template')[1].content.cloneNode(true);
            const eleId = 'f' + Math.random().toString(36).substring(7);
            // todo: check if random id doesn't already exist

            newEle.firstElementChild.id = eleId;
            newEle.firstElementChild.getElementsByTagName('form')[0].id = eleId + '-form';

            const fields = newEle.firstElementChild.querySelectorAll('[data-form="' + id + '"]');
            const length = fields.length;

            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId + '-form');
            }

            subMain.appendChild(newEle.firstElementChild);

            self.app.uiManager.getFormManager().get(eleId + '-form').injectSubmit(function () {
                document.getElementById(id).getElementsByTagName('tbody')[0].removeChild(
                    document.getElementById(eleId)
                );
            });

            // todo: bind removable
            // todo: bind edit
        });

        // todo: this is polluting the form manager because it should be emptied afterwards (form is deleted but not from form manager)
        // todo: consider to do ui action as success inject to the backend request... maybe optional because sometimes there will be no backend call?
        // todo: if a column has a form in the template the id of the form needs to be set unique somehow (e.g. remove button in form)
    };

    bindUpdatable(update, id)
    {
        if (document.getElementById(id).getAttribute('data-ui-form') === null) {
            this.bindUpdatableInline(update, id);
        } else {
            this.bindUpdatableExternal(update, id);
        }
    };

    bindUpdatableInline(update, id) {
        const self = this;

        update.addEventListener('click', function () {
            const parent = this.closest(document.getElementById(id).getAttribute('data-ui-element'));
            const values = parent.querySelectorAll('[data-tpl-value]');
            const text = parent.querySelectorAll('[data-tpl-text]');
            const subMain = parent.parentNode;

            parent.style = "display: none"; // todo: replace with class instead of inline style

            const newEle = subMain.getElementsByTagName('template')[1].content.cloneNode(true);
            const eleId = 'f' + Math.random().toString(36).substring(7);
            // todo: don't use random id use actual row id for data which needs to be updated

            // root element is form even if it has a different tag than <form> also <tr> can be a form!
            newEle.firstElementChild.id = eleId;

            const fields = newEle.firstElementChild.querySelectorAll('[data-form="' + id + '"]');
            let length = fields.length;

            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            length = values.length;
            for (let i = 0; i < length; ++i) {
                // todo: handle multiple matches
                newEle.firstElementChild.querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"')[0].value = values[i].value;
                // todo: handle different input types
            }

            // insert row text data into form
            length = text.length;
            for (let i = 0; i < length; ++i) {
                // todo: handle multiple matches
                newEle.firstElementChild.querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"')[0].value = text[i].innerText;
                // todo: handle different input types
            }

            subMain.insertBefore(newEle.firstElementChild, parent);

            //self.bindCreateForm(eleId, id); // todo: why this bind???
            self.app.uiManager.getFormManager().get(eleId).injectSubmit(function () {
                // todo: simplify this?
                self.closest(self.getAttribute('data-ui-element')).parentNode.removeChild(
                    document.getElementById(eleId)
                );
            });

            // todo: replace add button with save button and add cancel button
            // todo: on save button click insert data into hidden row and show hidden row again, delete form row
        });
    };

    bindUpdatableExternal(update, id)
    {
        update.addEventListener('click', function () {
            const parent = this.closest(document.getElementById(id).getAttribute('data-ui-element'));
            const formId = document.getElementById(id).getAttribute('data-ui-form');
            const values = parent.querySelectorAll('[data-tpl-value]');
            const text = parent.querySelectorAll('[data-tpl-text]');

            const fields = document.getElementById(formId).querySelectorAll('[data-form="' + id + '"]');
            let length = fields.length;

            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            length = values.length;
            for (let i = 0; i < length; ++i) {
                // todo: handle multiple matches
                document.getElementById(formId).querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"')[0].value = values[i].value;
                // todo: handle different input types
            }

            // insert row text data into form
            length = text.length;
            for (let i = 0; i < length; ++i) {
                // todo: handle multiple matches
                document.getElementById(formId).querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"')[0].value = text[i].innerText;
                // todo: handle different input types
            }

            // todo: replace add button with save button and add cancel button
            // todo: on save button click insert data into hidden row and show hidden row again, delete form row
            // todo: consider to highlight column during edit
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
     * @since  1.0.0
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