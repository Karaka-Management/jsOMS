import { TableView } from '../../Views/TableView.js';
import { Request } from '../../Message/Request/Request.js';
import { ResponseType } from '../../Message/Response/ResponseType.js';

/**
 * Table manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 *
 * @todo Karaka/jsOMS#50
 *  Add basic table handling (no db and pagination)
 *
 * @todo Karaka/jsOMS#55
 *  Implement filtering and sorting based on backend
 *
 * @todo Karaka/jsOMS#57
 *  Advanced filtering
 *  The current filtering implementation is only column by column connected with &&.
 *  Consider to implement a much more advanced filtering where different combinations are possible such as || &&, different ordering with parenthesis etc.
 *  This can be extremely powerful but will be complex for standard users.
 *  This advanced filtering should probably be a little bit hidden?
 *
 * @todo Karaka/jsOMS#59
 *  Data download
 *  There is a small icon in the top right corner of tables which allows (not yet to be honest) to download the data in the table.
 *  Whether the backend should be queried for this or only the frontend data should be collected (current situation) should depend on if the table has an api endpoint defined.
 *
 * @todo Allow column drag/drop ordering which is also saved in the front end
 *
 * @todo Save column visibility filter and apply that filter on page load
 */
export class Table
{
    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     */
    constructor(app)
    {
        this.app = app;

        /** @var {Object <string, TableView>} */
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
     * @since 1.0.0
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
     * @since 1.0.0
     */
    bindTable (id)
    {
        if (typeof id === 'undefined' || !id) {
            jsOMS.Log.Logger.instance.info('A table doesn\'t have an ID.');
            return;
        }

        this.tables[id] = new TableView(id);

        this.unbind(id);
        this.bindExport(this.tables[id]);

        /**
         * @todo Karaka/jsOMS#89
         *  Implement local and remote filtering
         *  Options:
         *      * alphanumeric
         *      * greater
         *      * greater equals
         *      * lesser
         *      * lesser equals
         *      * contains
         *      * doesnt contain
         *      * in between
         *      * regex
         *      * pre-defined values
         * The cell values should be defined in data-value and the name should be data-name and the content should be data-content.
         * Note content and value can be different.
         *      * If no value is defined then the cell content is the value.
         *      * If no name is defined the cell content is the name.
         *      * If no content is defined the cell content is the name.
         */

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

        const checkboxes = this.tables[id].getCheckboxes();
        length           = checkboxes.length;
        for (let i = 0; i < length; ++i) {
            this.bindCheckbox(checkboxes[i], id);
        }

        const header = this.tables[id].getHeader();
        this.bindColumnVisibility(header, id);
    };

    /**
     * Export a table
     *
     * @param {Element} exports Export button
     *
     * @return {void}
     *
     * @since 1.0.0
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
            /**
             * @todo Karaka/jsOMS#90
             *  Implement export
             *  Either create download in javascript from this data or make round trip to server who then sends the data.
             *  The export should be possible (if available) in json, csv, excel, word, pdf, ...
             *  If no endpoint is specified or reachable the client side should create a json or csv export.
             */
        });
    };

     /**
     * Bind column visibility
     *
     * @param {Element} header Header
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindColumnVisibility(header)
    {
        header.addEventListener('contextmenu', function (event) {
            jsOMS.preventAll(event);

            if (document.getElementById('table-context-menu') !== null) {
                return;
            }

            const tpl = document.getElementById('table-context-menu-tpl');

            if (tpl === null) {
                return;
            }

            const output = document.importNode(tpl.content, true);
            tpl.parentNode.appendChild(output);
            const menu = document.getElementById('table-context-menu');

            const columns = header.querySelectorAll('td');
            let length    = columns.length;

            let baseMenuLine = menu.getElementsByClassName('context-line')[0].cloneNode(true);

            for (let i = 0; i < length; ++i) {
                if (typeof columns[i].firstChild === 'undefined'
                    || typeof columns[i].firstChild.data === 'undefined'
                    || columns[i].firstChild.data.trim() === ''
                ) {
                    continue;
                }

                const menuLine = baseMenuLine.cloneNode(true);
                const lineId   = menuLine.firstElementChild.getAttribute('get') + i;

                menuLine.firstElementChild.setAttribute('for', lineId);
                menuLine.firstElementChild.firstElementChild.setAttribute('id', lineId);
                menuLine.firstElementChild.appendChild(document.createTextNode(columns[i].firstChild.data.trim()));

                menu.getElementsByTagName('ul')[0].appendChild(menuLine);
                menu.querySelector('ul').lastElementChild.querySelector('input[type="checkbox"]').checked = columns[i].style.display !== 'none';

                menu.querySelector('ul').lastElementChild.querySelector('input[type="checkbox"]').addEventListener('change', function () {
                    const rows      = header.parentElement.getElementsByTagName('tr');
                    const rowLength = rows.length;

                    for (let j = 0; j < rowLength; ++j) {
                        const cols = rows[j].getElementsByTagName('td');

                        cols[i].style.display = cols[i].style.display === 'none' ? '' : 'none';
                    }
                });
            }

            menu.getElementsByTagName('ul')[0].removeChild(menu.getElementsByClassName('context-line')[0]);

            const rect      = tpl.parentElement.getBoundingClientRect();
            menu.style.top  = (event.clientY - rect.top) + "px";
            menu.style.left = (event.clientX - rect.left) + "px";

            document.addEventListener('click', Table.hideMenuClickHandler);
        });
    };

    static hideMenuClickHandler(event)
    {
        const menu             = document.getElementById('table-context-menu');
        const isClickedOutside = !menu.contains(event.target);

        if (isClickedOutside) {
            menu.parentNode.removeChild(menu);
            document.removeEventListener('click', Table.hideMenuClickHandler);
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
     * @since 1.0.0
     */
    bindReorder(sorting, id)
    {
        sorting.addEventListener('click', function (event)
        {
            jsOMS.preventAll(event);

            const table   = document.getElementById(id),
                rows      = table.getElementsByTagName('tbody')[0].rows,
                rowLength = rows.length,
                rowId     = this.closest('tr').rowIndex - 1,
                orderType = jsOMS.hasClass(this, 'order-up') ? 1 : -1;

            if (orderType === 1 && rowId > 0) {
                rows[rowId].parentNode.insertBefore(rows[rowId], rows[rowId - 1]);
            } else if (orderType === -1 && rowId < rowLength) {
                rows[rowId].parentNode.insertBefore(rows[rowId], rows[rowId + 2]);
            }
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
     * @since 1.0.0
     */
    bindSorting(sorting, id)
    {
        sorting.addEventListener('click', function (event)
        {
            const table   = document.getElementById(id),
                rows      = table.getElementsByTagName('tbody')[0].rows,
                rowLength = rows.length,
                cellId    = this.closest('td').cellIndex,
                sortType  = jsOMS.hasClass(this, 'sort-asc') ? 1 : -1;

            let j, i, row1, row2, content1, content2,
                order        = false,
                shouldSwitch = false;

            const columnName = this.closest('td').getAttribute('data-name');

            // only necessary for retrieving remote data
            table.setAttribute('data-sorting', (sortType > 0 ? '+' : '-') + (columnName !== null ? columnName : cellId));

            if (table.getAttribute('data-src') !== null) {
                Table.getRemoteData(table);
                return;
            }

            do {
                order = false;

                for (j = 0; j < rowLength - 1; ++j) {
                    shouldSwitch = false;
                    row1         = rows[j].getElementsByTagName('td')[cellId];
                    content1     = row1.getAttribute('data-content') !== null ? row1.getAttribute('data-content').toLowerCase() : row1.textContent.toLowerCase();
                    content1     = !isNaN(content1)
                                    ? parseFloat(content1)
                                    : (!isNaN(new Date(content1))
                                        ? new Date(content1)
                                        : content1);

                    for (i = j + 1; i < rowLength; ++i) {
                        row2     = rows[i].getElementsByTagName('td')[cellId];
                        content2 = row2.getAttribute('data-content') !== null ? row2.getAttribute('data-content').toLowerCase() : row2.textContent.toLowerCase();
                        content2 = !isNaN(content2)
                                    ? parseFloat(content2)
                                    : (!isNaN(new Date(content2))
                                        ? new Date(content2)
                                        : content2);

                        if (sortType === 1 && content1 > content2) {
                            shouldSwitch = true;
                            break;
                        } else if (sortType === -1 && content1 < content2) {
                            shouldSwitch = true;
                            break;
                        }
                    }

                    if (shouldSwitch === true) {
                        break;
                    }
                }

                if (shouldSwitch) {
                    rows[j].parentNode.insertBefore(rows[i], rows[j]);
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
     * @since 1.0.0
     */
    bindFiltering(filtering, id)
    {
        filtering.addEventListener('click', function (event)
        {

        });
    };

    /**
     * Checkbox select.
     *
     * @param {Element} checkbox Filter button
     * @param {Object}  id       Table id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bindCheckbox(checkbox, id)
    {
        checkbox.addEventListener('click', function (event)
        {
            const columnId  = checkbox.closest('td').cellIndex;
            const rows      = checkbox.closest('table').querySelectorAll('tbody tr');
            const rowLength = rows.length;
            const status    = checkbox.checked;

            for (let i = 0; i < rowLength; ++i) {
                const box = rows[i].cells[columnId].querySelector('input[type=checkbox]');

                if (box !== null) {
                    box.checked = status;
                }
            }
        });
    }

    static getRemoteData (table)
    {
        const data = {
            limit: table.getAttribute('data-limit'),
            offset: table.getAttribute('data-offset'),
            sorting: table.getAttribute('data-sorting'),
            filter: table.getAttribute('data-filter')
        };

        const request = new Request();
        request.setData(data);
        request.setType(ResponseType.JSON);
        request.setUri(table.getAttribute('data-src'));
        request.setMethod('GET');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr) {
            Table.emptyTable(table.getElementsByTagName('tbody')[0]);
            Table.addToTable(table.getElementsByTagName('tbody')[0], JSON.parse(xhr.response)[0]);
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

            // @todo: bind buttons if required (e.g. remove, edit button)
        }
    };
};
