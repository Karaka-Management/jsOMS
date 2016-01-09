/**
 * Form manager class.
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

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager = function (responseManager)
    {
        this.responseManager = responseManager;
        this.ignore = [];
        this.success = [];
        this.injectSelector = [];
        this.forms = [];
    };

    /**
     * Ignore form from handling.
     *
     * @param {string} [id] Form id
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.ignore = function (id)
    {
        this.ignore.push(id);
    };

    /**
     * Add submit callback.
     *
     * Used for calling callback before form is submitted. If there is a submit injection the injection itself has to execute the submit since only the injection knows when it finished.
     *
     * @todo: maybe let the injected callback call a continue() function in here which then continues the form submit process.
     *
     * @param {string} selector Form id
     * @param {requestCallback} callback Callback to execute before submit
     *
     * @return {boolean}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.injectSubmit = function (selector, callback)
    {
        if (!(selector in this.injectSelector)) {
            this.injectSelector[selector] = callback;

            return true;
        }

        return false;
    };

    /**
     * Set success callback for form.
     *
     * @param {string} id Form id
     * @param {requestCallback} callback Callback for success
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.setSuccess = function (id, callback)
    {
        this.success[id] = callback;
    };

    /**
     * Bind form.
     *
     * @param {string} [id] Form id
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.bind = function (id)
    {
        this.forms = [];

        if (typeof id !== 'undefined' && this.ignore.indexOf(id) === -1) {
            let form = document.getElementById(id);

            this.forms.push(form);
            this.bindElement(form);
        } else {
            let forms = document.getElementsByTagName('form');

            for (var i = 0; i < forms.length; i++) {
                if (this.ignore.indexOf(forms[i].id) === -1) {
                    this.forms.push(forms[i]);
                    this.bindElement(forms[i]);
                }
            }
        }
    };

    /**
     * Validating form element.
     *
     * @param {Object} e Form element
     *
     * @return {boolean}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.validateFormElement = function (e)
    {
        /** Validate on change */
        if (typeof e.dataset.validate !== 'undefined') {
            if (!(new RegExp(e.dataset.validate)).test(e.value)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Submit data.
     *
     * @param {Object} e Form element
     * @param {Object} data Data to submit
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.submit = function (e, data)
    {
        var request = new jsOMS.Request(),
            self = this;

        request.setData(data);
        request.setType('json');
        request.setUri(e.action);
        request.setMethod(e.method);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr)
        {
            console.log(xhr); // TODO: remove this is for error checking
            try {
                var o = JSON.parse(xhr.response),
                    response = Object.keys(o).map(function (k)
                    {
                        return o[k]
                    });

                for (var k = 0; k < response.length; k++) {
                    if (response[k] !== null) {
                        console.log(response[k]);

                        /* Handle success */
                        if (!self.success[e.id]) {
                            self.responseManager.execute(response[k].type, response[k]);
                        } else {
                            self.success[e.id](response[k].type, response[k]);
                        }
                    }
                }
            } catch (exception) {
                console.log('No valid json');
                return false;
            }
        });

        request.send();
    };

    /**
     * Collect all data associated with the form.
     *
     * @param {Object} e Form element
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.getData = function (e)
    {
        var input = e.getElementsByTagName('input'),
            select = e.getElementsByTagName('select'),
            textarea = e.getElementsByTagName('textarea'),
            datalist = e.getElementsByTagName('datalist'),
            formelements = Array.prototype.slice.call(input).concat(Array.prototype.slice.call(select), Array.prototype.slice.call(textarea), Array.prototype.slice.call(datalist)),
            self = this;

        var validForm = true,
            submitdata = {};

        for (var k = 0; k < formelements.length; k++) {
            if (!self.validateFormElement(e)) {
                validForm = false;
                // TODO: maybe jump out here since invalid and the elements get checked on changed by default
                // will this change in the future? if yes then I need to check all and also add markup/styles here
            }

            submitdata[formelements[k].getAttribute('name')] = formelements[k].value;
        }

        if (!validForm) {
            console.log('Form contains invalid data');
        }

        //noinspection JSUnresolvedVariable
        if (typeof e.dataset.formfields !== 'undefined') {
            try {
                //noinspection JSUnresolvedVariable
                var formdata = JSON.parse(e.dataset.formfields);

                Object.keys(formdata).forEach(function (key)
                {
                    if (formdata[key].startsWith('.') || formdata[key].startsWith('#')) {
                        var formElement = document.querySelector(formdata[key]);

                        if (formElement.type === 'checkbox') {
                            submitdata[key] = formElement.checked;
                        } else {
                            submitdata[key] = formElement.value;
                        }
                    }
                });
            } catch (exception) {
            }
        }

        return submitdata;
    };

    /**
     * Bind form.
     *
     * @param {Object} e Form element
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.FormManager.prototype.bindElement = function (e)
    {
        var input = e.getElementsByTagName('input'),
            select = e.getElementsByTagName('select'),
            textarea = e.getElementsByTagName('textarea'),
            datalist = e.getElementsByTagName('datalist'),
            buttons = (Array.prototype.slice.call(e.getElementsByTagName('button'))).concat(Array.prototype.slice.call(e.querySelectorAll('input[type=button]'))),
            submits = e.querySelectorAll('input[type=submit]'),
            self = this,
            submitdata = {};

        /** Handle submits */
        for (var j = 0; j < submits.length; j++) {
            submits[j].addEventListener('click', function (event)
            {
                submitdata = self.getData(e);

                /* Handle injection */
                var injected = false;

                for (var key in self.injectSelector) {
                    if (e.id === key) {
                        // This calls the injection callback which in returns executes the form submit afterwards
                        // @todo: maybe let provide a continue() function here which continues the execution;
                        self.injectSelector[key](e);

                        injected = true;
                    }
                }

                if (!injected) {
                    self.submit(e, submitdata);
                }

                jsOMS.preventAll(event);
            });
        }

        var i;
        /** Handle input */
        for (i = 0; i < input.length; i++) {
            /** Validate on change */
            if (typeof input[i].dataset.validate !== 'undefined') {
                var validator = new RegExp(input[i].dataset.validate);

                input[i].onkeyup = function (e)
                {
                    var selfL = this;
                    jsOMS.watcher(function (e)
                    {
                        if (!validator.test(selfL.value)) {
                            jsOMS.addClass(selfL, 'invalid');
                            console.log('wrong input:' + i);
                        }
                    }, 500);
                };
            }

            /** Request on change */
            if (typeof input[i].dataset.request !== 'undefined') {
                // handle request during typing
            }
        }

        /** Handle select */
        for (i = 0; i < select.length; i++) {
            /** Redirect on change */
            //noinspection JSUnresolvedVariable
            if (typeof select[i].dataset.redirect !== 'undefined') {
                select[i].onchange = function ()
                {
                    // TODO: use URI factory (which i still have to create :))
                    //noinspection JSUnresolvedVariable
                    window.document.href = e.action.replace('{' + select[i].dataset.redirect + '}', select[i].value);
                };
            }
        }

        /** Handle button */
        for (i = 0; i < buttons.length; i++) {
            /** Redirect in new window on click */
            //noinspection JSUnresolvedVariable
            if (typeof buttons[i].dataset.ropen !== 'undefined' || typeof buttons[i].dataset.redirect !== 'undefined') {
                buttons[i].addEventListener('click', function (event)
                {
                    //noinspection JSUnresolvedVariable
                    let ropen = typeof this.dataset.ropen !== 'undefined' ? this.dataset.ropen : this.dataset.redirect,
                        matches = ropen.match(new RegExp("\{[#\?\.a-zA-Z0-9]*\}", "gi")),
                        current = jsOMS.Uri.parseUrl(window.location.href),
                        value = null;

                    // TODO: find a way to use existing query parameters as well and just overwrite them if defined differently here
                    // eg. use &? in dummy urls to indicate that the url should use existing query parameters as well if not overwritten
                    for (var c = 0; c < matches.length; c++) {
                        var match = matches[c].substring(1, matches[c].length - 1);
                        if (match.indexOf('#') === 0) {
                            value = document.getElementById(match.substring(1, match.length)).value;
                        } else if (match.indexOf('.') === 0) {

                        } else if (match.indexOf('?') === 0) {
                            value = jsOMS.Uri.getUriQueryParameter(current.query, match.substring(1, match.length));
                        }

                        ropen = ropen.replace(matches[c], value);
                    }

                    //noinspection JSUnresolvedVariable
                    if (typeof this.dataset.ropen !== 'undefined') {
                        var win = window.open(ropen, '_blank');
                        win.focus();
                    } else {
                        window.document.href = ropen;
                    }
                });
            } else if (jsOMS.hasClass(buttons[i], 'form-list') && buttons[i].dataset.name !== 'undefined') {

                // TODO: maybe validate input value??? if not done during typing
                // TODO: maybe use id here instead? then this needs to get changed in the form builder
                let inputButton = document.querySelector('input[name=' + buttons[i].dataset.name + ']'),
                    list = document.querySelector('ul[data-name=l-' + buttons[i].dataset.name + ']'),
                    hidden = document.querySelector('input[type=hidden][name=h-' + buttons[i].dataset.name + ']');
                buttons[i].addEventListener('click', function (event)
                {

                    if (hidden.bind === undefined) {
                        hidden.bind = [];
                    }

                    hidden.bind.push(inputButton.bind ? inputButton.bind : inputButton.value);
                    hidden.value = JSON.stringify(hidden.bind);

                    var element = document.createElement('li');
                    element.appendChild(document.createTextNode(inputButton.value));
                    list.appendChild(element);
                });
            } else if (jsOMS.hasClass(buttons[i], 'form-table') && buttons[i].dataset.name !== 'undefined') {
                // TODO: maybe use id here instead? then this needs to get changed in the form builder
                let inputButton = document.querySelector('input[name=' + buttons[i].dataset.name + ']'),
                    table = document.querySelector('table[data-name=l-' + buttons[i].dataset.name + ']'),
                    hidden = document.querySelector('input[type=hidden][name=h-' + buttons[i].dataset.name + ']');

                buttons[i].addEventListener('click', function (event)
                {
                    // TODO: maybe validate input value??? if not done during typing

                    if (hidden.bind === undefined) {
                        hidden.bind = [];
                    }

                    hidden.bind.push(inputButton.bind ? inputButton.bind : inputButton.value);
                    hidden.value = JSON.stringify(hidden.bind);

                    // TODO: handle table add
                });
            }
        }
    };

    jsOMS.FormManager.prototype.getElements = function ()
    {
        return this.forms;
    };

    jsOMS.FormManager.prototype.count = function ()
    {
        return this.forms.length;
    };
}(window.jsOMS = window.jsOMS || {}));
