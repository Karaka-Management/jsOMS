/**
 * Response manager class.
 *
 * Used for auto handling different responses.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Response
{
    /**
     * @constructor
     *
     * @param {Object} data Response data
     *
     * @since 1.0.0
     */
    constructor (data)
    {
        /** @type {Object} responses */
        this.responses = data;
    };

    /**
     * Get response by id.
     *
     * @param {null|string} [id] Response id
     *
     * @return {any}
     *
     * @since 1.0.0
     */
    get (id = null)
    {
        return id === null ? this.responses : this.responses[id];
    };

    /**
     * Count the amount of responses.
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    count ()
    {
        return this.responses.length;
    };
};
