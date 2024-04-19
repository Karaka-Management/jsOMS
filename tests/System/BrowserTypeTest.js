import { BrowserType } from '../../System/BrowserType.js';

describe('BrowserTypeTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(BrowserType).length).toBe(8);
        });

        it('Testing values of enums', function ()
        {
            expect(BrowserType.OPERA).toBe('opera');
            expect(BrowserType.FIREFOX).toBe('firefox');
            expect(BrowserType.SAFARI).toBe('safari');
            expect(BrowserType.IE).toBe('msie');
            expect(BrowserType.EDGE).toBe('edge');
            expect(BrowserType.CHROME).toBe('chrome');
            expect(BrowserType.BLINK).toBe('blink');
            expect(BrowserType.UNKNOWN).toBe('unknown');
        });
    });
});
