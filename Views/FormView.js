import { Input } from '../UI/Component/Input.js';

/**
 * Form view.
 *
 * The form view contains a single form and it's data elements. Form actions are no longer handled by
 * the browser but through this view. The view also provides additional functionality for non-default
 * form elements such as canvas etc.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 *
 * @tood Orange-Management/jsOMS#60
 *  On change listener
 *  Allow to add a on change listener in a form. This should result in automatic submits after changing a form.
 *  Consider the following cases to submit the form:
 *      * on Enter (all except textarea)
 *      * on Change (by using a timer)
 *      * on Leave (all elements)
 *  The listener should be defined in the form definition once and in js be applied to all form elements.
 */
export class FormView
{
    /**
     * @constructor
     *
     * @param {string} id Form id
     *
     * @since 1.0.0
     */
    constructor (id)
    {
        this.id = id;

        this.initializeMembers();
        this.bind();

        this.success    = null;
        this.finally    = null;
        this.lastSubmit = 0;
    };

    /**
     * Initialize members
     *
     * Pulled out since this is used in a cleanup process
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    initializeMembers ()
    {
        this.submitInjects = [];
        this.method        = 'POST';
        this.action        = '';
    };

    /**
     * Get method
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getMethod ()
    {
        return this.method;
    };

    /**
     * Get action
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getAction ()
    {
        return this.action;
    };

    /**
     * Get time of last submit
     *
     * @return {int}
     *
     * @since 1.0.0
     */
    getLastSubmit ()
    {
        return this.lastSubmit;
    };

    /**
     * Update last submit time
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    updateLastSubmit ()
    {
        this.lastSubmit = Math.floor(Date.now());
    };

    /**
     * Get submit elements
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getSubmit ()
    {
        // todo: question, exclude save/remove button? maybe not because they also submit data right?
        return document.querySelectorAll(
            '#' + this.id + ' input[type=submit], '
            + 'button[form=' + this.id + '][type=submit], '
            + '#' + this.id + ' button[type=submit], '
            + '.submit[data-form=' + this.id + '], '
            + '#' + this.id + ' .submit'
        );
    };

    /**
     * Get submit elements
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getImagePreviews() {
        // todo: question, exclude save/remove button? maybe not because they also submit data right?
        return document.querySelectorAll(
            '#' + this.id + ' input[type=file].preview'
        );
    };

    /**
     * Get edit elements
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getUpdate ()
    {
        return document.querySelectorAll(
            'button[form=' + this.id + '].update, '
            + '.update[data-form=' + this.id + '], '
            + '#' + this.id + ' .update'
        );
    };

    /**
    * Get save elements
    *
    * @return {NodeListOf<any>}
    *
    * @since 1.0.0
    */
    getSave ()
    {
        return document.querySelectorAll(
            'button[form=' + this.id + '].save, '
            + '.save[data-form=' + this.id + '], '
            + '#' + this.id + ' .save'
        );
    };

    /**
    * Get save elements
    *
    * @return {NodeListOf<any>}
    *
    * @since 1.0.0
    */
    getCancel ()
    {
        return document.querySelectorAll(
            'button[form=' + this.id + '].cancel, '
            + '.cancel[data-form=' + this.id + '], '
            + '#' + this.id + ' .cancel'
        );
    };

    /**
     * Get remove buttons
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getRemove ()
    {
        return document.querySelectorAll(
            'button[form=' + this.id + '].remove, '
            + '.remove[data-form=' + this.id + '], '
            + '#' + this.id + ' .remove'
        );
    };

    /**
     * Get add buttons
     *
     * The add button is different from the submit button since sometimes you want to show data to the user before you submit it.
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getAdd ()
    {
        return document.querySelectorAll(
            'button[form=' + this.id + '].add, '
            + '.add[data-form=' + this.id + '], '
            + '#' + this.id + ' .add'
        );
    };

    /**
     * Get success callback
     *
     * @return {callback}
     *
     * @since 1.0.0
     */
    getSuccess ()
    {
        return this.success;
    };

    /**
     * Set success callback
     *
     * @param {callback} callback Callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setSuccess (callback)
    {
        this.success = callback;
    };

    /**
     * Get finally callback
     *
     * @return {callback}
     *
     * @since 1.0.0
     */
    getFinally ()
    {
        return this.finally;
    };

