import { Request } from '../../Message/Request/Request.js';

/**
 * Advanced input class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class AdvancedInput
{
    /**
     * @constructor
     *
     * @param {Object} e Element to bind
     *
     * @since 1.0.0
     */
    constructor (e, eventManager, observer)
    {
        this.id              = e.id;
        this.inputComponent  = e;
        this.inputField      = this.inputComponent.getElementsByClassName('input')[0];
        this.dropdownElement = document.getElementById(this.id + '-popup');
        this.tagElement      = document.getElementById(this.id + '-tags');
        this.dataList        = this.dropdownElement.getElementsByTagName('table')[0];
        this.dataListBody    = this.dataList.getElementsByTagName('tbody')[0];
        this.dataTpl         = document.getElementById(this.id + '-rowElement');
        this.tagTpl          = this.tagElement !== null ? this.tagElement.getElementsByTagName('template')[0] : null;
        this.src             = this.inputField.getAttribute('data-src');

        const self = this;
        this.inputField.addEventListener('focusout', function(e) {
            /**
             * @todo Karaka/Modules#63
             *  If you click anything outside of the input element the dropdown list closes.
             *  This is also true if you click something inside of the dropdown list e.g. sort/filter etc.
             *  This might be fixable by changing the focus from the input element to the dropdown element and keep the dropdown element visible if it has focus.
             */
            if (e.relatedTarget === null ||
                e.relatedTarget.parentElement === null ||
                e.relatedTarget.parentElement.parentElement === null ||
                !jsOMS.hasClass(e.relatedTarget.parentElement.parentElement.parentElement, 'popup')
            ) {
                jsOMS.removeClass(self.dropdownElement, 'active');
            }
        });

        this.inputField.addEventListener('keydown', function(e) {
            if (e.keyCode === 13 || e.keyCode === 40) {
                jsOMS.preventAll(e);
            }

            if (e.keyCode === 40) {
                // down-key
                self.selectOption(self.dataListBody.firstElementChild);
                jsOMS.preventAll(e);
            } else {
                // handle change delay
                self.inputTimeDelay({id: self.id, delay: 300}, self.changeCallback, self, e);
            }
        });

        this.inputField.addEventListener('focusin', function(e) {
            jsOMS.addClass(self.dropdownElement, 'active');
        });

        this.dropdownElement.addEventListener('keydown', function(e) {
            jsOMS.preventAll(e);

            /**
             * @todo Karaka/jsOMS#61
             *  Jumping out of the dropdown list is a little bit annoying for handheld users.
             *  A solution could be to add a exit/none element which closes the dropdown when clicked.
             *
             * @todo Karaka/jsOMS#62
             *  If the data for the input element is only locally defined the filter or sort should be done by the best match.
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
                self.addToResultList(self, document.activeElement);
            }
        });

        this.dropdownElement.addEventListener('focusout', function(e) {
            self.clearDataListSelection(self);
            jsOMS.removeClass(self.dropdownElement, 'active');
        });

        this.dropdownElement.addEventListener('click', function(e) {
            if (document.activeElement.tagName.toLowerCase() !== 'tr') {
                return;
            }

            self.clearDataListSelection(self);
            self.addToResultList(self, document.activeElement);
            jsOMS.removeClass(self.dropdownElement, 'active');
        });

        observer.observe(this.tagElement, { childList: true, attributes: false, subtree: false });
        eventManager.attach(this.id + '-tags-childList', function(data) {
            const removes       = data.target.querySelectorAll('.fa-times');
            const removesLength = removes === null ? 0 : removes.length;

            if (removesLength < 1) {
                return;
            }

            removes[removesLength - 1].addEventListener('click', function(e) {
                if (e.target.parentNode.parentNode === null) {
                    return;
                }

                e.target.parentNode.parentNode.removeChild(e.target.parentNode);
            });
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
    remoteCallback(self, data)
    {
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

                // set data cache
                newRow.firstElementChild.setAttribute('data-data', JSON.stringify(data[i]));

                self.dataListBody.appendChild(newRow);
                self.dataListBody.lastElementChild.addEventListener('focusout', function(e) {
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
    changeCallback(self)
    {
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
    selectOption(e)
    {
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
    clearDataListSelection(self)
    {
        const list = self.dataListBody.getElementsByTagName('tr'),
            length = list.length;

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
     * @param {Object}  self This reference
     * @param {Element} e    Element
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    addToResultList(self, e) {
        const data = JSON.parse(e.getAttribute('data-data'));

        if (self.inputField.getAttribute('data-autocomplete') === 'true') {
            self.inputField.value = jsOMS.getArray(self.inputField.getAttribute('data-value'), data);
        }

        if (self.tagElement !== null && self.tagElement.getAttribute('data-active') === 'true') {
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
                fields[j].setAttribute(
                    'data-value',
                    jsOMS.getArray(fields[j].getAttribute('data-tpl-value'), data)
                );

                value = jsOMS.getArray(fields[j].getAttribute('data-tpl-value'), data);
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
                        jsOMS.getArray(fields[j].getAttribute('data-tpl-text'), data)
                    )
                );
            }

            // set innerHtml (e.g. styles) {/path}
            const regex       = /{\/.*?}/g;
            const matches     = newTag.firstElementChild.outerHTML.match(regex);
            const matchLength = matches === null ? 0 : matches.length;

            for (let i = 0; i < matchLength; ++i) {
                newTag.firstElementChild.outerHTML = newTag.firstElementChild.outerHTML.replace(
                    matches[i],
                    jsOMS.getArray(matches[i].substring(1, matches[i].length - 1), data)
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
     * @param {Object}   action   Action type
     * @param {function} callback Callback to be triggered
     * @param {Object}   self     This reference (passed to callback)
     * @param {Object}   data     Data (passed to callback)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    inputTimeDelay(action, callback, self, data)
    {
        if (AdvancedInput.timerDelay[action.id]) {
            clearTimeout(AdvancedInput.timerDelay[action.id]);
            delete AdvancedInput.timerDelay[action.id]
        }

        AdvancedInput.timerDelay[action.id] = setTimeout(function() {
            delete AdvancedInput.timerDelay[action.id];
            callback(self, data);
        }, action.delay);
    };
};

AdvancedInput.timerDelay = {};