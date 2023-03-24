/**
 * App notification message.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class NotificationMessage
{
    /**
     * @constructor
     *
     * @param {string}  status     Message status
     * @param {string}  title      Message title
     * @param {string}  message    Message content
     * @param {boolean} [vibrate]  Vibrate
     * @param {boolean} [isSticky] Should remain in the ui until manually removed
     *
     * @since 1.0.0
     */
    constructor (status, title, message, vibrate = false, isSticky = false)
    {
        /** @type {number} status */
        this.status = status;

        /** @type {string} title */
        this.title = title;

        /** @type {string} message */
        this.message = message;

        /** @type {boolean} vibrate */
        this.vibrate = vibrate;

        /** @type {boolean} isSticky */
        this.isSticky = isSticky;

        this.primaryButton   = null;
        this.secondaryButton = null;

        this.duration = 3000;
    };
};
