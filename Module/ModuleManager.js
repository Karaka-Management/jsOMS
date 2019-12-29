import { ModuleFactory } from './ModuleFactory.js';
/**
 * Module manager.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class ModuleManager {
    /**
     * @constructor
     *
     * @param {Object} app Application
     *
     * @since 1.0.0
     */
    constructor(app)
    {
        this.modules = {};
        this.app     = app;
    };

    /**
     * Get module.
     *
     * @param {string} module Module name
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    get (module)
    {
        if (typeof this.modules[module] === 'undefined') {
            this.modules[module] = ModuleFactory.getInstance(module, this.app);
        }

        return this.modules[module];
    };
};