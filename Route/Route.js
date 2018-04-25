(function (jsOMS) {
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Route');

    jsOMS.Route.Route = class {
        // TODO: create comments
        constructor ()
        {
            this.routes = null;
        };

        // TODO: create comments
        add (path, callback, exact)
        {
            exact = typeof exact !== 'undefined' ? exact : true;

            // todo: create array key path like i did for php
        };
    }
}(window.jsOMS = window.jsOMS || {}));
