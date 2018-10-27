/**
 * Form view.
 *
 * The form view contains a single form and it's data elements. Form actions are no longer handled by
 * the browser but through this view. The view also provides additional functionality for non-default
 * form elements such as canvas etc.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";
    /** @namespace jsOMS.Views */
    jsOMS.Autoloader.defineNamespace('jsOMS.Views');

    jsOMS.Views.FormView = class {
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
            this.lastSubmit = 0;
        };

        /**
         * Initialize members
         *
         * Pulled out since this is used in a cleanup process
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

        getLastSubmit ()
        {
            return this.lastSubmit;
        };

        updateLastSubmit ()
        {
            this.lastSubmit = Math.floor(Date.now());
        };

        /**
         * Get submit elements
         *
         * @return {Object}
         *
         * @since 1.0.0
         */
        getSubmit ()
        {
            return document.querySelectorAll(
                '#' + this.id + ' input[type=submit],'
                + ' button[form=' + this.id + '][type=submit],'
                + ' #' + this.id + ' button[type=submit]'
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
         * @since 1.0.0
         */
        setSuccess (callback)
        {
            this.success = callback;
        };

        /**
         * Inject submit with post callback
         *
         * @param {callback} callback Callback
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

            const selects   = form.getElementsByTagName('select'),
                textareas   = form.getElementsByTagName('textarea'),
                inputs      = [].slice.call(form.getElementsByTagName('input')),
                buttons     = form.getElementsByTagName('button'),
                canvas      = form.getElementsByTagName('canvas'),
                external    = document.querySelectorAll('[form=' + this.id + ']'),
                inputLength = inputs.length;

            for (let i = 0; i < inputLength; ++i) {
                if (inputs[i].type === 'checkbox' && !inputs[i].checked) {
                    delete inputs[i];
                }

                // todo: handle radio here as well
            }

            return this.getUniqueFormElements(
                Array.prototype.slice.call(inputs).concat(
                    Array.prototype.slice.call(selects),
                    Array.prototype.slice.call(textareas),
                    Array.prototype.slice.call(buttons),
                    Array.prototype.slice.call(external)
                )
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
                    value = elements[i].value;
                }

                data[jsOMS.Views.FormView.getElementId(elements[i])] = value;
            }

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
            let id = e.getAttribute('name');

            if (!id) {
                id = e.getAttribute('id');
            } else {
                return id;
            }

            if (!id) {
                id = e.getAttribute('type');
            } else {
                return id;
            }

            return id;
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
         * @since 1.0.0
         */
        bind ()
        {
            this.clean();

            const e = document.getElementById(this.id);

            if (!e) {
                return;
            }

            this.method = typeof e.attributes['method'] !== 'undefined' ? e.attributes['method'].value : 'EMPTY';
            this.action = typeof e.action !== 'undefined' ? e.action : 'EMPTY';

            const elements = this.getFormElements(),
                length     = elements.length;

            for (let i = 0; i < length; ++i) {
                switch (elements[i].tagName) {
                    case 'input':
                        jsOMS.UI.Input.bind(elements[i]);
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
         * Unbind form
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
                        jsOMS.UI.Input.unbind(elements[i]);
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
         * @since 1.0.0
         */
        clean ()
        {
            this.unbind();
            this.initializeMembers();
        };
    }
}(window.jsOMS = window.jsOMS || {}));
