(function (jsOMS, undefined)
{
    "use strict";
    jsOMS.Autoloader.defineNamespace('jsOMS.Views');

    jsOMS.Views.FormView = function (id)
    {
        this.id = id;

        this.initializeMembers();
        this.bind();
        this.success = null;
    };

    jsOMS.Views.FormView.prototype.initializeMembers = function ()
    {
        this.submitInjects = [];
        this.method        = 'POST';
        this.action        = '';
    };

    jsOMS.Views.FormView.prototype.getMethod = function ()
    {
        return this.method;
    };

    jsOMS.Views.FormView.prototype.getAction = function ()
    {
        return this.action;
    };

    jsOMS.Views.FormView.prototype.getSubmit = function ()
    {
        return document.getElementById(this.id).querySelectorAll('input[type=submit]')[0];
    };

    jsOMS.Views.FormView.prototype.getSuccess = function ()
    {
        return this.success;
    };

    jsOMS.Views.FormView.prototype.setSuccess = function (callback)
    {
        this.success = callback;
    };

    jsOMS.Views.FormView.prototype.injectSubmit = function (id, callback)
    {
        this.submitInjects.push(callback);
    };

    jsOMS.Views.FormView.prototype.getFormElements = function ()
    {
        let form      = document.getElementById(this.id),
            selects   = form.getElementsByTagName('select'),
            textareas = form.getElementsByTagName('textarea'),
            inputs    = form.getElementsByTagName('input'),
            external  = document.querySelectorAll('[form=' + this.id + ']'),
            elements  = Array.prototype.slice.call(inputs).concat(Array.prototype.slice.call(selects), Array.prototype.slice.call(textareas), Array.prototype.slice.call(external));

        return elements;
    };

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

    jsOMS.Views.FormView.prototype.getId = function ()
    {
        return this.id;
    };

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

    jsOMS.Views.FormView.prototype.getElement = function ()
    {
        return document.getElementById(this.getId());
    };

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

    jsOMS.Views.FormView.prototype.getSubmitInjects = function ()
    {
        return this.submitInjects;
    };

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
            ;
        }
    };

    jsOMS.Views.FormView.prototype.unbind = function ()
    {
        let elements = this.getFormElements(),
            length   = elements.length,
            i        = 0;

        for (i = 0; i < length; i++) {
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
            ;
        }
    };

    jsOMS.Views.FormView.prototype.clean = function ()
    {
        this.unbind();
        this.initializeMembers();
    };
}(window.jsOMS = window.jsOMS || {}));
