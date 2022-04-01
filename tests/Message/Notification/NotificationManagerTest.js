import { NotificationManager } from '../Message/Notification/NotificationManager.js';

describe('NotificationManagerTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let manager = new NotificationManager();

            expect(manager.getAppNotifier()).toEqual(jasmine.any(App.AppNotification));
            expect(manager.getBrowserNotifier()).toEqual(jasmine.any(Browser.BrowserNotification));
        });
    });
});