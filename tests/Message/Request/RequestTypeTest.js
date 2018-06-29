describe('RequestTypeTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Message.Request.RequestType).length).toBe(2);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Message.Request.RequestType.JSON).toBe('json');
            expect(jsOMS.Message.Request.RequestType.RAW).toBe('raw');
        });
    });
});
