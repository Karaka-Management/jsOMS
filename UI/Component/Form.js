import { Logger } from '../../Log/Logger.js';
import { NotificationLevel } from '../../Message/Notification/NotificationLevel.js';
import { NotificationMessage } from '../../Message/Notification/NotificationMessage.js';
import { NotificationType } from '../../Message/Notification/NotificationType.js';
import { Request } from '../../Message/Request/Request.js';
import { RequestMethod } from '../../Message/Request/RequestMethod.js';
import { Response } from '../../Message/Response/Response.js';
import { ResponseType } from '../../Message/Response/ResponseType.js';
import { FormView } from '../../Views/FormView.js';

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

        const save = this.forms[id].getSave();
        length = save === null ? 0 : save.length;
        for (let i = 0; i < length; ++i) {
            this.bindSaveInline(save[i], id);
        }

        if (document.getElementById(id).getAttribute('data-ui-form') !== null) {
            this.bindAddExternal(id);
        }

        const cancel = this.forms[id].getCancel();
        length = cancel === null ? 0 : cancel.length;
        for (let i = 0; i < length; ++i) {
            this.bindCancelInline(cancel[i], id);
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
     * Calls injections first before executing the actual form submit
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
     * @since  1.0.0
     */
    bindAddExternal(id)
    {
        const createForm = document.getElementById(id).getAttribute('data-ui-form');
        // todo: maybe allow multiple add buttons!!!! In order to do that  do createForm.getAttribute('data-ui-form') and add this attribute to the add button instead of the pseudo form

        this.app.uiManager.getFormManager().get(createForm).injectSubmit(function () {
            const formElement = document.getElementById(id);
            const subMain = formElement.querySelector(formElement.getAttribute('data-ui-content'));

            // todo: [0/1] is no longer working because of arbitrary templates for inline editing
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

                // todo: we need to check what kind of tag the selector above returns in order to get the correct value. currently this only makes sense for input elements but for selection, checkboxes etc. this doesn't make sense there we need .innerHTML or [data-text=]

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

                // todo: we need to check what kind of tag the selector above returns in order to get the correct value. currently this only makes sense for input elements but for selection, checkboxes etc. this doesn't make sense there we need .innerHTML or [data-text=]
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
     * Create the new input
     *
     * @param {string} createForm Create form
     * @param {Object} id         Id
     *
     * @return {void}
     *
     * @since  1.0.0
     */
    bindAddInline(createForm, id)
    {
        const self = this;

        createForm.addEventListener('click', function () {
            const formElement = document.getElementById(id);
            const subMain = formElement.querySelector(formElement.getAttribute('data-ui-content'));

            // todo: [0/1] is no longer working because of arbitrary templates for inline editing
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

            // todo: this is no longer working... it's not tbody!!!
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

    /**
     * Bind edit button
     *
     * @param {string} update Update button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since  1.0.0
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
     * @since  1.0.0
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
                // todo: maybe move this to the library as an advanced ancestor function?
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

                values = values.concat(Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-value]')));
                text = text.concat(Array.prototype.slice.call(parents[i].querySelectorAll('[data-tpl-text]')));

                jsOMS.addClass(parents[i], 'hidden');

                newEle.push(subMain.getElementsByTagName('template')[selectorLength + i].content.cloneNode(true));

                if (newEle[i].firstElementChild.id === null) {
                    // todo: don't use random id use actual row id for data which needs to be updated
                    const eleId = 'f' + Math.random().toString(36).substring(7);

                    // root element is form even if it has a different tag than <form> also <tr> can be a form!
                    newEle[i].firstElementChild.id = eleId;
                }
            }

            const fields = [];
            for (let i = 0; i < selectorLength; ++i) {
                fields.concat(newEle[i].firstElementChild.querySelectorAll('[data-form="' + id + '"]'));
            }

            let length = fields.length;
            for (let i = 0; i < length; ++i) {
                fields[i].setAttribute('data-form', eleId);
            }

            // insert row values data into form
            length = values.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = newEle[j].firstElementChild.querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        // todo: handle multiple matches
                        // todo: urls remote src shouldn't start with http (it can but also the base path should be allowed or the current uri as basis... maybe define a data-tpl-value-srctype??? however this sounds stupid and might be too verbose or use http as identifier and use the fact that the request object uses internally the uri factory!!! sounds much smarter :))
                        // todo: implement this for other cases as well or potentially pull it out because it is very similar!!!
                        if (values[i].getAttribute('data-tpl-value').startsWith('http')
                            || values[i].getAttribute('data-tpl-value').startsWith('{')
                        ) {
                            const request = new Request(values[i].getAttribute('data-tpl-value'));
                            request.setResultCallback(200, function(xhr) {
                                matches[c].value = xhr.response;
                                // todo: the problem with this is that the response must only return the markdown or whatever is requested. It would be much nicer if it would also possible to define a path for the response in case a json object is returned which is very likely
                            });

                            request.send();
                        } else {
                            matches[c].value = self.getValueFromDataSource(values[i]);
                            matches[c].innerHTML = values[i].innerText;
                        }
                        // todo handle remote data (e.g. value ist coming from backend. do special check for http)
                    }
                    // todo: handle different input types
                }
            }

            // insert row text data into form
            length = text.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = newEle[j].firstElementChild.querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        // todo: handle multiple matches
                        matches[c].value = self.getTextFromDataSource(text[i]);
                        matches[c].innerHTML = text[i].innerHTML; // example for article instead of input field without value
                        // todo: handle different input types e.g. Article requires innerHTML instead of value
                        // todo handle remote data (e.g. value ist coming from backend. do special check for http)
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

            // todo: replace add button with save button and add cancel button
            jsOMS.addClass(this, 'hidden');

            const saveButtons = self.forms[id].getSave();
            length = saveButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.removeClass(saveButtons[i], 'hidden');
            }

            const cancelButtons = self.forms[id].getCancel();
            length = cancelButtons.length;
            for (let i = 0; i < length; ++i) {
                jsOMS.removeClass(cancelButtons[i], 'hidden');
            }

            // todo: on save button click insert data into hidden row and show hidden row again, delete form row
        });
    };

    /**
     * Bind inline cancel button
     *
     * @param {string} cancel Cancel button
     * @param {Object} id     Id
     *
     * @return {void}
     *
     * @since  1.0.0
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
     * @since  1.0.0
     */
    bindSaveInline(save, id)
    {
        const self = this;

        save.addEventListener('click', function () {
            const formElement = document.getElementById(id);
            const parentsTpl = [];
            const parentsContent = [];
            const selectors = formElement.getAttribute('data-ui-element').split(','),
                selectorLength = selectors.length;

            let values = [];
            let text = [];

            for (let i = 0; i < selectorLength; ++i) {
                // todo: similar logic is in updatable Inline and probably in External... pull out?
                // this handles selectors such as 'ancestor > child/or/sibling' and many more
                // todo: maybe move this to the library as an advanced ancestor function?
                let selector = selectors[i].trim(' ').split(' ');
                let closest = selector[0].trim();

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
                selector = selectors[i].trim(' ').split(' ');
                closest = selector[0].trim();
                subSelector = '';
                if (selector.length !== 0) {
                    selector.shift();
                    subSelector = selector.join(' ').trim() + ':not([data-marker=tpl])';
                } else {
                    closest += ':not([data-marker=tpl])';
                }

                parentsContent.push(
                    selector.length === 0 ? this.closest(closest) : this.closest(closest).querySelector(subSelector)
                );

                values = values.concat(Array.prototype.slice.call(parentsTpl[i].querySelectorAll('[data-tpl-value]')));
                text = text.concat(Array.prototype.slice.call(parentsTpl[i].querySelectorAll('[data-tpl-text]')));
            }

            // overwrite old values data in ui
            length = values.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = parentsContent[j].querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');


                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        // todo: handle multiple matches
                        matches[c].value = self.getValueFromDataSource(values[i]);
                        // todo handle remote data (e.g. value ist coming from backend. do special check for http)
                    }
                    // todo: handle different input types
                }
            }

            // overwrite old text data in ui
            length = text.length;
            for (let i = 0; i < length; ++i) {
                for (let j = 0; j < selectorLength; ++j) {
                    const matches = parentsContent[j].querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                    const matchLength = matches.length;
                    for (let c = 0; c < matchLength; ++c) {
                        // todo: handle multiple matches
                        matches[c].innerText = self.getTextFromDataSource(text[i]);
                        // todo: handle different input types
                        // todo handle remote data (e.g. value ist coming from backend. do special check for http)
                    }
                }
            }

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
     * @since  1.0.0
     */
    removeEditTemplate(ele, id)
    {
        const formElement = document.getElementById(id);
        const selectors = formElement.getAttribute('data-ui-element').split(','),
            selectorLength = selectors.length;

        for (let i = 0; i < selectorLength; ++i) {
            let selector = selectors[i].trim(' ').split(' ');
            let closest = selector[0].trim();

            let subSelector = '';
            if (selector.length !== 0) {
                selector.shift();
                subSelector = selector.join(' ').trim();
            }

            let content = selector.length === 0 ? ele.closest(closest) : ele.closest(closest).querySelector(subSelector);
            const tpls = content.parentNode.querySelectorAll('[data-marker=tpl]'),
                tplsLength = tpls.length;

            for (let j = 0; j < tplsLength; ++j) {
                tpls[j].parentNode.removeChild(tpls[j]);
            }

            content = selector.length === 0 ? ele.closest(closest) : ele.closest(closest).querySelector(subSelector);
            jsOMS.removeClass(content, 'hidden');
        }

        const saveButtons = this.forms[id].getSave();
        let length = saveButtons.length;
        for (let i = 0; i < length; ++i) {
            jsOMS.addClass(saveButtons[i], 'hidden');
        }

        const cancelButtons = this.forms[id].getCancel();
        length = cancelButtons.length;
        for (let i = 0; i < length; ++i) {
            jsOMS.addClass(cancelButtons[i], 'hidden');
        }

        const update = this.forms[id].getUpdate();
        length = update === null ? 0 : update.length;
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
     * @since  1.0.0
     */
    bindUpdatableExternal(update, id)
    {
        const self = this;

        update.addEventListener('click', function () {
            const formElement = document.getElementById(id);
            const parent = this.closest(formElement.getAttribute('data-ui-element'));
            const formId = formElement.getAttribute('data-ui-form');
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
                const matches = document.getElementById(formId).querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"');

                const matchLength = matches.length;
                for (let c = 0; c < matchLength; ++c) {
                    matches[c].value = self.getValueFromDataSource(values[i]);
                }
                // todo: handle different input types
                // todo handle remote data (e.g. value ist coming from backend. do special check for http)
            }

            // insert row text data into form
            length = text.length;
            for (let i = 0; i < length; ++i) {
                // todo: handle multiple matches
                const matches = document.getElementById(formId).querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"');

                // consider pulling this out because it exists like 3x2 = 6 times in a similar way or at least 3 times very similarly
                const matchLength = matches.length;
                for (let c = 0; c < matchLength; ++c) {
                    matches[c].value = self.getTextFromDataSource(text[i]);
                }
                // todo: handle different input types
                // todo handle remote data (e.g. value ist coming from backend. do special check for http)
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

    setValueOfElement(src, dest)
    {

    };

    setTextOfElement(src, dest)
    {

    };

    getValueFromDataSource(src)
    {
        return src.value;
    };

    getTextFromDataSource(src)
    {
        return src.value;
    };
};