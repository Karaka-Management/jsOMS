(function (jsOMS, undefined) {
    jsOMS.Autoloader = {};
    jsOMS.Autoloader.loaded = [];
    jsOMS.Autoloader.namespaced = [];

    jsOMS.Autoloader.defineNamespace = function(namespace)
    {
        if(jsOMS.Autoloader.namespaced.indexOf(namespace) === -1) {
            let paths = namespace.split('.');
            paths.splice(0, 1);

            let length = paths.length,
                current = jsOMS;

            for(let i = 0; i < length; i++) {
                if(typeof current[paths[i]] === 'undefined') {
                    current[paths[i]] = {};
                }

                current = current[paths[i]];
            }

            jsOMS.Autoloader.namespaced.push(namespace);
        }
    };

    jsOMS.Autoloader.initPreloaded = function()
    {
        let scripts = document.getElementsByTagName('script'),
            length = scripts.length;

        for(let i = 0; i < length; i++) {
            scripts[i].src.replace(URL + '/', '');

            if(jsOMS.Autoloader.loaded.indexOf(scripts[i].src) === -1) {
                jsOMS.Autoloader.loaded.push(scripts[i].src);
            }
        }
    };

    jsOMS.Autoloader.setPreloaded = function(file)
    {
        if(jsOMS.Autoloader.loaded.indexOf(file) === -1) {
            jsOMS.Autoloader.loaded.push(file);
        }
    };

    jsOMS.Autoloader.include = function(file, callback)
    {
        let length = file.length;

        for(let i = 0; i < length; i++) {
            if(jsOMS.Autoloader.loaded.indexOf(file) === -1) {
                // todo: implement asset loading and pass callback

                jsOMS.Autoloader.loaded.push(file);
            }
        }
    };
}(window.jsOMS = window.jsOMS || {}));