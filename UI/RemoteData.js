import { jsOMS }               from '../Utils/oLib.js';
import { Request }             from '../Message/Request/Request.js';
import { RequestMethod }       from '../Message/Request/RequestMethod.js';
import { RequestType }         from '../Message/Request/RequestType.js';
import { GeneralUI }           from './GeneralUI.js';

/**
 * Remote data class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class RemoteData
{
    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     */
    constructor (app)
    {
        this.app = app;
    };

    /**
     * Bind element
     *
     * @param {Object} [element] DOM element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind ()
    {
        const elements = document.querySelectorAll('.oms-remotecontainer');
        const length   = !elements ? 0 : elements.length;

        setInterval(function () {
            for (let i = 0; i < length; ++i) {
                const uri = elements[i].getAttribute('data-remote-uri');

                /** @var {HTMLElement} uiContainer Container which holds all elements (e.g. div, tbody) */
                const uiContainer = elements[i];

                const request = new Request();

                request.setData({});
                request.setType(RequestType.JSON);
                request.setUri(uri);
                request.setMethod(RequestMethod.GET);
                request.setSuccess(function (xhr) {
                    const data = JSON.parse(xhr.response);

                    const responseLength = data.length;
                    let currentElement   = null;

                    for (let i = 0; i < responseLength; ++i) {
                        /** @var {HTMLElement} childElements Child elements in the container which contain the data elements */
                        const childElements = uiContainer.querySelectorAll(uiContainer.getAttribute('data-ui-element'));

                        currentElement = childElements.length - 1 < i ? null : childElements[i];

                        // if no element exists or the element is different
                        // -> add it to the container at the current position
                        if (currentElement === null
                            || currentElement.getAttribute('data-id') !== data[i].id
                        ) {
                            /** @var {string[]} addTpl Templates to add to container (usually only one) */
                            const addTpl       = uiContainer.getAttribute('data-add-tpl').split(',');
                            const addTplLength = addTpl.length;

                            /** @var {string[]} values Values to add (values can be different from the displayed text) */
                            let values = [];

                            /** @var {string[]} texts Text to add (values can be different from the displayed text) */
                            let texts = [];

                            /**
                             * @var {Element[]} newElements Array of added elements
                             *                              (this is actually only one element/model/object but sometimes one
                             *                              element might be split up into multiple templates)
                             */
                            const newElements = [];

                            for (let j = 0; j < addTplLength; ++j) {
                                // add template to elements which should be added to the DOM
                                newElements.push(document.querySelector(addTpl[j]).content.cloneNode(true));

                                /** @var {Element} dataOriginElement Element where the value data comes from  */
                                const dataOriginElement = newElements[j].firstElementChild;

                                values = values.concat(
                                        dataOriginElement.hasAttribute('data-tpl-value')
                                            ? dataOriginElement
                                            : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-value]'))
                                    );
                                texts  = texts.concat(
                                        dataOriginElement.hasAttribute('data-tpl-text')
                                            ? dataOriginElement
                                            : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-text]'))
                                    );
                            }

                            // insert values into element (populate values)
                            RemoteData.setRemoteData('text', texts, data[i]);

                            // insert text into element (populate values)
                            RemoteData.setRemoteData('value', values, data[i]);

                            // add new elements to the DOM
                            for (let j = 0; j < addTplLength; ++j) {
                                if (currentElement === null) {
                                    uiContainer.appendChild(newElements[j].firstElementChild);
                                } else {
                                    uiContainer.insertBefore(newElements[j].firstElementChild, currentElement);
                                }
                            }

                            continue;
                        } else if (currentElement !== null
                            && currentElement.getAttribute('data-id') === data[i].id
                        ) {
                            /** @var {string[]} values Values to add (values can be different from the displayed text) */
                            let values = [];

                            /** @var {string[]} texts Text to add (values can be different from the displayed text) */
                            let texts = [];

                            /** @var {Element} dataOriginElement Element where the value data comes from  */
                            const dataOriginElement = currentElement;

                            values = values.concat(
                                    dataOriginElement.hasAttribute('data-tpl-value')
                                        ? dataOriginElement
                                        : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-value]'))
                                );
                            texts  = texts.concat(
                                    dataOriginElement.hasAttribute('data-tpl-text')
                                        ? dataOriginElement
                                        : Array.prototype.slice.call(dataOriginElement.querySelectorAll('[data-tpl-text]'))
                                );

                            // @todo don't just overwrite data, check if data is different

                            // insert values into element (populate values)
                            RemoteData.setRemoteData('text', texts, data[i]);

                            // insert text into element (populate values)
                            RemoteData.setRemoteData('value', values, data[i]);
                        }
                    }

                    /** @var {HTMLElement} childElements Child elements in the container which contain the data elements */
                    const childElements = elements[i].querySelectorAll(elements[i].getAttribute('data-ui-element'));
                    const childLength   = childElements.length;

                    for (let i = responseLength; i < childLength; ++i) {
                        uiContainer.removeChild(childElements[i]);
                    }
                });

                request.send();
            }
        }, 30 * 1000);
    };

    static setRemoteData (type, elements, data = {})
    {
        const elementsLength = elements.length;
        for (let i = 0; i < elementsLength; ++i) {
            const path = elements[i].hasAttribute('data-tpl-' + type + '-path')
                ? elements[i].getAttribute('data-tpl-' + type + '-path')
                : null;

            if (path === null) {
                continue;
            }

            if (type === 'value') {
                GeneralUI.setValueOfElement(elements[i], jsOMS.getArray(path, data));
            } else {
                GeneralUI.setTextOfElement(elements[i], jsOMS.getArray(path, data));
            }
        }
    };
};
