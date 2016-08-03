/**
 * Cell.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";
    /** @namespace jsOMS.Spreadsheet */
    jsOMS.Autoloader.defineNamespace('jsOMS.Spreadsheet');

    jsOMS.Spreadsheet.Cell = function(id, raw) 
    {
    	this.id = id;
    	this.raw = raw;
    	this.formatting = raw.formatting;
    };
}(window.jsOMS = window.jsOMS || {}));