(function (jsOMS) {
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Views');

    jsOMS.Views.TableView = class {
        constructor (id) {
            this.id = id;

            this.bind();
        };

        bind ()
        {
            const e = document.getElementById(this.id);
        };

        /**
         * Get sorting elements
         *
         * @return {Object}
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

        getFilter()
        {
            return document.querySelectorAll(
                '#' + this.id + ' thead .filter'
            );
        };
    }
}(window.jsOMS = window.jsOMS || {}));
