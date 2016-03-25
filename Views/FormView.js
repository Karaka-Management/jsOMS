(function (jsOMS, undefined) {
    "use strict";
    
    jsOMS.FormView = function (id) {
        this.id = id;

        this.initializeMembers();
        this.bind();
    };

    jsOMS.FormView.prototype.initializeMembers = function() 
    {
        this.submitInjects = {};
        this.method = 'POST';
        this.action = '';
    };

    jsOMS.FormView.prototype.getMethod = function()
    {
        return this.method;
    };

    jsOMS.FormView.prototype.getAction = function() 
    {
        return this.action;
    };

    jsOMS.FormView.prototype.getSubmit = function()
    {
        return document.getElementById(this.id).querySelectorAll('input[type=submit]')[0];
    };

    jsOMS.FormView.prototype.injectSubmit = function(id, callback)
    {
        this.submitInjects[id] = callback;
    };

    jsOMS.FormView.prototype.getData = function()
    {
        let data = {},
        form = document.getElementById(this.id),
        selects = form.getElementsByTagName('select'),
        textareas = form.getElementsByTagName('textarea'),
        inputs = form.getElementsByTagName('input'),
        external = document.querySelectorAll('[form='+this.id+']'),
        elements = Array.prototype.slice.call(inputs).concat(Array.prototype.slice.call(selects), Array.prototype.slice.call(textareas), Array.prototype.slice.call(external)),
        length = elements.length,
        i = 0;

        for(i = 0; i < length; i++) {
            data[elements[i].getAttribute('name')] = elements[i].value;
        }

        return data;
    };

    jsOMS.FormView.prototype.getSubmitInjects = function()
    {
        return this.submitInjects;
    };

    jsOMS.FormView.prototype.bind = function() 
    {
        this.clean();

        this.method = document.getElementById(this.id).method;
        this.action = document.getElementById(this.id).action;

        let form = document.getElementById(this.id),
        selects = form.getElementsByTagName('select'),
        textareas = form.getElementsByTagName('textarea'),
        inputs = form.getElementsByTagName('input'),
        external = document.querySelectorAll('[form='+this.id+']'),
        elements = Array.prototype.slice.call(inputs).concat(Array.prototype.slice.call(selects), Array.prototype.slice.call(textareas), Array.prototype.slice.call(external)),
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

    jsOMS.FormView.prototype.unbind = function() 
    {
        
    };

    jsOMS.FormView.prototype.clean = function()
    {
        this.unbind();
        this.initializeMembers();
    };
}(window.jsOMS = window.jsOMS || {}));
