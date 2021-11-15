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

        let output = document.importNode(tpl.content, true);
        output.querySelector('.log-msg').classList.add('log-msg-status-' + msg.status);
        output.querySelector('.log-msg-content').innerHTML = msg.message;
        output.querySelector('.close').addEventListeenr('click', function() {
            this.parent.remove();
        });

        if (msg.title && msg.title !== '') {
            output.querySelector('.log-msg-title').innerHTML = msg.title;
        } else {
            output.querySelector('.log-msg-title').remove();
        }

        tpl.parentNode.appendChild(output);
        window.navigator.vibrate(msg.vibrate ? 200 : 0);

        if (msg.isSticky) {
            return;
        }

        setTimeout(function ()
        {
            document.getElementsByClassName('log-msg')[0].remove();
        }, 3000);
    };
};