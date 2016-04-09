/**
 * Response type enum.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.Message.Response');
    
    jsOMS.Message.Response.ResponseType = Object.freeze({
        TEXT: 'text',
        JSON: 'json',
        DOCUMENT: 'document',
        BLOB: 'blob',
        ARRAYBUFFER: 'arraybuffer',
        DEFAULT: ''
    });
}(window.jsOMS = window.jsOMS || {}));
