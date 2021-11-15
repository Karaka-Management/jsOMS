/**
 * App notification.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class NotificationMessage
{
    /**
     * @constructor
     *
     * @param {string} status    Message status
     * @param {string} title     Message title
     * @param {string} message   Message content
     * @param {bool}   [vibrate] Vibrate
     *
     * @since 1.0.0
     */
    constructor(status, title, message, vibrate = false, isSticky = false)
    {
        this.status   = status;
        this.title    = title;
        this.message  = message;
        this.vibrate  = vibrate
        this.isSticky = isSticky
    };
};