describe('NotificationMessageTest', function ()
{
    "use strict";

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let msg = new jsOMS.Message.Notification.NotificationMessage('ok', 'abc', 'def');
            
            expect(msg.status).toBe('ok');
            expect(msg.title).toBe('abc');
            expect(msg.message).toBe('def');
        });
    });
});