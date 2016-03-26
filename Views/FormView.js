(function (jsOMS, undefined) {
    "use strict";
    jsOMS.Autoloader.defineNamespace('jsOMS.Views');
    
    jsOMS.Views.FormView = function (id) {
        this.id = id;

        this.initializeMembers();
        this.bind();
    };

    jsOMS.Views.FormView.prototype.initializeMembers = function() 
    {
        this.submitInjects = {};
        this.method = 'POST';
        this.action = '';
    };

    jsOMS.Views.FormView.prototype.getMethod = function()
    {
        return this.method;
    };

    jsOMS.Views.FormView.prototype.getAction = function() 
    {
        return this.action;
    };

    jsOMS.Views.FormView.prototype.getSubmit = function()
    {
        return document.getElementById(this.id).querySelectorAll('input[type=submit]')[0];
    };

    jsOMS.Views.FormView.prototype.injectSubmit = function(id, callback)
    {
        this.submitInjects[id] = callback;
    };

    jsOMS.Views.FormView.prototype.getFormElements = function(id)
    {
        let form = document.getElementById(id),
        selects = form.getElementsByTagName('select'),
        textareas = form.getElementsByTagName('textarea'),
        inputs = form.getElementsByTagName('input'),
        external = document.querySelectorAll('[form='+id+']'),
        elements = Array.prototype.slice.call(inputs).concat(Array.prototype.slice.call(selects), Array.prototype.slice.call(textareas), Array.prototype.slice.call(external)),
        length = elements.length;

        return elements;
    }

    jsOMS.Views.FormView.prototype.getData = function()
    {
        let data = {},
        elements = this.getFormElements(this.id),
        length = elements.length,
        i = 0;

        for(i = 0; i < length; i++) {
            data[elements[i].getAttribute('name')] = elements[i].value;
        }

        return data;
    };

    jsOMS.Views.FormView.prototype.getSubmitInjects = function()
    {
        return this.submitInjects;
    };

    jsOMS.Views.FormView.prototype.bind = function() 
    {
        this.clean();

        this.method = document.getElementById(this.id).method;
        this.action = document.getElementById(this.id).action;

        let elements = this.getFormElements(this.id),
        length = elements.length,
        i = 0;

        for(i = 0; i < length; i++) {
            switch(elements[i].tagName) {
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
            };
        }
    };

    jsOMS.Views.FormView.prototype.unbind = function() 
    {
        let elements = this.getFormElements(this.id),
        length = elements.length,
        i = 0;

        for(i = 0; i < length; i++) {
            switch(elements[i].tagName) {
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
            };
        }
    };

    jsOMS.Views.FormView.prototype.clean = function()
    {
        this.unbind();
        this.initializeMembers();
    };
}(window.jsOMS = window.jsOMS || {}));
