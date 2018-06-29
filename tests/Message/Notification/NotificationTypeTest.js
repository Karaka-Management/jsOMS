describe('NotificationTypeTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Message.Notification.NotificationType).length).toBe(2);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Message.Notification.NotificationType.APP_NOTIFICATION).toBe(1);
            expect(jsOMS.Message.Notification.NotificationType.BROWSER_NOTIFICATION).toBe(2);
        });
    });
});
