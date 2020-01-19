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
 * @todo Orange-Management/jsOMS#50
 *  Add basic table handling (no db and pagination)
 *
 * @todo Orange-Management/jsOMS#55
 *  Implement filtering and sorting based on backend
 *
 * @todo Orange-Management/jsOMS#57
 *  Advanced filtering
 *  The current filtering implementation is only column by column connected with &&.
 *  Consider to implement a much more advanced filtering where different combinations are possible such as || &&, different ordering with parenthesis etc.
 *  This can be extremely powerful but will be complex for standard users.
 *  This advanced filtering should probably be a little bit hidden?
 *
 * @todo Orange-Management/jsOMS#59
 *  Data download
 *  There is a small icon in the top right corner of tables which allows (not yet to be honest) to download the data in the table.
 *  Whether the backend should be queried for this or only the frontend data should be collected (current situation) should depend on if the table has an api endpoint defined.
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
         * @todo Orange-Management/jsOMS#89
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
             * @todo Orange-Management/jsOMS#90
             *  mplement export
             *  Either create download in javascript from this data or make round trip to server who then sends the data.
             *  The export should be possible (if available) in json, csv, excel, word, pdf, ...
             *  If no endpoint is specified or reachable the client side should create a json or csv export.
             */
        });
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
                rowId     = this.closest('tr').rowIndex,
                orderType = jsOMS.hasClass(this, 'order-up') ? 1 : -1;


            if (orderType === 1 && rowId > 1) {
                rows[rowId].parentNode.insertBefore(rows[rowId - 2], rows[rowId]);
            } else if (orderType === -1 && rowId < rowLength) {
                rows[rowId - 1].parentNode.insertBefore(rows[rowId], rows[rowId - 1]);
            }

            // continue implementation
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
                Table.getRemoteData(table);
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
     * @since 1.0.0
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
            output.firstElementChild.setAttribute('data-ui', this.closest('table').id);
            output.firstElementChild.setAttribute('data-ui-column', this.closest('td').cellIndex);

            // todo: set existing filtering option in ui here

            output.firstElementChild.querySelectorAll('button[type="submit"], input[type="submit"]')[0].addEventListener('click', function (event) {
                jsOMS.preventAll(event);

                const input  = document.getElementById('table-filter').querySelectorAll('input, select');
                const length = input.length;

                let filter = [];

                for (let i = 0; i < length; ++i) {
                    filter.push(input[i].value);
                }

                const table = document.getElementById(document.getElementById('table-filter').getAttribute('data-ui'));

                table.querySelectorAll('thead td')[
                    document.getElementById('table-filter').getAttribute('data-ui-column')
                ].setAttribute('data-filter', JSON.stringify(filter));

                /**
                 * @todo Orange-Management/jsOMS#88
                 *  If a filter is active it should be highlighted/marked in the table
                 *
                 * @todo Orange-Management/jsOMS#89
                 *  Filter locally and if a data-src is defined a remote filtering endpoint should be used.
                 */

                document.getElementById('table-filter').parentNode.removeChild(document.getElementById('table-filter'));

                if (table.getAttribute('data-src') !== null) {
                    Table.getRemoteData(table);
                    return;
                }
            });

            output.firstElementChild.querySelectorAll('button[type="reset"], input[type="reset"]')[0].addEventListener('click', function (event) {
                document.getElementById('table-filter').parentNode.removeChild(document.getElementById('table-filter'));
            });

            tpl.parentNode.appendChild(output);
        });
    };

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

            // todo: bind buttons if required (e.g. remove, edit button)
        }
    };
};
