describe('BrowserTypeTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Message.Request.BrowserType).length).toBe(8);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Message.Request.BrowserType.OPERA).toBe('opera');
            expect(jsOMS.Message.Request.BrowserType.FIREFOX).toBe('firefox');
            expect(jsOMS.Message.Request.BrowserType.SAFARI).toBe('safari');
            expect(jsOMS.Message.Request.BrowserType.IE).toBe('msie');
            expect(jsOMS.Message.Request.BrowserType.EDGE).toBe('edge');
            expect(jsOMS.Message.Request.BrowserType.CHROME).toBe('chrome');
            expect(jsOMS.Message.Request.BrowserType.BLINK).toBe('blink');
            expect(jsOMS.Message.Request.BrowserType.UNKNOWN).toBe('unknown');
        });
    });
});
