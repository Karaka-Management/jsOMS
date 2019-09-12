/**
 * Browser notification.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
export class BrowserNotification {
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor()
    {
        this.status = 0;
    };

    /**
     * Set notification status.
     *
     * @param {int} status Notification status
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setStatus (status)
    {
        this.status = status;
    };

    /**
     * Ask for browser permission to create notifications
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    requestPermission ()
    {
        const self = this;

        /** global: Notification */
        if(Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                if(permission === 'granted') {
                    let msg = new jsOMS.Message.Notification.NotificationMessage();

                    self.send(msg);
                }
            });
        }
    };

    /**
     * Create notification
     *
     * @param {Object} msg Notification
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    send (msg)
    {
        // todo: implement
        /** global: Notification */
        let n = new Notification(/* ... */);
    };
};