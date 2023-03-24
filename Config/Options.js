/**
 * Options class.
 *
 * This is a generic options class for storing options. This is useful for handling options in other modules
 * without redefining the same behaviour multiple times.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Options
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        this.options = {};
    };

    /**
     * Set option.
     *
     * @param {number|string}                key         Option key
     * @param {boolean|number|string|Object} value       Option value
     * @param {boolean}                      [overwrite] Overwrite value
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    set (key, value, overwrite = false)
    {
        if (overwrite || typeof this.options[key] === 'undefined') {
            this.options[key] = value;

            return true;
        }

        return false;
    };

    /**
     * Get option.
     *
     * @param {number|string} key Option key
     *
     * @return {null|boolean|number|string|Object}
     *
     * @since 1.0.0
     */
    get (key)
    {
        if (typeof this.options[key] !== 'undefined') {
            return this.options[key];
        }

        return null;
    };

    /**
     * Remove option.
     *
     * @param {number|string} key Option key
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    remove (key)
    {
        if (typeof this.options[key] !== 'undefined') {
            delete this.options[key];

            return true;
        }

        return false;
    };
}
