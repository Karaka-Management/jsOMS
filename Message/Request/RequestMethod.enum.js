/**
 * Http request method.
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
    
    jsOMS.Message.Request.RequestMethod = Object.freeze({
        POST: 'POST',
        GET: 'GET',
        PUT: 'PUT',
        DELETE: 'DELETE',
        HEAD: 'HEAD'
    });
}(window.jsOMS = window.jsOMS || {}));
