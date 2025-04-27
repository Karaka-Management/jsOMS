import { NotificationLevel } from '../../../Message/Notification/NotificationLevel.js';

describe('NotificationLevelTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(NotificationLevel).length).toBe(5);
        });

        it('Testing values of enums', function ()
        {
            expect(NotificationLevel.OK).toBe('ok');
            expect(NotificationLevel.INFO).toBe('info');
            expect(NotificationLevel.WARNING).toBe('warning');
            expect(NotificationLevel.ERROR).toBe('error');
            expect(NotificationLevel.HIDDEN).toBe('hidden');
        });
    });
});
