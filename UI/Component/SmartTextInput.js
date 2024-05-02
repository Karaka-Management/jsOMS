import { jsOMS } from '../../Utils/oLib.js';
import { Request } from '../../Message/Request/Request.js';

/**
 * @typedef {import('../../Event/EventManager.js').EventManager} EventManager
 */

/**
 * Smart input class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 2.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class SmartTextInput
{
    /**
     * @constructor
     *
     * @param {Element} e Element to bind
     *
     * @since 1.0.0
     */
    constructor (e)
    {
        /** @type {string} id */
        this.id = e.id;

        /** @type {Element} e */
        this.inputComponent = e;

        this.inputField = this.inputComponent.getElementsByClassName('input-div')[0];
        // @todo Implement. Then find all data-tpl-value and data-tpl-text which are the elements to fill
        this.dataContainer = this.inputField.getAttribute('data-container') === ''
            ? this.inputComponent
            : this.inputField.closest(this.inputField.getAttribute('data-container'));
        this.dataList   = this.inputComponent.getElementsByClassName('input-datalist')[0];
        this.dataListBody   = this.inputComponent.getElementsByClassName('input-datalist-body')[0];
        this.dataTpl    = document.getElementsByClassName('input-data-tpl')[0];
        this.src        = this.inputComponent.getAttribute('data-src');

        const self = this;
        this.inputField.addEventListener('focus', function (e) {
            self.dataList.classList.remove('vh');
        });

        this.inputField.addEventListener('click', function (e) {
            self.dataList.classList.remove('vh');
        });

        this.inputField.addEventListener('focusout', function (e) {
            setTimeout(function () {
                self.dataList.classList.add('vh');
                self.clearDataListSelection(self);

                if (self.inputField.textContent === '') {
                    self.inputField.setAttribute('data-value', '');
                }

                if (self.inputField.classList.contains('required') && self.inputField.getAttribute('data-value') === '') {
                    self.inputField.classList.add('invalid');
                } else {
                    self.inputField.classList.remove('invalid');
                }

                const list   = self.dataListBody.getElementsByTagName('div');
                const length = list.length;

                if (length > 0 && self.inputField.getAttribute('data-value') !== '') {
                    let isValid = false;
                    for (let i = 0; i < length; ++i) {
                        if (list[i].textContent === self.inputField.textContent) {
                            isValid = true;

                            break;
                        }
                    }

                    if (!isValid) {
                        self.inputField.classList.add('invalid');
                    } else {
                        self.inputField.classList.remove('invalid');
                    }
                }
            }, 100);
        });

        this.inputField.addEventListener('keydown', function (e) {
            if (self.dataList.classList.contains("vh")) {
                self.dataList.classList.remove('vh');
            }

            if (e.keyCode === 13 || e.keyCode === 40) {
                jsOMS.preventAll(e);
            }

            if (e.keyCode === 40) {
                // down-key
                self.selectOption(self.dataListBody.firstElementChild);
                self.dataList.focus();
                jsOMS.preventAll(e);
            } else {
                // handle change delay
                self.inputTimeDelay({ id: self.id, delay: 300 }, self.changeCallback, self, e);
            }
        });

        // @bug This is never getting run?!
        this.dataList.addEventListener('keydown', function (e) {
            jsOMS.preventAll(e);

            if (e.code === 'Escape' || e.code === 'Delete' || e.code === 'Backspace') {
                // handle esc, del to go back to input field
                self.inputField.focus();
                self.clearDataListSelection(self);
            } else if (e.code === 'ArrowUp') {
                // handle up-click
                if (document.activeElement.previousElementSibling !== null) {
                    self.clearDataListSelection(self);
                    self.selectOption(document.activeElement.previousElementSibling);
                }
            } else if (e.code === 'ArrowDown') {
                // handle down-click
                if (document.activeElement.nextElementSibling !== null) {
                    self.clearDataListSelection(self);
                    self.selectOption(document.activeElement.nextElementSibling);
                }
            } else if (e.code === 'Enter' || e.code === 'Tab') {
                self.clearDataListSelection(self);
                self.addToResultList(self, document.activeElement);
            }
        });

        this.dataList.addEventListener('click', function (e) {
            self.clearDataListSelection(self);
            self.addToResultList(self, e.target);
            self.dataList.classList.add('vh');
        });
    };

    /**
     * Handle remote data response result
     *
     * This method adds remote results to the dropdown list for selecting
     *
     * @param {SmartTextInput} self This reference
     * @param {Object}        data Response data
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    remoteCallback (self, data)
    {
        window.omsApp.logger.log(data);
        data             = JSON.parse(data.response)[0];
        const dataLength = data.length;

        // if dropdown == true
        if (self.dataList.getAttribute('data-active') !== 'true') {
            return;
        }

        if (self.inputField.textContent === '') {
            self.inputField.setAttribute('data-value', '');
        }

        while (self.dataListBody.firstChild) {
            self.dataListBody.removeChild(self.dataListBody.firstChild);
        }

        let matchFound = false;
        for (let i = 0; i < dataLength; ++i) {
            // set readable value
            const newRow    = self.dataTpl.content.cloneNode(true);
            let fields      = newRow.querySelectorAll('[data-tpl-text]');
            let fieldLength = fields.length;

            for (let j = 0; j < fieldLength; ++j) {
                fields[j].appendChild(
                    document.createTextNode(
                        jsOMS.getArray(fields[j].getAttribute('data-tpl-text'), data[i])
                    )
                );
            }

            // set internal value
            fields      = newRow.querySelectorAll('[data-tpl-value]');
            fieldLength = fields.length;

            for (let j = 0; j < fieldLength; ++j) {
                fields[j].setAttribute(
                    'data-value',
                    jsOMS.getArray(fields[j].getAttribute('data-tpl-value'), data[i])
                );
            }

            // set data cache
            newRow.firstElementChild.setAttribute('data-data', JSON.stringify(data[i]));

            if (!matchFound && self.inputField.textContent === newRow.firstElementChild.textContent) {
                newRow.firstElementChild.classList.add('active');
                self.inputField.setAttribute('data-value', newRow.firstElementChild.getAttribute('data-value'));

                matchFound = true;
            }

            self.dataListBody.appendChild(newRow);
        }

        if (!matchFound && self.inputField.getAttribute('data-value') !== '') {
            self.inputField.classList.add('invalid');
        } else {
            self.inputField.classList.remove('invalid');
        }
    };

    /**
     * Callback for input field content change
     *
     * @param {SmartTextInput} self This reference
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    changeCallback (self)
    {
        // if remote data
        if (typeof self.src !== 'undefined' && self.src !== '') {
            const request = new Request(self.src);
            request.addData(self.inputField.getAttribute('data-name'), self.inputField.textContent)
            request.addData('limit', self.inputField.getAttribute('data-limit'))

            request.setSuccess(function (data) { self.remoteCallback(self, data); });
            request.send();
        }
    };

    /**
     * Select element in dropdown (only mark it as selected)
     *
     * @param {Element} e Element to select in dropdown
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    selectOption (e)
    {
        e.focus();
        jsOMS.addClass(e, 'active');
    };

    /**
     * Clear all selected/marked options in dropdown
     *
     * @param {SmartTextInput} self This reference
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    clearDataListSelection (self)
    {
        const list   = self.dataListBody.getElementsByTagName('div');
        const length = list.length;

        for (let i = 0; i < length; ++i) {
            jsOMS.removeClass(list[i], 'active');
        }
    };

    /**
     * Add selected dropdown elements to some final result list
     *
     * This can add the selected dropdown elements to a table, badge list etc. depending on the template structure.
     *
     * @param {SmartTextInput}  self This reference
     * @param {Element}        e    Element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    addToResultList (self, e) {
        const data = JSON.parse(e.getAttribute('data-data'));

        if (self.inputField.getAttribute('data-autocomplete') === 'true') {
            self.inputField.value = jsOMS.getArray(self.inputField.getAttribute('data-value'), data);
        }

        self.inputField.setAttribute('data-value', e.getAttribute('data-value'));
        self.inputField.textContent = e.textContent;

        self.inputField.focus();
        self.dataList.classList.add('vh');
    };

    /**
     * Delay handler (e.g. delay after finishing typing)
     *
     * After waiting for a delay a callback can be triggered.
     *
     * @param {Object}        action   Action type
     * @param {function}      callback Callback to be triggered
     * @param {SmartTextInput} self     This reference (passed to callback)
     * @param {Object}        data     Data (passed to callback)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    inputTimeDelay (action, callback, self, data)
    {
        if (SmartTextInput.timerDelay[action.id]) {
            clearTimeout(SmartTextInput.timerDelay[action.id]);
            delete SmartTextInput.timerDelay[action.id];
        }

        SmartTextInput.timerDelay[action.id] = setTimeout(function () {
            delete SmartTextInput.timerDelay[action.id];
            callback(self, data);
        }, action.delay);
    };
};

SmartTextInput.timerDelay = {};
