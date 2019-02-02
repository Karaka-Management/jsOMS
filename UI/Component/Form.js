/**
 * Form manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.UI */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Component');

    jsOMS.UI.Component.Form = class {
        /**
         * @constructor
         *
         * @param {Object} app Application
         *
         * @since 1.0.0
         */
        constructor (app)
        {
            this.app    = app;
            this.forms  = {};
            this.ignore = {};
        };

        /**
         * Get form
         *
         * @param {string} id Form Id
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        get (id)
        {
            return this.forms[id];
        };

        /**
         * Is form ignored?
         *
         * @param {string} id Form Id
         *
         * @return {boolean}
         *
         * @since 1.0.0
         */
        isIgnored (id)
        {
            return this.ignore.indexOf(id) !== -1;
        };

        /**
         * Unbind form
         *
         * @param {string} id Form Id
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        unbind (id)
        {

        };

        /**
         * Bind form
         *
         * @param {string} id Form Id (optional)
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        bind (id)
        {
            if (typeof id !== 'undefined' && typeof this.ignore[id] === 'undefined') {
                this.bindForm(id);
            } else {
                const forms = document.getElementsByTagName('form'),
                    length  = !forms ? 0 : forms.length;

                for (let i = 0; i < length; ++i) {
                    let formId = forms[i].getAttribute('id');
                    if (typeof formId !== 'undefined' && formId !== null && typeof this.ignore[formId] === 'undefined') {
                        this.bindForm(formId);
                    }
                }
            }
        };

        /**
         * Bind form
         *
         * @param {string} id Form Id
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        bindForm (id)
        {
            if (typeof id === 'undefined' || !id) {
                jsOMS.Log.Logger.instance.info('A form doesn\'t have an ID.');
                return;
            }

            const self     = this;
            this.forms[id] = new jsOMS.Views.FormView(id);

            this.unbind(id);

            const submits = this.forms[id].getSubmit(),
                length    = submits.length;

            for (let i = 0; i < length; ++i) {
                submits[i].addEventListener('click', function (event)
                {
                    jsOMS.preventAll(event);
                    self.submit(self.forms[id]);
                });
            }
        };

        /**
         * Unbind form
         *
         * @param {string} id Form Id
         *
         * @return {boolean}
         *
         * @since 1.0.0
         */
        unbindForm (id)
        {
            // todo: do i need the findex? can't i just use id?
            let findex = 0;

            if ((findex = this.forms[id]) !== 'undefined') {
                this.forms[id].unbind();
                this.forms.splice(findex, 1);

                return true;
            }

            return false;
        };

        /**
         * Submit form
         *
         * Calls injections first befor executing the actual form submit
         *
         * @param {Object} form Form object
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        submit (form)
        {
            /* Handle injects */
            const self  = this,
                injects = form.getSubmitInjects();
            let counter = 0;

            // todo: test if attach necessary (maybe already attached in event manager)
            // Register normal form behavior
            this.app.eventManager.attach(form.getId(), function ()
            {
                self.submitForm(form);
            }, true);

            // Run all injects first
            for (let property in injects) {
                if (injects.hasOwnProperty(property)) {
                    ++counter;
                    //this.app.eventManager.addGroup(form.getId(), counter);
                    const result = injects[property](form, form.getId());

                    if (result === false) {
                        return;
                    }
                } else {
                    jsOMS.Log.Logger.instance.warning('Invalid property.');
                }
            }

            if (counter < 1) {
                this.app.eventManager.trigger(form.getId());
            }
        };

        /**
         * Submit form data
         *
         * Submits the main form data
         *
         * @param {Object} form Form object
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        submitForm (form)
        {
            if (!form.isValid()) {
                this.app.notifyManager.send(
                    new jsOMS.Message.Notification.NotificationMessage(jsOMS.Message.Notification.NotificationLevel.INFO, jsOMS.lang.Info, jsOMS.lang.invalid_form), jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION
                );

                jsOMS.Log.Logger.instance.debug('Form "' + form.getId() + '" has invalid values.');
                return;
            }

            if (form.getMethod() !== jsOMS.Message.Request.RequestMethod.GET
                && Math.abs(Date.now() - form.getLastSubmit()) < 500
            ) {
                return;
            }

            form.updateLastSubmit();

            /* Handle default submit */
            const request = new jsOMS.Message.Request.Request(),
                self      = this;

            request.setData(form.getData());
            request.setType(jsOMS.Message.Response.ResponseType.JSON);
            request.setUri(form.getAction());
            request.setMethod(form.getMethod());
            request.setRequestHeader('Content-Type', 'application/json');
            request.setSuccess(function (xhr)
            {
                console.log(xhr.response);

                try {
                    const o            = JSON.parse(xhr.response),
                        response       = new jsOMS.Message.Response.Response(o);
                    let successInject  = null;

                    if (typeof o.status !== 'undefined') {
                        self.app.notifyManager.send(
                            new jsOMS.Message.Notification.NotificationMessage(o.status, o.title, o.message), jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION
                        );
                    }

                    if ((successInject = form.getSuccess()) !== null) {
                        successInject(response);
                    } else if (typeof response.get(0) !== 'undefined' && typeof response.get(0).type !== 'undefined') {
                        self.app.responseManager.run(response.get(0).type, response.get(0), request);
                    }
                } catch (e) {
                    console.log(e);

                    jsOMS.Log.Logger.instance.error('Invalid form response. \n'
                        + 'URL: ' + form.getAction() + '\n'
                        + 'Request: ' + JSON.stringify(form.getData()) + '\n'
                        + 'Response: ' + xhr.response
                    );
                }
            });

            request.setResultCallback(0, function (xhr)
            {
                self.app.notifyManager.send(
                    new jsOMS.Message.Notification.NotificationMessage(
                        jsOMS.Message.Notification.NotificationLevel.ERROR,
                        'Failure',
                        'Some failure happend'
                    ), jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION
                );
            });

            request.send();
        };

        /**
         * Count the bound forms
         *
         * @return {int}
         *
         * @since 1.0.0
         */
        count ()
        {
            return this.forms.length;
        };
    }
}(window.jsOMS = window.jsOMS || {}));
