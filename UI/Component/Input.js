import { Request } from '../../Message/Request/Request.js';

/**
 * Form manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Input {
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        this.visObs = null;
    };

    /**
     * Unbind input element
     *
     * @param {Object} input Input element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static unbind(input)
    {
        this.app.inputManager.getKeyboardManager().unbind(input);
        /** global: changeBind */
        input.removeEventListener('change', changeBind, false);
    };

    /**
     * Bind input element
     *
     * @param {Object} input Input element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static bindElement(input)
    {
        if (typeof input === 'undefined') {
            throw 'Input element required';
        }

        const type = input.type;

        const removeContentButton = input.parentNode.querySelector('.fa-times');
        if (removeContentButton !== null
            && type !== 'submit' && type !== 'button') {
            removeContentButton.addEventListener('click', function() {
                input.value = '';
                input.focus();
            });
        }
    };

    /**
     * Add remote datalist options
     *
     * This only applies for datalists that have remote options
     *
     * @param {Object} input    Input element
     * @param {Object} datalist Datalist element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static addRemoteDatalistOptions(input, datalist)
    {
        this.clearDatalistOptions(datalist);

        const request = new Request();
        request.setData(input.value);
        request.setType(ResponseType.JSON);
        request.setUri(datalist.getAttribute('data-list-src'));
        request.setMethod(RequestMethod.POST);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr)
        {
            try {
                const o            = JSON.parse(xhr.response),
                    response       = new Response(o),
                    responseLength = response.count();
                let tempResponse   = null,
                    success        = null;

                for (let k = 0; k < responseLength; ++k) {
                    tempResponse = response.getByIndex(k);

                    let option = null,
                        data   = tempResponse.getData(),
                        length = data.length;

                    for (let i = 0; i < length; ++i) {
                        option       = document.createElement('option');
                        option.value = tempResponse.value;
                        option.text  = tempResponse.text;

                        datalist.appendChild(option);
                    }
                }
            } catch (exception) {
                Logger.instance.error('Invalid JSON object: ' + xhr, 'FormManager');
            }
        });

        request.send();
    };

    /**
     * Remove all datalist options from datalist
     *
     * @param {Object} datalist Datalist element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static clearDatalistOptions(datalist)
    {
        const length = datalist.options.length;

        for (let i = 0; i < length; ++i) {
            datalist.remove(0);
        }
    };
};
