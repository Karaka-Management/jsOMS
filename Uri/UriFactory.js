(function (uriFactory, undefined) {
    jsOMS.UriFactory = {};
    jsOMS.UriFactory.uri = {};

    jsOMS.UriFactory.parseUrl = function (str, component)
    {
        let query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                'relative', 'path', 'directory', 'file', 'query', 'fragment'
            ],
            ini = {},
            mode = 'php',
            parser = {
                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
            };

        let m = parser[mode].exec(str),
            uri = {},
            i = 14;

        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            }
        }

        if (component) {
            return uri[component.replace('PHP_URL_', '').toLowerCase()];
        }

        if (mode !== 'php') {
            let name = 'queryKey';
            parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
            uri[name] = {};
            query = uri[key[12]] || '';

            query.replace(parser, function ($0, $1, $2)
            {
                if ($1) {
                    uri[name][$1] = $2;
                }
            });
        }

        delete uri.source;

        return uri;
    };

    /**
     * Get Uri query parameters.
     *
     * @param {string} query Uri query
     * @param {string} name Name of the query to return
     *
     * @return {null|string}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.UriFactory.getUriQueryParameter = function (query, name)
    {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        let regex = new RegExp("[\\?&]*" + name + "=([^&#]*)"),
            results = regex.exec(query);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    jsOMS.UriFactory.setQuery = function(key, value, overwrite)
    {
        overwrite = typeof overwrite !== 'undefined' ? overwrite : true;

        if(overwrite || !jsOMS.UriFactory.uri.hasProperty(key)) {
            jsOMS.UriFactory.uri[key] = value;

            return true;
        }

        return false;
    };

    jsOMS.UriFactory.build = function(uri, toMatch)
    {
        let current = jsOMS.UriFactory.parseUrl(window.location.href);
        // match(new RegExp("\{[#\?\.a-zA-Z0-9]*\}", "gi"));

        return uri.replace('\{[\/#\?@\.\$][a-zA-Z0-9]*\}' function(match) {
            match = substr(match[0], 1, match[0].length - 2);

            if(toMatch.hasProperty(match)) {
                return toMatch[match];
            } else if(jsOMS.UriFactory.uri[match] !== 'undefined') {
                return jsOMS.UriFactory.uri[match];
            } else if (match.indexOf('#') === 0) {
                return document.getElementById(match.substring(1, match.length)).value;
            } else if(match.indexOf('?') === 0) {
                return jsOMS.UriFactory.getUriQueryParameter(current.query, match.substring(1, match.length));
            } else if(match.indexOf('/') === 0) {
                // todo: second match should return second path
                return 'ERROR PATH';
            } else {
                return match;
            }
        });
    };
}(window.jsOMS = window.jsOMS || {}));