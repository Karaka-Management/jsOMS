import { UriFactory } from '../../Uri/UriFactory.js';

/**
 * Redirect.
 *
 * @param {{delay:int},{uri:string}} data Message data
 *
 * @since 1.0.0
 */
export function redirectMessage (data)
{
    setTimeout(function ()
    {
        /** global: jsOMS */
        window.location = UriFactory.build(data.uri);
    }, parseInt(data.delay));
};
