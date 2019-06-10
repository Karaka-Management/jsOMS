import { LogLevel } from '../../Log/LogLevel.js';

describe('LogLevelTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(LogLevel).length).toBe(8);
        });

        it('Testing values of enums', function ()
        {
            expect(LogLevel.EMERGENCY).toBe('emergency');
            expect(LogLevel.ALERT).toBe('alert');
            expect(LogLevel.CRITICAL).toBe('critical');
            expect(LogLevel.ERROR).toBe('error');
            expect(LogLevel.WARNING).toBe('warning');
            expect(LogLevel.NOTICE).toBe('notice');
            expect(LogLevel.INFO).toBe('info');
            expect(LogLevel.DEBUG).toBe('debug');
        });
    });
});
