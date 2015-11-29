/**
 * UI manager for handling basic ui elements.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri = function ()
    {
    };

    /**
     * Prases a url.
     *
     * @param {string} str Url string
     * @param {string} [component] I have no idea ?!?!??!?!
     *
     * @return {Object}
     *
     * @todo: fix this some parts are not used like components, mode, ini etc.
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Uri.parseUrl = function (str, component)
    {
        var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                'relative', 'path', 'directory', 'file', 'query', 'fragment'
            ],
            ini = (this.phpJs && this.phpJs.ini) || {},
            mode = (ini['phpjs.parseUrl.mode'] &&
                ini['phpjs.parseUrl.mode'].local_value) || 'php',
            parser = {
                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
            };

        var m = parser[mode].exec(str),
            uri = {},
            i = 14;

        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            }
        }

        if (component) {
            return uri[component.replace('PHP_URL_', '')
                .toLowerCase()];
        }

        if (mode !== 'php') {
            var name = (ini['phpjs.parseUrl.queryKey'] &&
                ini['phpjs.parseUrl.queryKey'].local_value) || 'queryKey';
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
    jsOMS.Uri.getUriQueryParameter = function (query, name)
    {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]*" + name + "=([^&#]*)"),
            results = regex.exec(query);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
}(window.jsOMS = window.jsOMS || {}));
