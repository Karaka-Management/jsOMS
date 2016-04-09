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
    jsOMS.Autoloader.defineNamespace('jsOMS.UI');
    
    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
     jsOMS.UI.FormManager = function(app)
     {
        this.app = app;
        this.forms = {};
        this.ignore = {};
    };

    jsOMS.UI.FormManager.prototype.get = function(id)
    {
        return this.forms[id];
    };

    jsOMS.UI.FormManager.prototype.isIgnored = function(id)
    {
        return this.ignore.indexOf(id) !== -1;
    };

    jsOMS.UI.FormManager.prototype.unbind = function(id) 
    {

    };

    jsOMS.UI.FormManager.prototype.bind = function(id) 
    {
        if (typeof id !== 'undefined' && typeof this.ignore[id] === 'undefined') {
            this.bindForm(id)
        } else {
            let forms = document.getElementsByTagName('form'),
            length = forms.length;

            for (var i = 0; i < length; i++) {
                if (typeof this.ignore[forms[i].id] === 'undefined') {
                    this.bindForm(forms[i].id);
                }
            }
        }
    };

    jsOMS.UI.FormManager.prototype.bindForm = function(id) 
    {
        if(typeof id === 'undefined' || !id) {
            this.app.logger.info('A form doesn\'t have an ID.');
            return;
        }

        let self = this;

        this.unbind(id);

        if(typeof this.ignore[id] === 'undefined') {
            this.forms[id] = new jsOMS.Views.FormView(id);
        }

        this.forms[id].getSubmit().addEventListener('click', function(event) {
            self.submit(self.forms[id]); 
            jsOMS.preventAll(event);
        });
    };

    jsOMS.UI.FormManager.prototype.unbindForm = function(id)
    {
        // todo: do i need the findex? can't i just use id?
        let findex = 0;

        if((findex = this.forms[id]) !== 'undefined') {
            this.forms[id].unbind();
            this.forms.splice(findex, 1);

            return true;
        }

        return false;
    };

    jsOMS.UI.FormManager.prototype.submit = function(form)
    {
        /* Handle injects */
        let injects = form.getSubmitInjects();
        for(let property in injects) {
            property();
        }

        /* Handle default submit */
        let request = new jsOMS.Message.Request.Request(),
        self = this;

        request.setData(form.getData());
        request.setType(jsOMS.Message.Response.ResponseType.JSON);
        request.setUri(form.getAction());
        request.setMethod(form.getMethod());
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr)
        {
            try {
                let o = JSON.parse(xhr.response),
                response = new jsOMS.Message.Response.Response(o),
                responseLength = response.count(),
                tempResponse = null,
                success = null;

                /* Handle responses (can be multiple response object) */
                for (let k = 0; k < responseLength; k++) {
                    tempResponse = response.getByIndex(k);

                    if((success = form.getSuccess()) !== null) {
                        success(tempResponse);
                    } else {
                        self.app.responseManager.run(tempResponse.type, tempResponse, request);
                    }
                }
            } catch (exception) {
                self.app.logger.error('Invalid Login response: ' + JSON.stringify(xhr));

                return false;
            }
        });

        request.send();
    };

    jsOMS.UI.FormManager.prototype.count = function ()
    {
        return this.forms.length;
    };
}(window.jsOMS = window.jsOMS || {}));
