import { NotificationManager } from '../../../Message/Notification/NotificationManager.js';
import { AppNotification } from '../../../Message/Notification/App/AppNotification.js';
import { BrowserNotification } from '../../../Message/Notification/Browser/BrowserNotification.js';

describe('NotificationManagerTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let manager = new NotificationManager();

            expect(manager.getAppNotifier()).toEqual(jasmine.any(AppNotification));
            expect(manager.getBrowserNotifier()).toEqual(jasmine.any(BrowserNotification));
        });
    });
});