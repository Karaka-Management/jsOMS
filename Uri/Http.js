/**
 * Uri factory.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Uri.UriFactory */
    jsOMS.Autoloader.defineNamespace('jsOMS.Uri.Http');

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.Http = function (uri)
    {
        this.uri         = '';
        this.scheme      = '';
        this.host        = '';
        this.port        = '';
        this.user        = '';
        this.pass        = '';
        this.query       = null;
        this.queryString = '';
        this.fragment    = '';
        this.base        = '';

        this.set(uri);
    };

    /**
     * Parse uri
     *
     * @param {string} str Url to parse
     * @param {string} mode Parsing mode
     *
     * @return {Object}
     *
     * @throws {Error}
     *
     * @function
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.Http.parseUrl = function (str, mode)
    {
        mode = typeof mode === 'undefined' ? 'php' : mode;

        let query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                'relative', 'path', 'directory', 'file', 'query', 'fragment'
            ],
            parser     = {
                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
            };

        if (!parser.hasOwnProperty(mode)) {
            throw new Error('Unexpected parsing mode.', 'UriFactory', 52);
        }

        let m   = parser[mode].exec(str),
            uri = {},
            i   = 14;

        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            }
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
    jsOMS.Uri.Http.getUriQueryParameter = function (query, name)
    {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        let regex   = new RegExp("[\\?&]*" + name + "=([^&#]*)"),
            results = regex.exec(query);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    jsOMS.Uri.Http.getAllUriQueryParameters = function (query)
    {
        let keyValPairs = [],
            params      = {},
            pairNum     = null;

        if (query.length) {
            keyValPairs = query.split('&');

            for (pairNum in keyValPairs) {
                let key = keyValPairs[pairNum].split('=')[0];

                if (!key.length) {
                    continue;
                }

                if (typeof params[key] === 'undefined') {
                    params[key] = [];
                }

                params[key].push(keyValPairs[pairNum].split('=')[1]);
            }
        }

        return params;
    };

    jsOMS.Uri.Http.prototype.set = function (uri)
    {
        this.uri = uri;

        let parsed = jsOMS.Uri.Http.parseUrl(this.uri, 'php');

        this.scheme = parsed['scheme'];
        this.host   = parsed['host'];
        this.port   = parsed['port'];
        this.user   = parsed['user'];
        this.pass   = parsed['pass'];
        this.path   = parsed['path'];

        if (this.path.endsWith('.php')) {
            this.path = this.path.substr(0, -4);
        }

        this.queryString = parsed['query'];

        if (this.queryString !== null) {
            this.query = jsOMS.Uri.Http.getAllUriQueryParameters(this.queryString);
        }

        this.fragment = parsed['fragment'];
        this.base     = this.scheme + '://' + this.host;

        this.setupUriBuilder();
    };

    jsOMS.Uri.Http.prototype.setupUriBuilder = function ()
    {
        jsOMS.Uri.UriFactory.setQuery('/scheme', this.scheme);
        jsOMS.Uri.UriFactory.setQuery('/host', this.host);
        jsOMS.Uri.UriFactory.setQuery('/base', this.base);
        jsOMS.Uri.UriFactory.setQuery('?', this.queryString);
        jsOMS.Uri.UriFactory.setQuery('%', this.uri);
        jsOMS.Uri.UriFactory.setQuery('#', this.fragment);
        jsOMS.Uri.UriFactory.setQuery('/', this.path);
        jsOMS.Uri.UriFactory.setQuery(':user', this.user);
        jsOMS.Uri.UriFactory.setQuery(':pass', this.pass);

        for (let key in this.query) {
            if (this.query.hasOwnProperty(key)) {
                jsOMS.Uri.UriFactory.setQuery('?' + key, this.query[key]);
            }
        }
    };
}(window.jsOMS = window.jsOMS || {}));