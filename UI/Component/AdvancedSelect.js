// remote data
// select data could be template layout per element
// multi select
// select with search feature for many options

// isn't this very similar to the advanced input? just a little different?
// maybe not...

import { Request } from '../../Message/Request/Request.js';
/**
 * Advanced input class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class AdvancedSelect
{
    /**
     * @constructor
     *
     * @param {Object} e Element to bind
     *
     * @since 1.0.0
     */
    constructor (e) {
        this.id              = e.id;
        this.selectComponent = e;
        this.selectField     = this.selectComponent.getElementsByClassName('input')[0];
        this.dropdownElement = document.getElementById(this.id + '-popup');
        this.tagElement      = document.getElementById(this.id + '-tags');
        this.dataList        = this.dropdownElement.getElementsByTagName('table')[0];
        this.dataListBody    = this.dataList.getElementsByTagName('tbody')[0];
        this.dataTpl         = document.getElementById(this.id + '-rowElement');
        this.tagTpl          = this.tagElement.getElementsByTagName('template')[0];
        this.src             = this.selectField.getAttribute('data-src');

        const self = this;
        this.selectField.addEventListener('focusout', function (e) {
            /**
             * @todo Karaka/Modules#63
             *  If you click anything outside of the input element the dropdown list closes.
             *  This is also true if you click something inside of the dropdown list e.g. sort/filter etc.
             *  This might be fixable by changing the focus from the input element to the dropdown element and keep the dropdown element visible if it has focus.
             */
            if (e.relatedTarget === null
                || e.relatedTarget.parentElement === null
                || e.relatedTarget.parentElement.parentElement === null
                || !jsOMS.hasClass(e.relatedTarget.parentElement.parentElement.parentElement, 'popup')
            ) {
                jsOMS.removeClass(self.dropdownElement, 'active');
            }
        });

        this.selectField.addEventListener('keydown', function (e) {
            if (e.keyCode === 13 || e.keyCode === 40) {
                jsOMS.preventAll(e);
            }

            if (e.keyCode === 40) {
                // down-key
                self.selectOption(self.dataListBody.firstElementChild);
                jsOMS.preventAll(e);
            } else {
                // handle change delay
                self.inputTimeDelay({ id: self.id, delay: 300 }, self.changeCallback, self, e);
            }
        });

        this.selectField.addEventListener('focusin', function (e) {
            jsOMS.addClass(self.dropdownElement, 'active');
        });

        this.dropdownElement.addEventListener('keydown', function (e) {
            jsOMS.preventAll(e);

            /**
             * @todo Karaka/jsOMS#73
             *  Consider to add a none element which allows phone users to undo a selection (if this is allowed).
             *
             * @todo Karaka/jsOMS#74
             *  Implement auto filtering on client side (for remote data and client side data).
             */
            if (e.keyCode === 27 || e.keyCode === 46 || e.keyCode === 8) {
                // handle esc, del to go back to input field
                self.inputField.focus();
                self.clearDataListSelection(self);
            } else if (e.keyCode === 38) {
                // handle up-click
                if (document.activeElement.previousElementSibling !== null) {
                    self.clearDataListSelection(self);
                    self.selectOption(document.activeElement.previousElementSibling);
                }
            } else if (e.keyCode === 40) {
                // handle down-click
                if (document.activeElement.nextElementSibling !== null) {
                    self.clearDataListSelection(self);
                    self.selectOption(document.activeElement.nextElementSibling);
                }
            } else if (e.keyCode === 13 || e.keyCode === 9) {
                self.clearDataListSelection(self);
                self.addToResultList(self);
            }
        });

        this.dropdownElement.addEventListener('focusout', function (e) {
            self.clearDataListSelection(self);
            jsOMS.removeClass(self.dropdownElement, 'active');
        });

        this.dropdownElement.addEventListener('click', function (e) {
            if (document.activeElement.tagName.toLowerCase() !== 'tr') {
                return;
            }

            self.clearDataListSelection(self);
            self.addToResultList(self);
            jsOMS.removeClass(self.dropdownElement, 'active');
        });
    };

    /**
     * Handle remote data response result
     *
     * This method adds remote results to the dropdown list for selecting
     *
     * @param {Object} self This reference
     * @param {Object} data Response data
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    remoteCallback (self, data) {
        console.log(data);
        data             = JSON.parse(data.response)[0];
        const dataLength = data.length;

        console.table(data);

        // if dropdown == true
        if (self.dropdownElement.getAttribute('data-active') === 'true') {
            while (self.dataListBody.firstChild) {
                self.dataListBody.removeChild(self.dataListBody.firstChild);
            }

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

                self.dataListBody.appendChild(newRow);
                self.dataListBody.lastElementChild.addEventListener('focusout', function (e) {
                    if (e.relatedTarget === null) {
                        return;
                    }

                    let sibling = e.relatedTarget.parentNode.firstElementChild;
                    do {
                        if (sibling === e.relatedTarget) {
                            jsOMS.preventAll(e);
                            return;
                        }
                    } while ((sibling = sibling.nextElementSibling) !== null);
                });
            }
        }
    };

    /**
     * Callback for input field content change
     *
     * @param {Object} self This reference
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    changeCallback (self) {
        // if remote data
        if (typeof self.src !== 'undefined' && self.src !== '') {
            const request = new Request(self.src);
            request.setSuccess(function (data) { self.remoteCallback(self, data); });
            request.send();
        }
    };

    /**
     * Select element in dropdown (only mark it as selected)
     *
     * @param {Object} e Element to select in dropdown
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    selectOption (e) {
        e.focus();
        /**
             * @todo Karaka/jsOMS#70
             *  Implement external styles for selections instead of inline css
             */
        e.setAttribute('style', 'background: #f00');
        jsOMS.addClass(e, 'active');
    };

    /**
     * Clear all selected/marked options in dropdown
     *
     * @param {Object} self This reference
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    clearDataListSelection (self) {
        const list   = self.dataListBody.getElementsByTagName('tr');
        const length = list.length;

        for (let i = 0; i < length; ++i) {
            /**
             * @todo Karaka/jsOMS#70
             *  Implement external styles for selections instead of inline css
             */
            list[i].setAttribute('style', '');
            jsOMS.removeClass(list[i], 'active');
        }
    };

    /**
     * Add selected dropdown elements to some final result list
     *
     * This can add the selected dropdown elements to a table, badge list etc. depending on the template structure.
     *
     * @param {Object} self This reference
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    addToResultList (self) {
        if (self.inputField.getAttribute('data-autocomplete') === 'true') {
            self.inputField.value = document.activeElement.querySelectorAll('[data-tpl-value="' + self.inputField.getAttribute('data-value') + '"]')[0].getAttribute('data-value');
        }

        if (self.tagElement.getAttribute('data-active') === 'true') {
            /**
             * @todo Karaka/jsOMS#71
             *  Make badges removable
             */
            const newTag = self.tagTpl.content.cloneNode(true);

            // set internal value
            let fields      = newTag.querySelectorAll('[data-tpl-value]');
            let fieldLength = fields.length;
            let uuid        = '';
            let value       = '';

            for (let j = 0; j < fieldLength; ++j) {
                value = document.activeElement.querySelectorAll('[data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"]')[0].getAttribute('data-value');
                fields[j].setAttribute('data-value', value);

                uuid += value;
            }

            /**
             * @todo Karaka/jsOMS#72
             *  Allow duplication
             *  Create a `data-duplicat=true` attribute to allow duplication and then have a count as part of the uuid (maybe row id).
             */
            if (self.tagElement.querySelectorAll('[data-tpl-uuid="' + uuid + '"').length !== 0) {
                return;
            }

            newTag.firstElementChild.setAttribute('data-tpl-uuid', uuid);

            // set readable text
            fields      = newTag.querySelectorAll('[data-tpl-text]');
            fieldLength = fields.length;

            for (let j = 0; j < fieldLength; ++j) {
                fields[j].appendChild(
                    document.createTextNode(
                        document.activeElement.querySelectorAll('[data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"]')[0].innerText
                    )
                );
            }

            // allow limit
            if (self.tagElement.childElementCount >= self.tagElement.getAttribute('data-limit')
                && self.tagElement.getAttribute('data-limit') !== '0'
            ) {
                self.tagElement.removeChild(self.tagElement.firstElementChild);
            }

            self.tagElement.appendChild(newTag);
        }

        if (self.inputField.getAttribute('data-emptyAfter') === 'true') {
            self.inputField.value = '';
        }

        self.inputField.focus();
    };

    /**
     * Delay handler (e.g. delay after finishing typing)
     *
     * After waiting for a delay a callback can be triggered.
     *
     * @param {Object}   action   Action type
     * @param {function} callback Callback to be triggered
     * @param {Object}   self     This reference (passed to callback)
     * @param {Object}   data     Data (passed to callback)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    inputTimeDelay (action, callback, self, data) {
        if (AdvancedSelect.timerDelay[action.id]) {
            clearTimeout(AdvancedSelect.timerDelay[action.id]);
            delete AdvancedSelect.timerDelay[action.id];
        }

        AdvancedSelect.timerDelay[action.id] = setTimeout(function () {
            delete AdvancedSelect.timerDelay[action.id];
            callback(self, data);
        }, action.delay);
    };
};

AdvancedSelect.timerDelay = {};
