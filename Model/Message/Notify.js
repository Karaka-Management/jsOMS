/**
 * Notification message.
 *
 * @param {{title:string},{content:string},{level:number},{delay:number},{stay:number}} data Message data
 *
 * @since 1.0.0
 */
export function notifyMessage (data)
{
    setTimeout(function ()
    {
        const notify  = document.createElement('div');
        const h       = document.createElement('h1');
        const inner   = document.createElement('div');
        const title   = document.createTextNode(data.title);
        const content = document.createTextNode(data.msg);

        notify.id    = 'notify';
        notify.class = data.level;
        h.appendChild(title);
        inner.appendChild(content);
        notify.appendChild(h);
        notify.appendChild(inner);
        document.body.appendChild(notify);

        if (data.stay <= 0) {
            data.stay = 5000;
        }

        if (data.stay > 0) {
            setTimeout(function ()
            {
                notify.parentElement.removeChild(notify);
            }, data.stay);
        }
    }, parseInt(data.delay));
};
