import { jsOMS } from '../Utils/oLib.js';
import { HttpUri }  from './HttpUri.js';
import { FormView } from './../Views/FormView.js';

/**
 * Uri factory.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 *
 * @todo Karaka/phpOMS#239
 *  Optional parameters
 *  Sometimes we need to define a list of optional parameters that will be filled if they exist and only if they exist.
 *  E.g. `u=` for unit `filter=` for filtering etc.
 *  Otherwise the url on some pages keeps getting longer and longer because parameters get appended.
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
    static setQuery (key, value, overwrite = true)
    {
        if (overwrite || !Object.prototype.hasOwnProperty.call(UriFactory.uri, key)) {
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
        return Object.prototype.hasOwnProperty.call(UriFactory.uri, key) ? UriFactory.uri[key] : null;
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
        if (Object.prototype.hasOwnProperty.call(UriFactory.uri, key)) {
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
            if (Object.prototype.hasOwnProperty.call(UriFactory.uri, key) && regexp.test(key)) {
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
        // The fragment is ignored in such a case.
        const parsed = HttpUri.parseUrl(url);
        const pars   = [];

        if (url.includes('?')) {
            // unique queries
            const parts = typeof parsed.query === 'undefined' ? [] : parsed.query.replace(/\?/g, '&').split('&');

            const comps  = {};
            const length = parts.length;
            let spl      = null;

            // fix bug for queries such as https://127.0.0.1/test?something#frag where no value is specified for a query parameter
            if ((typeof parsed.fragment === 'undefined' || parsed.fragment === null)
                && parts[length - 1].includes('#')
            ) {
                const lastQuery = parts[length - 1].split('#')[1];

                parsed.fragment   = lastQuery[1];
                parts[length - 1] = lastQuery[0];
            }

            for (let i = 0; i < length; ++i) {
                spl           = parts[i].split('=');
                comps[spl[0]] = spl.length < 2 ? '' : spl[1];
            }

            for (const a in comps) {
                if (Object.prototype.hasOwnProperty.call(comps, a) && comps[a] !== '' && comps[a] !== null && typeof comps[a] !== 'undefined') {
                    pars.push(a + '=' + (comps[a].includes('%') ? comps[a] : encodeURIComponent(comps[a])));
                } else if (Object.prototype.hasOwnProperty.call(comps, a)) {
                    pars.push(a);
                }
            }
        }

        const fragments = typeof parsed.fragment !== 'undefined' ? parsed.fragment.split('#') : null;

        url = (typeof parsed.scheme !== 'undefined' ? parsed.scheme + '://' : '')
            + (typeof parsed.username !== 'undefined' ? parsed.username + ':' : '')
            + (typeof parsed.password !== 'undefined' ? parsed.password + '@' : '')
            + (typeof parsed.host !== 'undefined' ? parsed.host : '')
            + (typeof parsed.port !== 'undefined' ? ':' + parsed.port : '')
            + (typeof parsed.path !== 'undefined' ? parsed.path : '')
            + (typeof parsed.query !== 'undefined' ? '?' + pars.join('&') : '')
            + (typeof parsed.fragment !== 'undefined' ? '#' + fragments[fragments.length - 1] : '');

        return url;
    };

    static buildAbsolute (uri, toMatch = null)
    {
        if (uri.startsWith('/')) {
            return UriFactory.build(window.location.origin + uri, toMatch);
        } else if (uri.indexOf('://') === -1) {
            return UriFactory.build(window.location.origin + '/' + uri, toMatch);
        }

        return uri;
    };

    /**
     * Build uri
     *
     * # = DOM id
     * . = DOM class
     * / = Current path
     * ? = Current query
     * @ = Name attribute
     * $ =
     * % = Current url
     * ! = Query selector
     *
     * @param {string}      uri       Raw uri
     * @param {null|Object} [toMatch] Key/value pair to replace in raw
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static build (uri, toMatch = null)
    {
        const current = HttpUri.parseUrl(window.location.href);

        const query = HttpUri.getAllUriQueryParameters(typeof current.query === 'undefined' ? {} : current.query);
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key)) {
                UriFactory.setQuery('?' + key, query[key]);
            }
        }

        let parsed = uri.replace(new RegExp('\{[\/#\?%@\.\$\!].*?\}', 'g'), function (match) {
            match = match.substring(1, match.length - 1);

            if (toMatch !== null && Object.prototype.hasOwnProperty.call(toMatch, match)) {
                return toMatch[match];
            } else if (typeof UriFactory.uri[match] !== 'undefined') {
                return UriFactory.uri[match];
            } else if (match.indexOf('!') === 0) {
                const e = document.querySelector(match.substring(1));

                if (!e) {
                    return '';
                }

                if (e.tagName.toLowerCase() !== 'form') {
                    return e.value;
                }

                let value  = '';
                const form = (new FormView(e.id)).getData();

                for (const pair of form.entries()) {
                    value += '&' + pair[0] + '=' + pair[1];
                }

                return value;
            } else if (match.indexOf('?') === 0) {
                return HttpUri.getUriQueryParameter(current.query, match.substring(1));
            } else if (match === '#') {
                return current.fragment;
            } else if (match.indexOf('#') === 0) {
                const e = document.getElementById(match.substring(1));

                if (e) {
                    if (e.tagName.toLowerCase() !== 'form') {
                        return e.value;
                    }

                    let value  = '';
                    const form = (new FormView(e.id)).getData();

                    for (const pair of form.entries()) {
                        value += '&' + pair[0] + '=' + pair[1];
                    }

                    return value;
                }

                return '';
            } else if (match.indexOf('?') === 0) {
                return current.query();
            } else if (match.indexOf('/') === 0) {
                return current.path;
            } else if (match.indexOf(':user') === 0) {
                return current.user;
            } else if (match.indexOf(':pass') === 0) {
                return current.pass;
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
     * @param {HttpUri} uri Uri
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
    };
};

/**
 * Uri values
 *
 * @var {Object}
 * @since 1.0.0
 */
UriFactory.uri = {};
