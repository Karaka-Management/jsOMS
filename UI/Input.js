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
    jsOMS.UI.Input.unbind = function(input)
    {
        this.app.inputManager.getKeyboardManager().unbind(input);
        input.removeEventListener('change', changeBind, false);
    };

    jsOMS.UI.Input.bind = function(input)
    {
        let self = this;
        
        input.addEventListener('change', function changeBind(event) {
            /* Handle remote datalist/autocomplete input element */
            let listId, list;
            if((listId = this.getAttribute('list')) !== 'undefined' && (list = document.getElementById(listId)).getAttribute('data-list-src') !== 'undefined') {
                self.addRemoteDatalistOptions(this, list);
            }

            /* Handle html defined functions */
            let change;
            if((change = this.getAttribute('data-change-func')) !== 'undefined') {
                change(this);
            }

            /* Handle pre-defined dynamic change events */
            let ref;
            if(ref = this.getAttribute('data-ref') !== 'undefined') {
                let e = document.getElementById(ref);

                switch(e.tagName) {
                    case 'ul':
                        break;
                    case 'table':
                        break;
                };
            }
        });

        let dataButton;
        if((dataButton = input.getAttribute('data-button')) !== 'undefined') {
            this.app.inputManager.getKeyboardManager().bind(input, 13, function() { 
                document.getElementById(dataButton).click(); 
            });
        }
    };

    jsOMS.UI.Input.addRemoteDatalistOptions = function(input, datalist) 
    {
        this.clearDatalistOptions(datalist);

        let request = new Request();
        request.setData(input.value);
        request.setType(jsOMS.Message.Response.ResponseType.JSON);
        request.setUri(datalist.getAttribute('data-list-src'));
        request.setMethod(jsOMS.Message.Request.RequestMethod.POST);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr) {
            try {
                let o = JSON.parse(xhr.response),
                response = new Response(o),
                responseLength = response.count(),
                tempResponse = null,
                success = null;

                for (let k = 0; k < responseLength; k++) {
                    tempResponse = response.getByIndex(k);
                    console.log(tempResponse);

                    let option = null,
                    data = tempResponse.getData(),
                    length = data.length;

                    for(let i = 0; i < length; i++) {
                        option = document.createElement('option');
                        option.value = tempResponse.value;
                        option.text = tempResponse.text;
                        
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

    jsOMS.UI.Input.clearDatalistOptions = function(datalist) 
    {
        let length = datalist.options.length,
        i = 0;

        for(i = 0; i < length; i++) {
            datalist.remove(0);
        }
    };
}(window.jsOMS = window.jsOMS || {}));
