/**
 * Account Manager.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class AccountManager {
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        this.accounts = [];
    };

    /**
     * Add account.
     *
     * @param {Object} account Account
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    add (account)
    {
        this.accounts[account.getId()] = account;
    };

    /**
     * Remove account.
     *
     * @param {int} id Account id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    remove (id)
    {
        if (typeof this.accounts[id] !== 'undefined') {
            delete this.accounts[id];

            return true;
        }

        return false;
    };

    /**
     * Get account by id.
     *
     * @param {int} id Account id
     *
     * @return {null|Object}
     *
     * @since 1.0.0
     */
    get (id)
    {
        if (this.accounts[id]) {
            return this.accounts[id];
        }

        return null;
    };
};
