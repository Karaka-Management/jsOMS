export function showAction (action, callback)
{
    "use strict";

    const show = document.getElementById(action.id);

    if (!show) {
        return;
    }

    /** global: jsOMS */
    jsOMS.removeClass(show, 'vh');

    callback();
};