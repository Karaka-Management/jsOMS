import { NotificationLevel }  from '../NotificationLevel.js';
/**
 * @typedef {import('../NotificationMessage.js').NotificationMessage} NotificationMessage
 */

/**
 * App notification.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
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
        /** @type {number} status */
        this.status = 0;
    };

    /**
     * Set notification status.
     *
     * @param {number} status Notification status
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
     * @param {NotificationMessage} msg Notification
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

        switch (msg.status) {
            case 0:
                msg.status = NotificationLevel.OK;
                break;
        };

        const output = document.importNode(tpl.content, true);
        output.querySelector('.log-msg').classList.add('log-lvl-' + msg.status);
        output.querySelector('.log-msg-content').innerHTML = msg.message;
        output.querySelector('.close').addEventListener('click', function () {
            this.parentNode.remove();
        });

        if (msg.title && msg.title !== '') {
            output.querySelector('.log-msg-title').innerHTML = msg.title;
        } else {
            output.querySelector('.log-msg-title').remove();
        }

        if (!msg.primaryButton) {
            const primary = output.querySelector('.primary-button');

            if (primary) {
                primary.remove();
            }
        } else {
            const primary = output.querySelector('.primary-button');

            if (primary) {
                primary.innerHTML = msg.primaryButton.text;
                primary.addEventListener('click', msg.primaryButton.callback);
            }
        }

        if (!msg.secondaryButton) {
            const secondary = output.querySelector('.secondary-button');

            if (secondary) {
                secondary.remove();
            }
        } else {
            const secondary = output.querySelector('.secondary-button');

            if (secondary) {
                secondary.innerHTML = msg.secondaryButton.text;
                secondary.addEventListener('click', msg.secondaryButton.callback);
            }
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
        }, msg.duration);
    };
};
