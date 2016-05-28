/**
 * Uri factory.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (uriFactory, undefined)
{
    /** @namespace jsOMS.Uri.UriFactory */
    jsOMS.Autoloader.defineNamespace('jsOMS.Uri.UriFactory');

    /**
     * Uri values
     *
     * @var {Object}
     * @since 1.0.0
     */
    jsOMS.Uri.UriFactory.uri = {};

    /**
     * Parse uri
     *
     * @return {Object}
     *
     * @function
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.parseUrl = function (str)
    {
        let query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                'relative', 'path', 'directory', 'file', 'query', 'fragment'
            ],
            mode       = 'php',
            parser     = {
                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
            };

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
    jsOMS.Uri.UriFactory.getUriQueryParameter = function (query, name)
    {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        let regex   = new RegExp("[\\?&]*" + name + "=([^&#]*)"),
            results = regex.exec(query);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    /**
     * Set uri query
     *
     * @param {string} key Query key
     * @param {string} value Query value
     * @param {boolean} overwrite Overwrite if already exists?
     *
     * @return {boolean}
     *
     * @function
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.setQuery = function (key, value, overwrite)
    {
        overwrite = typeof overwrite !== 'undefined' ? overwrite : true;

        if (overwrite || !jsOMS.Uri.UriFactory.uri.hasProperty(key)) {
            jsOMS.Uri.UriFactory.uri[key] = value;

            return true;
        }

        return false;
    };

    /**
     * Build uri
     *
     * @param {string} uri Raw uri
     * @param {Object} toMatch Key/value pair to replace in raw
     *
     * @function
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.build = function (uri, toMatch)
    {
        let current = jsOMS.Uri.UriFactory.parseUrl(window.location.href);

        return uri.replace(new RegExp('\{[\/#\?@\.\$][a-zA-Z0-9]*\}', 'g'), function (match)
        {
            match = match.substr(1, match.length - 2);

            if (typeof toMatch !== 'undefined' && toMatch.hasProperty(match)) {
                return toMatch[match];
            } else if (jsOMS.Uri.UriFactory.uri[match] !== 'undefined') {
                return jsOMS.Uri.UriFactory.uri[match];
            } else if (match.indexOf('#') === 0) {
                return document.getElementById(match.substring(1, match.length)).value;
            } else if (match.indexOf('?') === 0) {
                return jsOMS.Uri.UriFactory.getUriQueryParameter(current.query, match.substring(1, match.length));
            } else if (match.indexOf('/') === 0) {
                // todo: second match should return second path
                return 'ERROR PATH';
            } else {
                return match;
            }
        });
    };
}(window.jsOMS = window.jsOMS || {}));