describe('RequestMethodTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Message.Request.RequestMethod).length).toBe(5);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Message.Request.RequestMethod.POST).toBe('POST');
            expect(jsOMS.Message.Request.RequestMethod.GET).toBe('GET');
            expect(jsOMS.Message.Request.RequestMethod.PUT).toBe('PUT');
            expect(jsOMS.Message.Request.RequestMethod.DELETE).toBe('DELETE');
            expect(jsOMS.Message.Request.RequestMethod.HEAD).toBe('HEAD');
        });
    });
});
