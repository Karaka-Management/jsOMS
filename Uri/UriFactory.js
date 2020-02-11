import { Http } from './Http.js';
import { FormView } from './../Views//FormView.js';

/**
 * Uri factory.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class UriFactory
{
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

        if (overwrite || !UriFactory.uri.hasOwnProperty(key)) {
            UriFactory.uri[key] = value;

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
     * @since 1.0.0
     */
    static getQuery (key)
    {
        return UriFactory.uri.hasOwnProperty(key) ? UriFactory.uri[key] : null;
    };

    /**
     * Clear all uri components
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    static clearAll ()
    {
        UriFactory.uri = {};

        return true;
    };

    /**
     * Clear uri component
     *
     * @param {string} key Uri key for component
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    static clear (key)
    {
        if (UriFactory.uri.hasOwnProperty(key)) {
            delete UriFactory.uri[key];

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
     * @since 1.0.0
     */
    static clearLike (pattern)
    {
        let success  = false;
        const regexp = new RegExp(pattern);

        for (const key in UriFactory.uri) {
            if (UriFactory.uri.hasOwnProperty(key) && regexp.test(key)) {
                delete UriFactory.uri[key];
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
            for (const a in comps) {
                if (comps.hasOwnProperty(a)) {
                    pars.push(a + '=' + comps[a]);
                }
            }

            url = full + '?' + pars.join('&');
        }

        // unique fragments
        const fragments = url.match(/\#[a-zA-Z0-9\-,]+/g),
            fragLength  = fragments !== null ? fragments.length : 0;

        for (let i = 0; i < fragLength - 1; ++i) {
            // remove all from old url
            url = url.replace(fragments[i], '');
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
        const current = Http.parseUrl(window.location.href);
        let parsed    = uri.replace(new RegExp('\{[\/#\?%@\.\$][a-zA-Z0-9\-]*\}', 'g'), function (match)
            {
                match = match.substr(1, match.length - 2);

                if (typeof toMatch !== 'undefined' && toMatch.hasOwnProperty(match)) {
                    return toMatch[match];
                } else if (typeof UriFactory.uri[match] !== 'undefined') {
                    return UriFactory.uri[match];
                } else if (match.indexOf('#') === 0) {
                    const e = document.getElementById(match.substr(1));

                    if (e) {
                        if (e.tagName.toLowerCase() !== 'form') {
                            return e.value;
                        }

                        let value  = '';
                        const form = (new FormView(e.id)).getData();

                        for (let pair of form.entries()) {
                            value += '&' + pair[0] + '=' + pair[1];
                        }

                        return value;
                    }

                    return '';
                } else if (match.indexOf('?') === 0) {
                    return Http.getUriQueryParameter(current.query, match.substr(1));
                } else if (match.indexOf('/') === 0) {
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

        return UriFactory.unique(parsed);
    };

    /**
     * Set uri builder components.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    static setupUriBuilder (uri)
    {
        UriFactory.setQuery('/scheme', uri.getScheme());
        UriFactory.setQuery('/host', uri.getHost());
        UriFactory.setQuery('/base', jsOMS.rtrim(uri.getBase(), '/'));
        UriFactory.setQuery('?', uri.getQuery());
        UriFactory.setQuery('%', uri.getUri());
        UriFactory.setQuery('#', uri.getFragment());
        UriFactory.setQuery('/', uri.getPath());
        UriFactory.setQuery(':user', uri.getUser());
        UriFactory.setQuery(':pass', uri.getPass());

        const query = uri.getQuery();

        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                UriFactory.setQuery('?' + key, query[key]);
            }
        }
    };
};

/**
 * Uri values
 *
 * @var {Object}
 * @since 1.0.0
 */
UriFactory.uri = {};

