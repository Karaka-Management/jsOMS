/**
 * Account type.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    jsOMS.Autoloader.defineNamespace('jsOMS.Account');

    jsOMS.Account.AccountType = Object.freeze({
        USER: 0,
        GROUP: 1
    });
}(window.jsOMS = window.jsOMS || {}));
