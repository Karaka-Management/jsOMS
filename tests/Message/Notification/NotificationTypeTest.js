import { NotificationType } from '../../../Message/Notification/NotificationType.js';

describe('NotificationTypeTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(NotificationType).length).toBe(2);
        });

        it('Testing values of enums', function ()
        {
            expect(NotificationType.APP_NOTIFICATION).toBe(1);
            expect(NotificationType.BROWSER_NOTIFICATION).toBe(2);
        });
    });
});
