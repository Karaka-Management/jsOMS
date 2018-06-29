describe('LogLevelTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Log.LogLevel).length).toBe(8);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Log.LogLevel.EMERGENCY).toBe('emergency');
            expect(jsOMS.Log.LogLevel.ALERT).toBe('alert');
            expect(jsOMS.Log.LogLevel.CRITICAL).toBe('critical');
            expect(jsOMS.Log.LogLevel.ERROR).toBe('error');
            expect(jsOMS.Log.LogLevel.WARNING).toBe('warning');
            expect(jsOMS.Log.LogLevel.NOTICE).toBe('notice');
            expect(jsOMS.Log.LogLevel.INFO).toBe('info');
            expect(jsOMS.Log.LogLevel.DEBUG).toBe('debug');
        });
    });
});
