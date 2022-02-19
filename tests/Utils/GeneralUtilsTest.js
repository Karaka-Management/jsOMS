describe('GeneralUtilsTest', function ()
{
    "use strict";

    describe('testIsset', function ()
    {
        it('Testing isset functionality', function ()
        {
            let value;
            expect(jsOMS.isset(value)).toBeFalsy();
            expect(jsOMS.isset(null)).toBeFalsy();

            expect(jsOMS.isset('')).toBeTruthy();

            let value3 = 1;
            expect(jsOMS.isset(value3)).toBeTruthy();
        });
    });
});