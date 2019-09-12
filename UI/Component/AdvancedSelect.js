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
 *
 * @todo: this class is probably the most stupid thing I've done in a long time. Seriously fix this!
 * @todo: Passing self to every MEMBER function is just dumb.
 */
export class AdvancedSelect {
    /**
     * @constructor
     *
     * @param {object} e Element to bind
     *
     * @since 1.0.0
     */
    constructor(e) {
        this.id = e.id;
        this.selectComponent = e;
        this.selectField = this.selectComponent.getElementsByClassName('input')[0];
        this.dropdownElement = document.getElementById(this.id + '-dropdown');
        this.tagElement = document.getElementById(this.id + '-tags');
        this.dataList = this.dropdownElement.getElementsByTagName('table')[0];
        this.dataListBody = this.dataList.getElementsByTagName('tbody')[0];
        this.dataTpl = document.getElementById(this.id + '-rowElement');
        this.tagTpl = this.tagElement.getElementsByTagName('template')[0];
        this.src = this.selectField.getAttribute('data-src');

        const self = this;
        this.selectField.addEventListener('focusout', function (e) {
            // todo: this also means that clicking on any other part of the result list that it disappears befor
            // the click is registered in the result list since focusout has highest priority (e.g. sort button in table).
            // so far i don't know a way to check if *any* element in the result div is clicked, if I could check this
            // first then I could simply say, don't make the result div inactive!
            if (e.relatedTarget === null ||
                e.relatedTarget.parentElement === null ||
                e.relatedTarget.parentElement.parentElement === null ||
                !jsOMS.hasClass(e.relatedTarget.parentElement.parentElement.parentElement, 'dropdown')
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

            // todo: consider if it makes sense to have a none element always for phone users only to jump out?
            // todo: if not remote then the suggestion dropdown should filter itself based on best match

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
     * @param {object} self This reference
     * @param {object} data Response data
     *
     * @since 1.0.0
     */
    remoteCallback(self, data) {
        console.log(data);
        data = JSON.parse(data.response)[0];
        const dataLength = data.length;

        console.table(data);

        // if dropdown == true
        if (self.dropdownElement.getAttribute('data-active') === 'true') {
            while (self.dataListBody.firstChild) {
                self.dataListBody.removeChild(self.dataListBody.firstChild);
            }

            for (let i = 0; i < dataLength; ++i) {
                // set readable value
                const newRow = self.dataTpl.content.cloneNode(true);
                let fields = newRow.querySelectorAll('[data-tpl-text]');
                let fieldLength = fields.length;

                for (let j = 0; j < fieldLength; ++j) {
                    fields[j].appendChild(
                        document.createTextNode(
                            jsOMS.getArray(fields[j].getAttribute('data-tpl-text'), data[i])
                        )
                    );
                }

                // set internal value
                fields = newRow.querySelectorAll('[data-tpl-value]');
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
     * @param {object} self This reference
     *
     * @since 1.0.0
     */
    changeCallback(self) {
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
     * @param {object} e Element to select in dropdown
     *
     * @since 1.0.0
     */
    selectOption(e) {
        e.focus();
        // todo: change to set style .active
        e.setAttribute('style', 'background: #f00');
        jsOMS.addClass(e, 'active');
    };

    /**
     * Clear all selected/marked options in dropdown
     *
     * @param {object} self This reference
     *
     * @since 1.0.0
     */
    clearDataListSelection(self) {
        const list = self.dataListBody.getElementsByTagName('tr'),
            length = list.length;

        for (let i = 0; i < length; ++i) {
            // todo: remove the active class
            list[i].setAttribute('style', '');
            jsOMS.removeClass(list[i], 'active');
        }
    };

    /**
     * Add selected dropdown elements to some final result list
     *
     * This can add the selected dropdown elements to a table, badge list etc. depending on the template structure.
     *
     * @param {object} self This reference
     *
     * @since 1.0.0
     */
    addToResultList(self) {
        if (self.inputField.getAttribute('data-autocomplete') === 'true') {
            self.inputField.value = document.activeElement.querySelectorAll('[data-tpl-value="' + self.inputField.getAttribute('data-value') + '"]')[0].getAttribute('data-value');
        }

        if (self.tagElement.getAttribute('data-active') === 'true') {
            // todo: make badges removable
            const newTag = self.tagTpl.content.cloneNode(true);

            // set internal value
            let fields = newTag.querySelectorAll('[data-tpl-value]');
            let fieldLength = fields.length;
            let uuid = '';
            let value = '';

            for (let j = 0; j < fieldLength; ++j) {
                value = document.activeElement.querySelectorAll('[data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"]')[0].getAttribute('data-value');
                fields[j].setAttribute('data-value', value);

                uuid += value;
            }

            // don't allow duplicate
            // todo: create a data-duplicat=true attribute to allow duplication and then have a count as part of the uuid (maybe row id)
            if (self.tagElement.querySelectorAll('[data-tpl-uuid="' + uuid + '"').length !== 0) {
                return;
            }

            newTag.firstElementChild.setAttribute('data-tpl-uuid', uuid);

            // set readable text
            fields = newTag.querySelectorAll('[data-tpl-text]');
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
                && self.tagElement.getAttribute('data-limit') != 0
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
     * @param {object}   action   Action type
     * @param {function} callback Callback to be triggered
     * @param {object}   self     This reference (passed to callback)
     * @param {object}   data     Data (passed to callback)
     *
     * @since 1.0.0
     */
    inputTimeDelay(action, callback, self, data) {
        if (AdvancedSelect.timerDelay[action.id]) {
            clearTimeout(AdvancedSelect.timerDelay[action.id]);
            delete AdvancedSelect.timerDelay[action.id]
        }

        AdvancedSelect.timerDelay[action.id] = setTimeout(function () {
            delete AdvancedSelect.timerDelay[action.id];
            callback(self, data);
        }, action.delay);
    };
};

AdvancedSelect.timerDelay = {};