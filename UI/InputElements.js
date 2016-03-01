/**
 * Form manager class.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS, undefined)
{
    "use strict";

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.InputElements = function ()
    {
        this.elements = [];
    };

    jsOMS.InputElements.prototype.bind = function(id)
    {

    };

    jsOMS.InputElements.prototype.bindElement = function(e)
    {
        switch(e.dataset.type) {
            case jsOMS.InputElementsEnum.AUTOCOMPLETE:
                // autocomplete with drop down returns object
                // { value: , text: , data: 'could be object'}
                break;
            case jsOMS.InputElementsEnum.POPUP:
                break;
        }
    };
}