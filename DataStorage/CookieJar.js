/**
 * CookieJar class.
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
    jsOMS.CookieJar = function ()
    {
    };

    /**
     * Saving data to cookie
     *
     * @param {string} cName Cookie name
     * @param {string} value Value to save
     * @param {number} exdays Lifetime for the cookie
     * @param {string} domain Domain for the cookie
     * @param {string} path Path for the cookie
     *
     * @return array
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.CookieJar.prototype.setCookie = function (cName, value, exdays, domain, path)
    {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var cValue = encodeURI(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString()) + ";domain=" + domain + ";path=" + path;
        document.cookie = cName + "=" + cValue;
    };

    /**
     * Loading cookie data
     *
     * @param {string} cName Cookie name
     *
     * @return {string}
     *
     * @method
     *
     * @since  1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.CookieJar.prototype.getCookie = function (cName)
    {
        var cValue = document.cookie;
        var cStart = cValue.indexOf(" " + cName + "=");

        if (cStart === -1) {
            cStart = cValue.indexOf(cName + "=");
        }

        if (cStart === -1) {
            cValue = null;
        } else {
            cStart = cValue.indexOf("=", cStart) + 1;
            var cEnd = cValue.indexOf(";", cStart);

            if (cEnd === -1) {
                cEnd = cValue.length;
            }

            cValue = decodeURI(cValue.substring(cStart, cEnd));
        }
        return cValue;
    };
}(window.jsOMS = window.jsOMS || {}));
