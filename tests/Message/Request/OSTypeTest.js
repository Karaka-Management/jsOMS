describe('OSTypeTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Message.Request.OSType).length).toBe(25);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Message.Request.OSType.WINDOWS_10).toBe('windows nt 10.0');
            expect(jsOMS.Message.Request.OSType.WINDOWS_81).toBe('windows nt 6.3');
            expect(jsOMS.Message.Request.OSType.WINDOWS_8).toBe('windows nt 6.2');
            expect(jsOMS.Message.Request.OSType.WINDOWS_7).toBe('windows nt 6.1');
            expect(jsOMS.Message.Request.OSType.WINDOWS_VISTA).toBe('windows nt 6.0');
            expect(jsOMS.Message.Request.OSType.WINDOWS_SERVER).toBe('windows nt 5.2');
            expect(jsOMS.Message.Request.OSType.WINDOWS_XP).toBe('windows nt 5.1');
            expect(jsOMS.Message.Request.OSType.WINDOWS_XP_2).toBe('windows xp');
            expect(jsOMS.Message.Request.OSType.LINUX).toBe('linux');
            expect(jsOMS.Message.Request.OSType.UBUNTU).toBe('ubuntu');
            expect(jsOMS.Message.Request.OSType.IPHONE).toBe('iphone');
            expect(jsOMS.Message.Request.OSType.IPAD).toBe('ipad');
            expect(jsOMS.Message.Request.OSType.ANDROID).toBe('android');
            expect(jsOMS.Message.Request.OSType.MOBILE).toBe('webos');
            expect(jsOMS.Message.Request.OSType.UNKNOWN).toBe('UNKNOWN');
        });
    });
});
