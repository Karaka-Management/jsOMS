(function (jsOMS) {
    "use strict";

    jsOMS.ViewAbstract = class {
        constructor ()
        {
            this.element = null;
            this.data    = [];
        };

        bind (node)
        {
            this.element = node;
        };

        addData(id, data, overwrite)
        {
            overwrite = typeof overwrite !== 'undefined' ? overwrite : false;

            if (typeof this.data[id] === 'undefined' || overwrite) {
                this.data[id] = data;

                return true;
            }

            return false;
        };

        getData(id)
        {
            return typeof this.data[id] !== 'undefined' ? this.data[id] : undefined;
        };
    }
}(window.jsOMS = window.jsOMS || {}));
