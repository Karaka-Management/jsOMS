(function (jsOMS) {
    "use strict";

    jsOMS.Autoloader.defineNamespace('jsOMS.Route');

    jsOMS.Route.Route = class {
        constructor ()
        {
            this.routes = null;
        };

        add (path, callback, exact)
        {
            exact = typeof exact !== 'undefined' ? exact : true;

        };
    }
}(window.jsOMS = window.jsOMS || {}));
