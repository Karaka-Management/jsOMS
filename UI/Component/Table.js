/**
 * Table manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Component');

    jsOMS.UI.Component.Table = class {
        /**
         * @constructor
         *
         * @param {Object} app Application
         *
         * @since 1.0.0
         */
        constructor(app)
        {
            this.app    = app;
            this.tables = {};
            this.ignore = {};
        };

        /**
         * Bind & rebind UI elements.
         *
         * @param {string} [id] Element id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bind (id)
        {
            if (typeof id !== 'undefined' && typeof this.ignore[id] === 'undefined') {
                this.bindTable(id);
            } else {
                const tables = document.getElementsByTagName('table'),
                    length   = !tables ? 0 : tables.length;

                for (let i = 0; i < length; ++i) {
                    let tableId = tables[i].getAttribute('id');
                    if (typeof tableId !== 'undefined' && tableId !== null && typeof this.ignore[tableId] === 'undefined') {
                        this.bindTable(tableId);
                    }
                }
            }
        };

        /**
         * Unbind table
         *
         * @param {string} id Table Id
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        unbind (id)
        {

        };

        /**
         * Bind & rebind UI element.
         *
         * @param {Object} [id] Element id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindTable (id)
        {
            if (typeof id === 'undefined' || !id) {
                jsOMS.Log.Logger.instance.info('A table doesn\'t have an ID.');
                return;
            }

            this.tables[id] = new jsOMS.Views.TableView(id);

            this.unbind(id);

            this.bindExport(this.tables[id]);

            // todo: sorting: increasing / decreasing only if icons are available
            // todo: filtering: equals (alphanumeric), greater, greater equals, lesser, lesser equals, contains, doesn't contain, excel like selection of elements. Amount of filtering options unlimited.
            // cell value should be data-value="" and cell name should be data-name="" and cell content should be data-content="".
            // if no value is defined than data-value = cell content. if no name is defined then data-name = cell content. if no content is defined then data-content = cell content.

            const sorting = this.tables[id].getSorting();
            let length    = sorting.length;
            for (let i = 0; i < length; ++i) {
                this.bindSorting(sorting[i], id);
            }

            const order = this.tables[id].getSortableRows();
            length      = order.length;
            for (let i = 0; i < length; ++i) {
                this.bindReorder(order[i], id);
            }

            const filters = this.tables[id].getFilter();
            length        = filters.length;
            for (let i = 0; i < length; ++i) {
                this.bindFiltering(filters[i], id);
            }

            const removable = this.tables[id].getRemovable();
            length          = removable.length;
            for (let i = 0; i < length; ++i) {
                this.bindRemovable(removable[i], id);
            }

            const createForm   = this.tables[id].getForm();
            const createButton = document.getElementById(id).getAttribute('data-table-add');

            if (createButton !== null) {
                this.bindCreateInline(createButton, id);
            } else if (createForm !== null) {
                this.bindCreateForm(createForm, id);
            }

            const update = this.tables[id].getUpdatable();
            length       = update.length;
            for (let i = 0; i < length; ++i) {
                this.bindUpdatable(update[i], id);
            }
        };

        /**
         * Export a table
         *
         * @param {Element} exports Export button
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindExport(exports)
        {
            const button = exports.getExport();

            if (typeof button === 'undefined' || button === null) {
                return;
            }

            button.addEventListener('click', function (event)
            {
                console.log(exports.serialize());
                // todo: either create download in javascript from this data or make roundtrip to server who then sends the data
                // - think about allowing different export formats (json, csv, excel)
                // - maybe this should never be done from the ui, maybe a endpoint uri should be specified which then calls the api get function for this data
            });
        };

        /**
         * Removes the closest row on click.
         *
         * @param {Element} remove Remove button
         * @param {Object}  id     Element id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindRemovable(remove, id)
        {
            if (remove.closest('form').getAttribute('method') !== 'NONE') {
                this.app.uiManager.getFormManager().get(remove.closest('form').id).setSuccess(function () {
                    document.getElementById(id).deleteRow(remove.closest('tr').rowIndex);
                });
            } else {
                this.app.uiManager.getFormManager().get(remove.closest('form').id).setFinally(function () {
                    document.getElementById(id).deleteRow(remove.closest('tr').rowIndex);
                });
            }
        };

        /**
         * Swaps the row on click.
         *
         * @param {Element} sorting Swap button
         * @param {Object}  id      Element id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindReorder(sorting, id)
        {
            sorting.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);

                const table   = document.getElementById(id),
                    rows      = table.getElementsByTagName('tbody')[0].rows,
                    rowLength = rows.length,
                    rowId     = this.closest('tr').rowIndex,
                    orderType = jsOMS.hasClass(this, 'order-up') ? 1 : -1;


                if (orderType === 1 && rowId > 1) {
                    rows[rowId].parentNode.insertBefore(rows[rowId - 2], rows[rowId]);
                } else if (orderType === -1 && rowId < rowLength) {
                    rows[rowId - 1].parentNode.insertBefore(rows[rowId], rows[rowId - 1]);
                }

                // todo: submit new order to remote
            });
        };

        /**
         * Sorts the table.
         *
         * @param {Element} sorting Sort button
         * @param {Object}  id      Table id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindSorting(sorting, id)
        {
            sorting.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);

                const table   = document.getElementById(id),
                    rows      = table.getElementsByTagName('tbody')[0].rows,
                    rowLength = rows.length,
                    cellId    = this.closest('td').cellIndex,
                    sortType  = jsOMS.hasClass(this, 'sort-asc') ? 1 : -1;

                let j, i, row1, row2, content1, content2,
                    order        = false,
                    shouldSwitch = false;

                const columnName = this.closest('td').getAttribute('data-name');

                table.setAttribute('data-sorting', (sortType > 0 ? '+' : '-') + (columnName !== null ? columnName : cellId));

                if (table.getAttribute('data-src') !== null) {
                    jsOMS.UI.Component.Table.getRemoteData(table);
                    return;
                }

                do {
                    order = false;

                    for (j = 0; j < rowLength - 1; ++j) {
                        shouldSwitch = false;
                        row1         = rows[j].getElementsByTagName('td')[cellId];
                        content1     = row1.getAttribute('data-content') !== null ? row1.getAttribute('data-content') : row1.textContent;

                        for (i = j + 1; i < rowLength; ++i) {
                            row2     = rows[i].getElementsByTagName('td')[cellId];
                            content2 = row2.getAttribute('data-content') !== null ? row2.getAttribute('data-content') : row2.textContent;

                            if (sortType === 1 && content1 > content2) {
                                shouldSwitch = true;
                            } else if (sortType === -1 && content1 < content2) {
                                shouldSwitch = true;
                            } else {
                                break;
                            }
                        }

                        if (shouldSwitch === true) {
                            break;
                        }
                    }

                    if (shouldSwitch) {
                        rows[j].parentNode.insertBefore(rows[i - 1], rows[j]);
                        order = true;
                    }
                } while (order);
            });
        };

        /**
         * Filters the table.
         *
         * @param {Element} filtering Filter button
         * @param {Object}  id        Table id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindFiltering(filtering, id)
        {
            filtering.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);

                const tpl = document.getElementById('table-filter-tpl');

                if (tpl === null || document.getElementById(tpl.content.firstElementChild.id) !== null) {
                    return;
                }

                const posY = event.pageY + document.body.scrollTop + document.documentElement.scrollTop + tpl.parentNode.scrollTop - tpl.parentNode.getBoundingClientRect().top;
                const posX = event.pageX + document.body.scrollLeft + document.documentElement.scrollLeft + tpl.parentNode.scrollLeft - tpl.parentNode.getBoundingClientRect().left;

                const output = document.importNode(tpl.content, true);
                output.firstElementChild.setAttribute('style', 'position: absolute; top: ' + posY + 'px; left: ' + posX + 'px;')
                output.firstElementChild.setAttribute('data-table', this.closest('table').id);
                output.firstElementChild.setAttribute('data-table-column', this.closest('td').cellIndex);

                // todo: set existing filtering option in ui here

                // todo: do this as injection into a form instead? -this would require cleanup for the events every time
                output.firstElementChild.querySelectorAll('button[type="submit"], input[type="submit"]')[0].addEventListener('click', function (event) {
                    jsOMS.preventAll(event);

                    const input  = document.getElementById('table-filter').querySelectorAll('input, select');
                    const length = input.length;

                    let filter = [];

                    for (let i = 0; i < length; ++i) {
                        filter.push(input[i].value);
                    }

                    const table = document.getElementById(document.getElementById('table-filter').getAttribute('data-table'));

                    table.querySelectorAll('thead td')[
                        document.getElementById('table-filter').getAttribute('data-table-column')
                    ].setAttribute('data-filter', JSON.stringify(filter));

                    // todo: if not empty highlight filter button for user indication that filter is active
                    // todo: filter locally and if src is available to remote filter maybe just create an apply function which calls the different functions?

                    document.getElementById('table-filter').parentNode.removeChild(document.getElementById('table-filter'));

                    if (table.getAttribute('data-src') !== null) {
                        jsOMS.UI.Component.Table.getRemoteData(table);
                        return;
                    }

                    // todo: implement local filtering if no data-src available
                });

                output.firstElementChild.querySelectorAll('button[type="reset"], input[type="reset"]')[0].addEventListener('click', function (event) {
                    document.getElementById('table-filter').parentNode.removeChild(document.getElementById('table-filter'));
                });

                tpl.parentNode.appendChild(output);
            });
        };

        /**
         * Create the table row
         *
         * @param {string} createForm Create form
         * @param {Object} id         Table id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindCreateForm(createForm, id)
        {
            this.app.uiManager.getFormManager().get(createForm).injectSubmit(function () {
                const table  = document.getElementById(id).getElementsByTagName('tbody')[0];
                const newRow = table.getElementsByTagName('template')[0].content.cloneNode(true);

                // set internal value
                let fields      = newRow.querySelectorAll('[data-tpl-value]');
                let fieldLength = fields.length;
                let uuid        = '';
                let value       = '';

                for (let j = 0; j < fieldLength; ++j) {
                    value = document.querySelectorAll(
                        '#' + createForm + ' [data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"], [data-form="' + createForm + '"][data-tpl-value="' + fields[j].getAttribute('data-tpl-value') + '"]')[0]
                        .getAttribute('data-value');

                    // todo: we need to check what kind of tag the selector above returns in order to get the correct value. currently this only makes sense for input elements but for selection, checkboxes etc. this doesn't make sense there we need .innerHtml or [data-text=]

                    fields[j].setAttribute('data-value', value);

                    uuid += value;
                }

                // don't allow duplicate
                if (table.querySelectorAll('[data-tpl-uuid="' + uuid + '"').length !== 0) {
                    return;
                }

                newRow.firstElementChild.setAttribute('data-tpl-uuid', uuid);

                // set readable text
                fields      = newRow.querySelectorAll('[data-tpl-text]');
                fieldLength = fields.length;

                for (let j = 0; j < fieldLength; ++j) {
                    fields[j].appendChild(
                        document.createTextNode(
                            document.querySelectorAll('#' + createForm + ' [data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"], [data-form="' + createForm + '"][data-tpl-text="' + fields[j].getAttribute('data-tpl-text') + '"]')[0].value
                        )
                    );

                    // todo: we need to check what kind of tag the selector above returns in order to get the correct value. currently this only makes sense for input elements but for selection, checkboxes etc. this doesn't make sense there we need .innerHtml or [data-text=]
                }

                table.appendChild(newRow);
                // todo: consider to do ui action as success inject to the backend request... maybe optional because sometimes there will be no backend call?
                // todo: if a column has a form in the template the id of the form needs to be set unique somehow (e.g. remove button in form)

                // todo: bind removable
                // todo: bind edit

                return true;
            });
        };

        /**
         * Create the table row
         *
         * @param {string} createForm Create form
         * @param {Object} id         Table id
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        bindCreateInline(createForm, id)
        {
            const self = this;

            document.getElementById(createForm).addEventListener('click', function() {
                const table  = document.getElementById(id).getElementsByTagName('tbody')[0];
                const newRow = table.getElementsByTagName('template')[1].content.cloneNode(true);
                const rowId  = 'f' + Math.random().toString(36).substring(7);
                // todo: check if random id doesn't already exist

                newRow.firstElementChild.id                                 = rowId;
                newRow.firstElementChild.getElementsByTagName('form')[0].id = rowId + '-form';

                const fields = newRow.firstElementChild.querySelectorAll('[data-form="' + self.tables[id].getForm() + '"]');
                const length = fields.length;

                for (let i = 0; i < length; ++i) {
                    fields[i].setAttribute('data-form', rowId + '-form');
                }

                table.appendChild(newRow.firstElementChild);

                self.bindCreateForm(rowId + '-form', id);
                self.app.uiManager.getFormManager().get(rowId + '-form').injectSubmit(function () {
                    document.getElementById(id).getElementsByTagName('tbody')[0].removeChild(
                        document.getElementById(rowId)
                    );
                });

                // todo: bind removable
                // todo: bind edit
            });

            // todo: this is polluting the form manager because it should be emptied afterwards (form is deleted but not from form manager)
            // todo: consider to do ui action as success inject to the backend request... maybe optional because sometimes there will be no backend call?
            // todo: if a column has a form in the template the id of the form needs to be set unique somehow (e.g. remove button in form)
        };

        static getRemoteData (table)
        {
            const data = {
                limit: table.getAttribute('data-limit'),
                offset: table.getAttribute('data-offset'),
                sorting: table.getAttribute('data-sorting'),
                filter: table.getAttribute('data-filter')
            };

            const request = new jsOMS.Message.Request.Request();
            request.setData(data);
            request.setType(jsOMS.Message.Response.ResponseType.JSON);
            request.setUri(table.getAttribute('data-src'));
            request.setMethod('GET');
            request.setRequestHeader('Content-Type', 'application/json');
            request.setSuccess(function (xhr) {
                jsOMS.UI.Component.Table.emptyTable(table.getElementsByTagName('tbody')[0]);
                jsOMS.UI.Component.Table.addToTable(table.getElementsByTagName('tbody')[0], JSON.parse(xhr.response));
            });

            request.send();
        };

        static emptyTable(table)
        {
            const rows   = table.getElementsByTagName('tr');
            const length = rows.length;

            for (let i = 0; i < length; ++i) {
                rows[i].parentNode.removeChild(rows[i]);
            }
        };

        static addToTable(table, data)
        {
            const dataLength = data.length;

            console.table(data);

            for (let i = 0; i < dataLength; ++i) {
                // set readable value
                const newRow    = table.getElementsByTagName('template')[0].content.cloneNode(true);
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

                table.appendChild(newRow);

                // todo: bind buttons if required (e.g. remove, edit button)
            }
        };

        bindUpdatable (update, id)
        {
            const self = this;

            update.addEventListener('click', function() {
                // handle external form
                // handle internal form
                const formId = document.getElementById(id).getAttribute('data-table-form');
                const values = this.closest('tr').querySelectorAll('[data-tpl-value]');
                const text   = this.closest('tr').querySelectorAll('[data-tpl-text]');
                const table  = document.getElementById(id).getElementsByTagName('tbody')[0];

                if (document.getElementById(formId) === null) {
                    this.closest('tr').style = "display: none"; // todo: replace with class instead of inline style

                    const newRow = table.getElementsByTagName('template')[1].content.cloneNode(true);
                    const rowId  = 'f' + Math.random().toString(36).substring(7);
                    // todo: don't use random ide use actual row id for data which needs to be updated

                    newRow.firstElementChild.id                                 = rowId;
                    newRow.firstElementChild.getElementsByTagName('form')[0].id = rowId + '-form';

                    const fields = newRow.firstElementChild.querySelectorAll('[data-form="' + self.tables[id].getForm() + '"]');
                    let length   = fields.length;

                    for (let i = 0; i < length; ++i) {
                        fields[i].setAttribute('data-form', rowId + '-form');
                    }

                    // insert row values data into form
                    length = values.length;
                    for (let i = 0; i < length; ++i) {
                        newRow.firstElementChild.querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"')[0].value = values[i].value;
                        // todo: handle different input types
                    }

                    // insert row text data into form
                    length = text.length;
                    for (let i = 0; i < length; ++i) {
                        newRow.firstElementChild.querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"')[0].value = text[i].innerText;
                        console.log(text[i].innerText);
                        // todo: handle different input types
                    }

                    table.insertBefore(newRow.firstElementChild, this.closest('tr'));

                    self.bindCreateForm(rowId + '-form', id);
                    self.app.uiManager.getFormManager().get(rowId + '-form').injectSubmit(function () {
                        document.getElementById(id).getElementsByTagName('tbody')[0].removeChild(
                            document.getElementById(rowId)
                        );
                    });

                    // todo: replace add button with save button and add cancel button
                    // todo: on save button click insert data into hidden row and show hidden row again, delete form row
                } else {
                    const fields = document.getElementById(formId).querySelectorAll('[data-form="' + self.tables[id].getForm() + '"]');
                    let length   = fields.length;

                    for (let i = 0; i < length; ++i) {
                        fields[i].setAttribute('data-form', rowId + '-form');
                    }

                    // insert row values data into form
                    length = values.length;
                    for (let i = 0; i < length; ++i) {
                        document.getElementById(formId).querySelectorAll('[data-tpl-value="' + values[i].getAttribute('data-tpl-value') + '"')[0].value = values[i].value;
                        // todo: handle different input types
                    }

                    // insert row text data into form
                    length = text.length;
                    for (let i = 0; i < length; ++i) {
                        document.getElementById(formId).querySelectorAll('[data-tpl-text="' + text[i].getAttribute('data-tpl-text') + '"')[0].value = text[i].innerText;
                        console.log(text[i].innerText);
                        // todo: handle different input types
                    }

                    // todo: replace add button with save button and add cancel button
                    // todo: on save button click insert data into hidden row and show hidden row again, delete form row
                    // todo: consider to highlight column during edit
                }
            });
        };
    }
}(window.jsOMS = window.jsOMS || {}));
