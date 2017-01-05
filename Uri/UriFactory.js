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
     * Clear all uri components
     *
     * @return {boolean}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.clearAll = function() 
    {
        jsOMS.Uri.UriFactory.uri = {};

        return true;
    };

    /**
     * Clear uri component
     *
     * @param {string} key Uri key for component
     * 
     * @return {boolean}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.clear = function(key)
    {
        if(jsOMS.Uri.UriFactory.uri.hasOwnProperty(key)) {
            delete jsOMS.Uri.UriFactory.uri[key];

            return true;
        }

        return false;
    };

    /**
     * Clear uri components that follow a certain pattern
     *
     * @param {string} pattern Uri key pattern to remove
     * 
     * @return {boolean}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.UriFactory.clearLike = function(pattern) 
    {
        let success = false;
        const regexp = new Regexp(pattern);

        for(let key in jsOMS.Uri.UriFactory.uri) {
            if(jsOMS.Uri.UriFactory.uri.hasOwnProperty(key) && regexp.test(key)) {
                delete jsOMS.Uri.UriFactory.uri[key];
                success = true;
            }
        }

        return success;
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
        const parts = url.split('?');

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
        const current = jsOMS.Uri.Http.parseUrl(window.location.href);
        let parsed  = uri.replace(new RegExp('\{[\/#\?%@\.\$][a-zA-Z0-9\-]*\}', 'g'), function (match)
            {
                match = match.substr(1, match.length - 2);

                if (typeof toMatch !== 'undefined' && toMatch.hasProperty(match)) {
                    return toMatch[match];
                } else if (typeof jsOMS.Uri.UriFactory.uri[match] !== 'undefined') {
                    return jsOMS.Uri.UriFactory.uri[match];
                } else if (match.indexOf('#') === 0) {
                    return document.getElementById(match.substr(1)).value;
                } else if (match.indexOf('?') === 0) {
                    return jsOMS.Uri.Http.getUriQueryParameter(current.query, match.substr(1));
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