/**
 * Form view.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    "use strict";
    jsOMS.Autoloader.defineNamespace('jsOMS.Views');

    /**
     * @constructor
     *
     * @param {string} id Form id
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView = function (id)
    {
        this.id = id;

        this.initializeMembers();
        this.bind();
        this.success = null;
    };

    /**
     * Initialize members
     *
     * Pulled out since this is used in a cleanup process
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.initializeMembers = function ()
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
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getMethod = function ()
    {
        return this.method;
    };

    /**
     * Get action
     *
     * @return {string}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getAction = function ()
    {
        return this.action;
    };

    /**
     * Get submit elements
     *
     * @return {Object}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getSubmit = function ()
    {
        return document.getElementById(this.id).querySelectorAll('input[type=submit]')[0];
    };

    /**
     * Get success callback
     *
     * @return {callback}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getSuccess = function ()
    {
        return this.success;
    };

    /**
     * Set success callback
     *
     * @param {callback} callback Callback
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.setSuccess = function (callback)
    {
        this.success = callback;
    };

    /**
     * Inject submit with post callback
     *
     * @param {callback} callback Callback
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.injectSubmit = function (callback)
    {
        this.submitInjects.push(callback);
    };

    /**
     * Get form elements
     *
     * @return {Array}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getFormElements = function ()
    {
        let form      = document.getElementById(this.id),
            selects   = form.getElementsByTagName('select'),
            textareas = form.getElementsByTagName('textarea'),
            inputs    = form.getElementsByTagName('input'),
            external  = document.querySelectorAll('[form=' + this.id + ']');

        return Array.prototype.slice.call(inputs).concat(Array.prototype.slice.call(selects), Array.prototype.slice.call(textareas), Array.prototype.slice.call(external));
    };

    /**
     * Get form data
     *
     * @return {Object}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getData = function ()
    {
        let data     = {},
            elements = this.getFormElements(),
            length   = elements.length,
            i        = 0;

        for (i = 0; i < length; i++) {
            data[jsOMS.Views.FormView.getElementId(elements[i])] = elements[i].value;
        }

        return data;
    };

    /**
     * Get form id
     *
     * @return {string}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getId = function ()
    {
        return this.id;
    };

    /**
     * Validate form
     *
     * @return {boolean}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.isValid = function ()
    {
        let elements = this.getFormElements(),
            length   = elements.length;

        try {
            for (let i = 0; i < length; i++) {
                if ((elements[i].required && elements[i].value === '') || (typeof elements[i].pattern !== 'undefined' && elements[i].pattern !== '' && (new RegExp(elements[i].pattern)).test(elements[i].value))) {
                    return false;
                }
            }
        } catch (e) {
            console.log(e);
        }

        return true;
    };

    /**
     * Get form element
     *
     * @return {Object}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getElement = function ()
    {
        return document.getElementById(this.getId());
    };

    /**
     * Get form element id
     *
     * @return {string}
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.getElementId = function (e)
    {
        let id = e.getAttribute('name');

        if (id === null) {
            id = e.getAttribute('id');
        } else {
            return id;
        }

        if (id === null) {
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
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.getSubmitInjects = function ()
    {
        return this.submitInjects;
    };

    /**
     * Bind form
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.bind = function ()
    {
        this.clean();

        this.method = document.getElementById(this.id).method;
        this.action = document.getElementById(this.id).action;

        let elements = this.getFormElements(),
            length   = elements.length,
            i        = 0;

        for (i = 0; i < length; i++) {
            switch (elements[i].tagName) {
                case 'input':
                    jsOMS.UI.Input.bind(elements[i])
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
            }
        }
    };

    /**
     * Unbind form
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.unbind = function ()
    {
        let elements = this.getFormElements(),
            length   = elements.length;

        for (let i = 0; i < length; i++) {
            switch (elements[i].tagName) {
                case 'input':
                    jsOMS.UI.Input.unbind(elements[i])
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
            }
        }
    };

    /**
     * Clean form
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Views.FormView.prototype.clean = function ()
    {
        this.unbind();
        this.initializeMembers();
    };
}(window.jsOMS = window.jsOMS || {}));
