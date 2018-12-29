/**
 * Table view.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS) {
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Views');

    jsOMS.Views.TableView = class {
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

        /**
         * Get row elements which allow to remove a row element
         *
         * @return {array}
         *
         * @since 1.0.0
         */
        getRemovable()
        {
            return document.querySelectorAll(
                '#' + this.id + ' tbody .remove'
            );
        };
    }
}(window.jsOMS = window.jsOMS || {}));
