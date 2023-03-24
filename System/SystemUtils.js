import { BrowserType }   from './BrowserType.js';
import { OSType }        from './OSType.js';

/**
 * System utils class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class SystemUtils
{
    /**
     * Get browser.
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static getBrowser ()
    {
        /** global: InstallTrigger */
        /** global: navigator */
        /** global: window */
        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            return BrowserType.OPERA;
        } else if (typeof InstallTrigger !== 'undefined') {
            return BrowserType.FIREFOX;
        } else if (Object.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
            return BrowserType.SAFARI;
        } else if (/* @cc_on!@ */false || !!document.documentMode) { // eslint-disable-line no-extra-boolean-cast
            return BrowserType.IE;
        } else if (!!window.StyleMedia) { // eslint-disable-line no-extra-boolean-cast
            return BrowserType.EDGE;
        } else if (!!window.chrome && !!window.chrome.webstore) { // eslint-disable-line no-extra-boolean-cast
            return BrowserType.CHROME;
        } else if (((typeof isChrome !== 'undefined' && isChrome)
                || (typeof isOpera !== 'undefined' && isOpera))
            && !!window.CSS // eslint-disable-line no-extra-boolean-cast
        ) {
            return BrowserType.BLINK;
        }

        return BrowserType.UNKNOWN;
    };

    /**
     * Get os.
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    static getOS ()
    {
        for (const os in OSType) {
            if (Object.prototype.hasOwnProperty.call(OSType, os)) {
                /** global: navigator */
                if (navigator.appVersion.toLowerCase().indexOf(OSType[os]) !== -1) {
                    return OSType[os];
                }
            }
        }

        return OSType.UNKNOWN;
    };
};
