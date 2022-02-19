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

        this.success    = null;
        this.finally    = null;
        this.lastSubmit = 0;

        this.form = null;

        this.initializeMembers();
        this.bind();
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

    isOnChange ()
    {
        const isOnChange = this.getFormElement().getAttribute('data-on-change');

        return (isOnChange === 'true' || isOnChange === '1');
    };

    /**
     * Get submit elements
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getSubmit (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelectorAll(
            '#' + this.id + ' input[type=submit], '
            + 'button[form=' + this.id + '][type=submit], '
            + '#' + this.id + ' button[type=submit], '
            + '.submit[data-form=' + this.id + '], '
            + '#' + this.id + ' .submit'
            + (e !== null ? '  .submit' : '')
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
    getUpdate (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelectorAll(
            'button[form=' + this.id + '].update-form, '
            + '.update-form[data-form=' + this.id + '], '
            + '#' + this.id + ' .update-form'
            + (e !== null ? ', .update-form' : '')
        );
    };

    /**
    * Get save elements
    *
    * @return {NodeListOf<any>}
    *
    * @since 1.0.0
    */
    getSave (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelectorAll(
            'button[form=' + this.id + '].save-form, '
            + '.save-form[data-form=' + this.id + '], '
            + '#' + this.id + ' .save-form'
            + (e !== null ? ', .save-form' : '')
        );
    };

    /**
    * Get save elements
    *
    * @return {NodeListOf<any>}
    *
    * @since 1.0.0
    */
    getCancel (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelectorAll(
            'button[form=' + this.id + '].cancel-form, '
            + '.cancel-form[data-form=' + this.id + '], '
            + '#' + this.id + ' .cancel-form'
            + (e !== null ? ', .cancel-form' : '')
        );
    };

    /**
     * Get remove buttons
     *
     * @return {NodeListOf<any>}
     *
     * @since 1.0.0
     */
    getRemove (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelectorAll(
            'button[form=' + this.id + '].remove-form, '
            + '.remove-form[data-form=' + this.id + '], '
            + '#' + this.id + ' .remove-form'
            + (e !== null ? ', .remove-form' : '')
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
    getAdd (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelectorAll(
            'button[form=' + this.id + '].add-form, '
            + '.add-form[data-form=' + this.id + '], '
            + '#' + this.id + ' .add-form'
            + (e !== null ? ', .add-form' : '')
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
     * @param {object} container Data container, null = entire form or element e.g. table row
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    getFormElements (container = null)
    {
        const form = container === null ? this.getFormElement() : container;

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
            specialExt     = document.querySelectorAll(':not(#' + this.id + ') [data-form=' + this.id + ']'),
            inputLength    = inputs.length,
            externalLength = external.length,
            specialLength  = specialExt.length;

        for (let i = 0; i < inputLength; ++i) {
            if (inputs[i] === undefined
                || (typeof inputs[i] !== 'undefined'
                && (inputs[i].type === 'checkbox' || inputs[i].type === 'radio')
                && !inputs[i].checked)
            ) {
                delete inputs[i];
            }
        }

        for (let i = 0; i < externalLength; ++i) {
            if (external[i] === undefined
                || (typeof external[i] !== 'undefined'
                && form.contains(external[i]))
            ) {
                delete external[i];
                continue;
            }

            if ( external[i] === undefined
                || (typeof external[i] !== 'undefined'
                && (external[i].type === 'checkbox' || external[i].type === 'radio')
                && !external[i].checked)
            ) {
                delete external[i];
            }
        }

        for (let i = 0; i < specialLength; ++i) {
            if (specialExt[i] === undefined
                || (typeof specialExt[i] !== 'undefined'
                && form.contains(specialExt[i]))
            ) {
                delete specialExt[i];
                continue;
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

    getFirstInputElement (e = null)
    {
        const parent = e === null ? document : e;

        return parent.querySelector(
            '#' + this.id + ' input, '
            + '#' + this.id + ' textarea, '
            + '#' + this.id + ' select, '
            + '[form=' + this.id + '], '
            + '[data-form=' + this.id + ']'
        );
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
     * @param {container} Data container. Null = entire form, container e.g. single row in a table
     *
     * @return {FormData}
     *
     * @since 1.0.0
     */
    getData (container = null)
    {
        const data   = {},
            formData = new FormData(),
            elements = this.getFormElements(container),
            length   = elements.length;

        let value = null;

        for (let i = 0; i < length; ++i) {
            const id = FormView.getElementId(elements[i]);
            if (id === null) {
                continue;
            }

            if (elements[i].tagName.toLowerCase() === 'canvas') {
                value = elements[i].toDataURL('image/png');
            } else if (elements[i].tagName.toLowerCase() === 'input' && elements[i].type === 'file') {
                const filesLength = elements[i].files.length;

                for (let j = 0; j < filesLength; ++j) {
                    formData.append(id + j, elements[i].files[j]);
                }
            } else if (elements[i].tagName.toLowerCase() === 'iframe') {
                const iframeElements = Array.prototype.slice.call(
                        elements[i].contentWindow.document.querySelectorAll('[form=' + this.id + ']')
                    ).concat(
                        Array.prototype.slice.call(
                            elements[i].contentWindow.document.querySelectorAll('[data-form=' + this.id + '] [data-name]')
                        )
                    ).filter(function(val) { return val; });

                const iframeLength = iframeElements.length;
                for (let j = 0; j < iframeLength; ++j) {
                    value = iframeElements[j].value;

                    const iframeId = FormView.getElementId(iframeElements[j]);
                    if (data.hasOwnProperty(iframeId)) {
                        if (data[iframeId].constructor !== Array) {
                            data[iframeId] = [data[iframeId]];
                        }

                        data[iframeId].push(value);
                    } else {
                        data[iframeId] = value;
                    }
                }

                continue;
            } else {
                if (typeof elements[i].value !== 'undefined') {
                    value = elements[i].value;
                } else if (typeof elements[i].getAttribute('data-value') !== 'undefined') {
                    value = elements[i].getAttribute('data-value');
                }
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

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key] !== null && data[key].constructor === Array ? JSON.stringify(data[key]) : data[key]);
            }
        }

        return formData;
    };

    resetValues ()
    {
        const elements = this.getFormElements(),
            length     = elements.length;

        const form = this.getFormElement();
        form.reset();

        for (let i = 0; i < length; ++i) {
            const id = FormView.getElementId(elements[i]);
            if (id === null) {
                continue;
            }

            if (elements[i].tagName.toLowerCase() === 'canvas') {
                elements[i].clearRect(0, 0, elements[i].width, elements[i].height);
            }

            if (elements[i].getAttribute('data-value') !== null) {
                elements[i].setAttribute('data-value', '');
            }
        }
    }

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

    getFormElement ()
    {
        return this.form === null ? (this.form = document.getElementById(this.id)) : this.form;
    };

    /**
     * Validate form
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    isValid (data)
    {
        const elements = typeof data === 'undefined' ? this.getFormElements() : data;
        const length   = elements.length;

        try {
            for (let i = 0; i < length; ++i) {
                if ((elements[i].required && elements[i].value === '')
                    || (typeof elements[i].pattern !== 'undefined'
                        && elements[i].pattern !== ''
                        && !(new RegExp(elements[i].pattern)).test(elements[i].value))
                        || (typeof elements[i].maxlength !== 'undefined' && elements[i].maxlength !== '' && elements[i].value.length > elements[i].maxlength)
                        || (typeof elements[i].minlength !== 'undefined' && elements[i].minlength !== '' && elements[i].value.length < elements[i].minlength)
                        || (typeof elements[i].max !== 'undefined' && elements[i].max !== '' && elements[i].value > elements[i].max)
                        || (typeof elements[i].min !== 'undefined' && elements[i].min !== '' && elements[i].value < elements[i].min)
                ) {
                    return false;
                }
            }
        } catch (e) {
            jsOMS.Log.Logger.instance.error(e);
        }

        return true;
    };

    getInvalid (data)
    {
        const elements = typeof data === 'undefined' ? this.getFormElements() : data;
        const length   = elements.length;

        const invalid = [];

        try {
            for (let i = 0; i < length; ++i) {
                if ((elements[i].required && elements[i].value === '')
                    || (typeof elements[i].pattern !== 'undefined'
                        && elements[i].pattern !== ''
                        && !(new RegExp(elements[i].pattern)).test(elements[i].value))
                    || (typeof elements[i].maxlength !== 'undefined' && elements[i].maxlength !== '' && elements[i].value.length > elements[i].maxlength)
                    || (typeof elements[i].minlength !== 'undefined' && elements[i].minlength !== '' && elements[i].value.length < elements[i].minlength)
                    || (typeof elements[i].max !== 'undefined' && elements[i].max !== '' && elements[i].value > elements[i].max)
                    || (typeof elements[i].min !== 'undefined' && elements[i].min !== '' && elements[i].value < elements[i].min)
                ) {
                    invalid.push(elements[i]);
                }
            }
        } catch (e) {
            jsOMS.Log.Logger.instance.error(e);
        }

        return invalid;
    }

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

        const e = this.getFormElement();

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
