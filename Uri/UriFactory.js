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
    jsOMS.Uri.UriFactory.parseUrl = function (str, mode)
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

        if (overwrite || !jsOMS.Uri.UriFactory.uri.hasOwnProperty(key)) {
            jsOMS.Uri.UriFactory.uri[key] = value;

            return true;
        }

        return false;
    };

    /**
     * Remove multiple definitions of the same parameter
     *
     * The parameters will be recognized from right to left since it's easier to push at the end.
     *
     * @param {string} url Url
     *
     * @return {string}
     *
     * @function
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.unique = function (url)
    {
        let parts = url.split('?');

        if (parts.length >= 2) {
            let full = parts[1],
                pars  = full.split('&'),
                comps = {},
                spl   = null,
                length = pars.length;

            for (let i = 0; i < length; i++) {
                spl           = pars[i].split('=');
                comps[spl[0]] = spl[1];
            }

            pars = [];
            for (let a in comps) {
                if (comps.hasOwnProperty(a)) {
                    pars.push(a + '=' + comps[a]);
                }
            }

            url = parts[0] + '?' + pars.join('&');
        }

        return url;
    };

    /**
     * Build uri
     *
     * # = DOM id
     * . = DOM class
     * / = Current path
     * ? = Current query
     * @ =
     * $ = Other data
     * % = Current url
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
        let current = jsOMS.Uri.UriFactory.parseUrl(window.location.href),
            parsed  = uri.replace(new RegExp('\{[\/#\?%@\.\$][a-zA-Z0-9\-]*\}', 'g'), function (match)
            {
                match = match.substr(1, match.length - 2);

                if (typeof toMatch !== 'undefined' && toMatch.hasProperty(match)) {
                    return toMatch[match];
                } else if (typeof jsOMS.Uri.UriFactory.uri[match] !== 'undefined') {
                    return jsOMS.Uri.UriFactory.uri[match];
                } else if (match.indexOf('#') === 0) {
                    return document.getElementById(match.substr(1)).value;
                } else if (match.indexOf('?') === 0) {
                    return jsOMS.Uri.UriFactory.getUriQueryParameter(current.query, match.substr(1));
                } else if (match.indexOf('/') === 0) {
                    // todo: second match should return second path
                    return 'ERROR PATH';
                } else if (match === '%') {
                    return window.location.href;
                } else {
                    return match;
                }
            });

        if (parsed.indexOf('?') === -1) {
            parsed = parsed.replace('&', '?');
        }

        parsed = jsOMS.Uri.UriFactory.unique(parsed);

        return parsed;
    };
}(window.jsOMS = window.jsOMS || {}));