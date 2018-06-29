describe('NotificationManagerTest', function ()
{
    "use strict";

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let manager = new jsOMS.Message.Notification.NotificationManager();
            
            expect(manager.getAppNotifier()).toEqual(jasmine.any(jsOMS.Message.Notification.App.AppNotification));
            expect(manager.getBrowserNotifier()).toEqual(jasmine.any(jsOMS.Message.Notification.Browser.BrowserNotification));
        });
    });
});