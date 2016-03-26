/**
 * Request data enum.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Request');
    
    jsOMS.Message.Request.OSType = Object.freeze({
        WINDOWS_81: 'windows nt 6.3', /* Windows 8.1 */
        WINDOWS_8: 'windows nt 6.2', /* Windows 8 */
        WINDOWS_7: 'windows nt 6.1', /* Windows 7 */
        WINDOWS_VISTA: 'windows nt 6.0', /* Windows Vista */
        WINDOWS_SERVER: 'windows nt 5.2', /* Windows Server 2003/XP x64 */
        WINDOWS_XP: 'windows nt 5.1', /* Windows XP */
        WINDOWS_XP_2: 'windows xp', /* Windows XP */
        WINDOWS_2000: 'windows nt 5.0', /* Windows 2000 */
        WINDOWS_ME: 'windows me', /* Windows ME */
        WINDOWS_98: 'win98', /* Windows 98 */
        WINDOWS_95: 'win95', /* Windows 95 */
        WINDOWS_311: 'win16', /* Windows 3.11 */
        MAC_OS_X: 'macintosh', /* Mac OS X */
        MAC_OS_X_2: 'mac os x', /* Mac OS X */
        MAC_OS_9: 'mac_powerpc', /* Mac OS 9 */
        LINUX : 'linux', /* Linux */
        UBUNTU: 'ubuntu', /* Ubuntu */
        IPHONE: 'iphone', /* IPhone */
        IPOD: 'ipod', /* IPod */
        IPAD: 'ipad', /* IPad */
        ANDROID: 'android', /* Android */
        BLACKBERRY: 'blackberry', /* Blackberry */
        MOBILE: 'webos' /* Mobile */
    });
}(window.jsOMS = window.jsOMS || {}));