    /**
     * Set finally callback
     *
     * @param {callback} callback Callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setFinally(callback) {
        this.finally = callback;
    };

    /**
     * Inject submit with post callback
     *
     * @param {callback} callback Callback
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    injectSubmit (callback)
    {
        this.submitInjects.push(callback);
    };

    /**
     * Get form elements
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    getFormElements ()
    {
        const form = document.getElementById(this.id);

        if (!form) {
            return [];
        }

        const selects      = form.getElementsByTagName('select'),
            textareas      = form.getElementsByTagName('textarea'),
            inputs         = [].slice.call(form.getElementsByTagName('input')),
            buttons        = form.getElementsByTagName('button'),
            canvas         = form.getElementsByTagName('canvas'),
            external       = [].slice.call(document.querySelectorAll(':not(#' + this.id + ') [form=' + this.id + ']')),
            special        = form.querySelectorAll('[data-name]'),
            specialExt     = document.querySelectorAll('form:not(#' + this.id + ') [data-form=' + this.id + '] [data-name]'),
            inputLength    = inputs.length,
            externalLength = external.length;

        for (let i = 0; i < inputLength; ++i) {
            if ((inputs[i].type === 'checkbox' || inputs[i].type === 'radio') && !inputs[i].checked) {
                delete inputs[i];
            }
        }

        for (let i = 0; i < externalLength; ++i) {
            if ((external[i].type === 'checkbox' || external[i].type === 'radio') && !external[i].checked) {
                delete external[i];
            }
        }

        return Array.prototype.slice.call(inputs).concat(
            Array.prototype.slice.call(selects),
            Array.prototype.slice.call(textareas),
            Array.prototype.slice.call(buttons),
            Array.prototype.slice.call(external),
            Array.prototype.slice.call(special),
            Array.prototype.slice.call(specialExt),
            Array.prototype.slice.call(canvas)
        ).filter(function(val) { return val; });
    };

    /**
     * Get unique form elements
     *
     * @param {Array} arr Form element array
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    getUniqueFormElements (arr)
    {
        let seen = {};

        return arr.filter(function(item) {
            return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
        });
    };

    /**
     * Get form data
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getData ()
    {
        const data   = {},
            elements = this.getFormElements(),
            length   = elements.length;

        let value = null;

        for (let i = 0; i < length; ++i) {
            if (elements[i].tagName.toLowerCase() === 'canvas') {
                value = elements[i].toDataURL('image/png');
            } else {
                if (typeof elements[i].value !== 'undefined') {
                    value = elements[i].value;
                } else if (typeof elements[i].getAttribute('data-value') !== 'undefined') {
                    value = elements[i].getAttribute('data-value');
                }
            }

            const id = FormView.getElementId(elements[i]);
            if (id === null) {
                continue;
            }

            // handle array data (e.g. table rows with same name)
            if (data.hasOwnProperty(id)) {
                if (data[id].constructor !== Array) {
                    data[id] = [data[id]];
                }

                data[id].push(value);
            } else {
                data[id] = value;
            }
        }

        // Create FormData
        /* todo: implement once we know how to handle this in the backend/php
        const formData = new FormData(),
            dataLength = data.length;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key].constructor === Array ? JSON.stringify(data[key]) : data[key]);
            }
        } */

        return data;
    };

    /**
     * Get form id
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getId ()
    {
        return this.id;
    };

    /**
     * Validate form
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    isValid ()
    {
        const elements = this.getFormElements(),
            length     = elements.length;

        try {
            for (let i = 0; i < length; ++i) {
                if ((elements[i].required && elements[i].value === '')
                    || (typeof elements[i].pattern !== 'undefined'
                    && elements[i].pattern !== ''
                    && !(new RegExp(elements[i].pattern)).test(elements[i].value))
                ) {
                    return false;
                }
            }
        } catch (e) {
            jsOMS.Log.Logger.instance.error(e);
        }

        return true;
    };

    /**
     * Get form element
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getElement ()
    {
        return document.getElementById(this.getId());
    };

    /**
     * Get form element id
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static getElementId (e)
    {
        if (e.getAttribute('name') !== null) {
            return e.getAttribute('name');
        } else if (e.getAttribute('id') !== null) {
            return e.getAttribute('id');
        } else if (e.getAttribute('data-name') !== null) {
            return e.getAttribute('data-name');
        } else if (e.getAttribute('type') !== null) {
            return e.getAttribute('type');
        }

        return null;
    };

    /**
     * Get submit injects
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    getSubmitInjects ()
    {
        return this.submitInjects;
    };

    /**
     * Bind form
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind ()
    {
        this.clean();

        const e = document.getElementById(this.id);

        if (!e) {
            return;
        }

        if (typeof e.attributes['method'] !== 'undefined') {
            this.method = e.attributes['method'].value;
        } else if (typeof e.attributes['data-method'] !== 'undefined') {
            this.method = e.attributes['data-method'].value;
        } else {
            this.method = 'EMPTY';
        }

        if (typeof e.attributes['action'] !== 'undefined') {
            this.action = e.attributes['action'].value;
        } else if (typeof e.attributes['data-uri'] !== 'undefined') {
            this.action = e.attributes['data-uri'].value;
        } else {
            this.action = 'EMPTY';
        }

        const elements = this.getFormElements(),
            length     = elements.length;

            for (let i = 0; i < length; ++i) {
            switch (elements[i].tagName.toLowerCase()) {
                case 'input':
                    Input.bindElement(elements[i]);
                    break;
                case 'select':
                    //this.bindSelect(elements[i]);
                    break;
                case 'textarea':
                    //this.bindTextarea(elements[i]);
                    break;
                case 'button':
                    //this.bindButton(elements[i]);
                    break;
                default:
            }
        }
    };

    /**
     * Unbind form
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    unbind ()
    {
        const elements = this.getFormElements(),
            length     = elements.length;

        for (let i = 0; i < length; ++i) {
            switch (elements[i].tagName) {
                case 'input':
                    Input.unbind(elements[i]);
                    break;
                case 'select':
                    this.bindSelect(elements[i]);
                    break;
                case 'textarea':
                    this.bindTextarea(elements[i]);
                    break;
                case 'button':
                    this.bindButton(elements[i]);
                    break;
                default:
            }
        }
    };

    /**
     * Clean form
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    clean ()
    {
        this.unbind();
        this.initializeMembers();
    };
};
