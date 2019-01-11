/**
 * Uri factory.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.Uri.UriFactory */
    jsOMS.Autoloader.defineNamespace('jsOMS.Uri.UriFactory');

    jsOMS.Uri.UriFactory = class {
        /**
         * Set uri query
         *
         * @param {string}  key         Query key
         * @param {string}  value       Query value
         * @param {boolean} [overwrite] Overwrite if already exists?
         *
         * @return {boolean}
         *
         * @since 1.0.0
         */
        static setQuery (key, value, overwrite)
        {
            overwrite = typeof overwrite !== 'undefined' ? overwrite : true;

            if (overwrite || !jsOMS.Uri.UriFactory.uri.hasOwnProperty(key)) {
                jsOMS.Uri.UriFactory.uri[key] = value;

                return true;
            }

            return false;
        };

        /**
         * Get query
         *
         * @param {string} key
         *
         * @return {null|string}
         *
         * @since  1.0.0
         */
        static getQuery (key)
        {
            return jsOMS.Uri.UriFactory.uri.hasOwnProperty(key) ? jsOMS.Uri.UriFactory.uri[key] : null;
        };

        /**
         * Clear all uri components
         *
         * @return {boolean}
         *
         * @since  1.0.0
         */
        static clearAll ()
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
         * @since  1.0.0
         */
        static clear (key)
        {
            if (jsOMS.Uri.UriFactory.uri.hasOwnProperty(key)) {
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
         * @since  1.0.0
         */
        static clearLike (pattern)
        {
            let success  = false;
            const regexp = new RegExp(pattern);

            for (let key in jsOMS.Uri.UriFactory.uri) {
                if (jsOMS.Uri.UriFactory.uri.hasOwnProperty(key) && regexp.test(key)) {
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
         * @since 1.0.0
         */
        static unique (url)
        {
            // unique queries
            const parts = url.replace(/\?/g, '&').split('&'),
                full    = parts[0];

            if (parts.length > 1) {
                parts.shift();

                let comps  = {},
                    spl    = null,
                    length = parts.length;

                for (let i = 0; i < length; ++i) {
                    spl           = parts[i].split('=');
                    comps[spl[0]] = spl[1];
                }

                let pars = [];
                for (let a in comps) {
                    if (comps.hasOwnProperty(a)) {
                        pars.push(a + '=' + comps[a]);
                    }
                }

                url = full + '?' + pars.join('&');
            }

            // unique fragments
            const fragments = url.match(/\#[a-zA-Z0-9\-,]+/g),
                fragLength = fragments !== null ? fragments.length : 0;

            for (let i = 0; i < fragLength; ++i) {
                url = url.replace(fragments[i], '');
            }

            if (fragLength > 0) {
                const fragList = fragments[fragLength - 1].split(','),
                    fragListLength = fragList.length;
                let fragListNew = [];

                for (let i = 0; i < fragListLength; ++i) {
                    if (!fragListNew.includes(fragList[i]) && fragList[i] !== '') {
                        fragListNew.push(fragList[i]);
                    }
                }

                url += fragListNew.join(',');
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
         * @param {string} uri       Raw uri
         * @param {Object} [toMatch] Key/value pair to replace in raw
         *
         * @return {string}
         *
         * @since 1.0.0
         */
        static build (uri, toMatch)
        {
            const current = jsOMS.Uri.Http.parseUrl(window.location.href);
            let parsed    = uri.replace(new RegExp('\{[\/#\?%@\.\$][a-zA-Z0-9\-]*\}', 'g'), function (match)
                {
                    match = match.substr(1, match.length - 2);

                    if (typeof toMatch !== 'undefined' && toMatch.hasOwnProperty(match)) {
                        return toMatch[match];
                    } else if (typeof jsOMS.Uri.UriFactory.uri[match] !== 'undefined') {
                        return jsOMS.Uri.UriFactory.uri[match];
                    } else if (match.indexOf('#') === 0) {
                        const e = document.getElementById(match.substr(1));

                        if (e) {
                            return e.value;
                        }

                        return '';
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

            return jsOMS.Uri.UriFactory.unique(parsed);
        };

        /**
         * Set uri builder components.
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        static setupUriBuilder (uri)
        {
            jsOMS.Uri.UriFactory.setQuery('/scheme', uri.getScheme());
            jsOMS.Uri.UriFactory.setQuery('/host', uri.getHost());
            jsOMS.Uri.UriFactory.setQuery('/base', jsOMS.rtrim(uri.getBase(), '/'));
            jsOMS.Uri.UriFactory.setQuery('?', uri.getQuery());
            jsOMS.Uri.UriFactory.setQuery('%', uri.getUri());
            jsOMS.Uri.UriFactory.setQuery('#', uri.getFragment());
            jsOMS.Uri.UriFactory.setQuery('/', uri.getPath());
            jsOMS.Uri.UriFactory.setQuery(':user', uri.getUser());
            jsOMS.Uri.UriFactory.setQuery(':pass', uri.getPass());

            const query = uri.getQuery();

            for (let key in query) {
                if (query.hasOwnProperty(key)) {
                    jsOMS.Uri.UriFactory.setQuery('?' + key, query[key]);
                }
            }
        };
    }

    /**
     * Uri values
     *
     * @var {Object}
     * @since 1.0.0
     */
    jsOMS.Uri.UriFactory.uri = {};
}(window.jsOMS = window.jsOMS || {}));
