/**
 * Account.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export class Account
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        /** @type {number} id Account id */
        this.id = 0;
    };

    /**
     * Get id.
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    getId ()
    {
        return this.id;
    };
};
