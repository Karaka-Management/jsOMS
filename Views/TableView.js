/**
 * Table view.
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
export class TableView
{
    /**
     * @constructor
     *
     * @param {string} id Table id
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
     * @return {Object}
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
     * @return {Array}
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
     * @return {Array}
     *
     * @since 1.0.0
     */
    getFilter()
    {
        return document.querySelectorAll(
            '#' + this.id + ' .filter'
        );
    };

    /**
     * Get table header
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    getHeader()
    {
        return document.querySelector(
            '#' + this.id + ' thead'
        );
    };

    /**
     * Get table header elements which provide filter functionality
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    getCheckboxes()
    {
        return document.querySelectorAll(
            '#' + this.id + ' thead input[type=checkbox]'
        );
    };

    /**
     * Get row elements which allow to swap the current row with another row
     *
     * @return {Array}
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
