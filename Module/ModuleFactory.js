/**
 * Module factory.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class ModuleFactory
{
    /**
     * Get module instance.
     *
     * @param {string} module Module name
     * @param {Object} app    Application reference
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    static getInstance (module, app)
    {
        return new window.omsApp.Modules[module](app);
    };
};
