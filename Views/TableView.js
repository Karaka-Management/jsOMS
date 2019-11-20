/**
 * Table view.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class TableView {
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor (id) {
        this.id = id;

        this.bind();
    };

    /**
     * Bind the table
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    bind ()
    {
        const e = document.getElementById(this.id);
    };

    /**
     * Serialize table data
     *
     * @return {object}
     *
     * @since 1.0.0
     */
    serialize()
    {
        const table = document.getElementById(this.id);
        let data    = {
            caption: null,
            header: [],
            rows: []
        };

        data.caption = table.getElementsByTagName('caption')[0].innerText;

        const header     = table.querySelectorAll('thead tr td, thead tr th'),
            headerLength = header.length;

        for (let i = 0; i < headerLength; ++i) {
            data.header.push(header[i].innerText);
        }

        const rows     = table.querySelectorAll('tbody tr'),
            rowsLength = rows.length;

        for (let i = 0; i < rowsLength; ++i) {
            data.rows[i] = [];

            const columns    = rows[i].querySelectorAll('td, th'),
                columnLength = columns.length;

            for (let j = 0; j < columnLength; ++j) {
                data.rows[i].push(columns[j].innerText);
            }
        }

        return data;
    }

    /**
     * Get table export button
     *
     * @return {HTMLElement}
     *
     * @since 1.0.0
     */
    getExport()
    {
        return document.querySelectorAll('#' + this.id + ' .download')[0];
    };

    /**
     * Get table header elements which provide sorting
     *
     * @return {array}
     *
     * @since 1.0.0
     */
    getSorting()
    {
        return document.querySelectorAll(
            '#' + this.id + ' thead .sort-asc,'
            + ' #' + this.id + ' thead .sort-desc'
        );
    };

    /**
     * Get table header elements which provide filter functionality
     *
     * @return {array}
     *
     * @since 1.0.0
     */
    getFilter()
    {
        return document.querySelectorAll(
            '#' + this.id + ' thead .filter'
        );
    };

    /**
     * Get row elements which allow to swap the current row with another row
     *
     * @return {array}
     *
     * @since 1.0.0
     */
    getSortableRows()
    {
        return document.querySelectorAll(
            '#' + this.id + ' tbody .order-up,'
            + ' #' + this.id + ' tbody .order-down'
        );
    };
};
