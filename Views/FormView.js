(function (jsOMS, undefined) {
    "use strict";
    
    jsOMS.FormView = function (element) {
        this.id = element.getAttribute('id');
        this.formElement = element;

        this.inputElement = {};
        this.textarea = {};
        this.button = {};
        this.select = {};
    };

    jsOMS.FormView.prototype.bind = function() 
    {
        this.bindInput();
        this.bindTextarea();
        this.bindButton();
        this.bindSelect();
    }

    jsOMS.FormView.prototype.bindInput = function() 
    {
        var self = this;

        let inputs = this.formElement.getElementsByTagName('input');

        Object.keys(inputs).forEach(function (key, element) {
            self.inputElement[element.getAttribute('id')] = {
                id: element.getAttribute('id'),
                type: element.getAttribute('type')
            };
        });
    }

    jsOMS.FormView.prototype.bind
}(window.jsOMS = window.jsOMS || {}));
