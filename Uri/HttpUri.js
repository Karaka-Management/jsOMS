/**
 * Http Uri.
 *
 * This class is for creating, modifying and analyzing http uris.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class HttpUri
{
    /**
     * @constructor
     *
     * @param {string} uri Http uri
     *
     * @since 1.0.0
     */
    constructor (uri)
    {
        /** @type {string} uri */
        this.uri = '';

        /** @type {string} scheme */
        this.scheme = '';

        /** @type {string} host */
        this.host = '';

        /** @type {string} port */
        this.port = '';

        /** @type {string} user */
        this.user = '';

        /** @type {string} pass */
        this.pass = '';

        /** @type {null|Object} query */
        this.query = null;

        /** @type {null|string} queryString */
        this.queryString = '';

        /** @type {string} fragment */
        this.fragment = '';

        /** @type {string} base */
        this.base = '';

        /** @type {string} root */
        this.root = '/';

        this.set(uri);
    };

    /**
     * Parse uri
     *
     * @param {string} str    Url to parse
     * @param {string} [mode] Parsing mode
     *
     * @return {Object}
     *
     * @throws {Error}
     *
     * @todo The default parser fails for uris which have a query without a value but a fragment e.g. ?debug#something.
     *          In such a case something#something is returned as fragment instead of just #something or something
     *
     * @since 1.0.0
     */
    static parseUrl (str, mode = 'php')
    {
        const key = [
            'source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
            'relative', 'path', 'directory', 'file', 'query', 'fragment'
        ];

        const parser = {
            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
        };

        if (!Object.prototype.hasOwnProperty.call(parser, mode)) {
            throw new Error('Unexpected parsing mode.', 'UriFactory', 52);
        }

        const m   = parser[mode].exec(str);
        const uri = {};
        let i     = 14;

        while (--i) {
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
     * @param {string} name  Name of the query to return
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static getUriQueryParameter (query, name)
    {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

        const regex   = new RegExp('[\\?&]*' + name + '=([^&#]*)');
        const results = regex.exec(query);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    /**
     * Get all uri query parameters.
     *
     * @param {string} query Uri query
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    static getAllUriQueryParameters (query)
    {
        const params    = {};
        let keyValPairs = [];
        let pairNum     = null;

        if (query.length) {
            keyValPairs = query.split('&');

            for (pairNum in keyValPairs) {
                if (!Object.prototype.hasOwnProperty.call(keyValPairs, pairNum)) {
                    continue;
                }

                const key = keyValPairs[pairNum].split('=')[0];

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

    /**
     * Set uri.
     *
     * @param {string} uri Uri string
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    set (uri)
    {
        this.uri = uri;

        const parsed = HttpUri.parseUrl(this.uri, 'php');

        this.scheme = parsed.scheme;
        this.host   = parsed.host;
        this.port   = parsed.port;
        this.user   = parsed.user;
        this.pass   = parsed.pass;
        this.path   = parsed.path;

        if (this.path.endsWith('.php')) {
            this.path = this.path.substr(0, -4);
        }

        this.queryString = typeof parsed.query !== 'undefined' ? parsed.query : [];

        if (this.queryString !== null) {
            this.query = HttpUri.getAllUriQueryParameters(this.queryString);
        }

        this.fragment = typeof parsed.fragment !== 'undefined' ? parsed.fragment : '';
        this.base     = this.scheme + '://' + this.host + this.root;
    };

    /**
     * Set root path.
     *
     * @param {string} rootPath Uri root path
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setRootPath (rootPath)
    {
        this.root = rootPath;
        this.set(this.uri);
    };

    /**
     * Get Uri base
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getBase ()
    {
        return this.base;
    };

    /**
     * Get Uri scheme
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getScheme ()
    {
        return this.scheme;
    };

    /**
     * Get Uri host
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getHost ()
    {
        return this.host;
    };

    /**
     * Get Uri port
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getPort ()
    {
        return this.port;
    };

    /**
     * Get Uri user
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getUser ()
    {
        return this.user;
    };

    /**
     * Get Uri pass
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getPass ()
    {
        return this.pass;
    };

    /**
     * Get Uri query
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getQuery ()
    {
        return this.queryString;
    };

    /**
     * Get Uri
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getUri ()
    {
        return this.uri;
    };

    /**
     * Get Uri fragment
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getFragment ()
    {
        return this.fragment;
    };

    /**
     * Get Uri path
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getPath ()
    {
        return this.path;
    };

    /**
     * Get Uri path offset
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    getPathOffset ()
    {
        return jsOMS.substr_count(this.root, '/') - 1;
    };
};
