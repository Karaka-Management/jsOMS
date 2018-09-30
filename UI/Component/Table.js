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
         * @method
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
         * @method
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
        };

        bindRemovable(remove, id)
        {
            remove.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);

                document.getElementById(id).deleteRow(this.closest('tr').rowIndex);
            });
        };

        bindReorder(sorting, id)
        {
            sorting.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);

                const table   = document.getElementById(id),
                    rows      = table.getElementsByTagName('tbody')[0].rows,
                    rowLength = rows.length,
                    rowId     = this.closest('tr').rowIndex;

                if (jsOMS.hasClass(this, 'order-up') && rowId > 1) {
                    rows[rowId].parentNode.insertBefore(rows[rowId - 2], rows[rowId]);
                } else if (jsOMS.hasClass(this, 'order-down') && rowId < rowLength) {
                    rows[rowId - 1].parentNode.insertBefore(rows[rowId], rows[rowId - 1]);
                }
            });
        };

        bindSorting(sorting, id)
        {
            sorting.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);

                const table   = document.getElementById(id),
                    rows      = table.getElementsByTagName('tbody')[0].rows,
                    rowLength = rows.length,
                    cellId    = this.closest('td').cellIndex;

                let j, row1, row2, content1, content2,
                    order        = false,
                    shouldSwitch = false;

                do {
                    order = false;

                    for (j = 0; j < rowLength - 1; ++j) {
                        shouldSwitch = false;
                        row1         = rows[j].getElementsByTagName('td')[cellId];
                        row2         = rows[j + 1].getElementsByTagName('td')[cellId];
                        content1     = row1.getAttribute('data-content') !== null ? row1.getAttribute('data-content') : row1.textContent;
                        content2     = row2.getAttribute('data-content') !== null ? row2.getAttribute('data-content') : row2.textContent;

                        if (jsOMS.hasClass(this, 'sort-asc') && content1 > content2) {
                            shouldSwitch = true;
                            break;
                        } else if (jsOMS.hasClass(this, 'sort-desc') && content1 < content2) {
                            shouldSwitch = true;
                            break;
                        }
                    }

                    if (shouldSwitch) {
                        rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
                        order = true;
                    }
                } while (order);
            });
        };

        bindFiltering(filtering, id)
        {
            filtering.addEventListener('click', function (event)
            {
                jsOMS.preventAll(event);
                // filter algorithm here
            });
        };
    }
}(window.jsOMS = window.jsOMS || {}));
