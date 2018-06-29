describe('NotificationLevelTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Message.Notification.NotificationLevel).length).toBe(4);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Message.Notification.NotificationLevel.OK).toBe('ok');
            expect(jsOMS.Message.Notification.NotificationLevel.INFO).toBe('info');
            expect(jsOMS.Message.Notification.NotificationLevel.WARNING).toBe('warning');
            expect(jsOMS.Message.Notification.NotificationLevel.ERROR).toBe('error');
        });
    });
});
