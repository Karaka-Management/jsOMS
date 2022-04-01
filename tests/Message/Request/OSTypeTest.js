import { OSType } from '../Message/Request/OSType.js';

describe('OSTypeTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(OSType).length).toBe(25);
        });

        it('Testing values of enums', function ()
        {
            expect(OSType.WINDOWS_10).toBe('windows nt 10.0');
            expect(OSType.WINDOWS_81).toBe('windows nt 6.3');
            expect(OSType.WINDOWS_8).toBe('windows nt 6.2');
            expect(OSType.WINDOWS_7).toBe('windows nt 6.1');
            expect(OSType.WINDOWS_VISTA).toBe('windows nt 6.0');
            expect(OSType.WINDOWS_SERVER).toBe('windows nt 5.2');
            expect(OSType.WINDOWS_XP).toBe('windows nt 5.1');
            expect(OSType.WINDOWS_XP_2).toBe('windows xp');
            expect(OSType.LINUX).toBe('linux');
            expect(OSType.UBUNTU).toBe('ubuntu');
            expect(OSType.IPHONE).toBe('iphone');
            expect(OSType.IPAD).toBe('ipad');
            expect(OSType.ANDROID).toBe('android');
            expect(OSType.MOBILE).toBe('webos');
            expect(OSType.UNKNOWN).toBe('UNKNOWN');
        });
    });
});
