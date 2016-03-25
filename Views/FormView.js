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
                    this.bindInput(elements[i]);
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

    jsOMS.FormView.prototype.bindInput = function(input) 
    {
        let listId, list,
        self = this;

        if((listId = input.getAttribute('list')) !== 'undefined' && (list = document.getElementById(listId)).getAttribute('data-list-src') !== 'undefined') {
            input.addEventListener('change', function(event) {
                self.addRemoteDatalistOptions(input, list);
            });
        }
    };

    jsOMS.FormView.prototype.addRemoteDatalistOptions = function(input, datalist) 
    {
        this.clearDatalistOptions(datalist);

        let request = new Request();
        request.setData(input.value);
        request.setType('json');
        request.setUri(datalist.getAttribute('data-list-src'));
        request.setMethod(jsOMS.EnumRequestMethod.POST);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr) {
            try {
                let o = JSON.parse(xhr.response),
                response = new Response(o),
                responseLength = response.count(),
                tempResponse = null,
                success = null;

                for (let k = 0; k < responseLength; k++) {
                    tempResponse = response.get(k);
                    console.log(tempResponse);

                    let option = null,
                    data = tempResponse.getData(),
                    length = data.length;

                    for(let i = 0; i < length; i++) {
                        option = document.createElement('option');
                        datalist.appendChild(option);
                    }
                }
            } catch (exception) {
                self.app.logger.error('Invalid JSON object: ' + xhr, 'FormManager')
                return false;
            }
        });

        request.send();
    };

    jsOMS.FormView.prototype.clearDatalistOptions = function(datalist) 
    {
        let length = datalist.options.length,
        i = 0;

        for(i = 0; i < length; i++) {
            datalist.remove(0);
        }
    };
}(window.jsOMS = window.jsOMS || {}));
