/**
 * App notification.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class AppNotification
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
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
        const tpl = document.getElementById('app-message-tpl');

        if (tpl === null) {
            return;
        }

        const output = document.importNode(tpl.content, true);
        output.querySelector('.log-msg').classList.add('log-msg-status-' + msg.status);
        output.querySelector('.log-msg-content').innerHTML = msg.message;
        output.querySelector('.close').addEventListener('click', function() {
            this.parentNode.remove();
        });

        if (msg.title && msg.title !== '') {
            output.querySelector('.log-msg-title').innerHTML = msg.title;
        } else {
            output.querySelector('.log-msg-title').remove();
        }

        tpl.parentNode.appendChild(output);

        const logs             = document.getElementsByClassName('log-msg');
        const lastElementAdded = logs[logs.length - 1];
        window.navigator.vibrate(msg.vibrate ? 200 : 0);

        if (msg.isSticky) {
            return;
        }

        setTimeout(function ()
        {
            if (lastElementAdded !== null && lastElementAdded.parentNode !== null) {
                lastElementAdded.parentNode.removeChild(lastElementAdded);
            }
        }, 3000);
    };
};