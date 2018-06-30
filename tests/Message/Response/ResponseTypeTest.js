describe('ResponseTypeTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jjsOMS.Message.Response.ResponseType).length).toBe(6);
        });

        it('Testing values of enums', function ()
        {
            expect(jjsOMS.Message.Response.ResponseType.TEXT).toBe('text');
            expect(jjsOMS.Message.Response.ResponseType.JSON).toBe('json');
            expect(jjsOMS.Message.Response.ResponseType.DOCUMENT).toBe('document');
            expect(jjsOMS.Message.Response.ResponseType.BLOB).toBe('blob');
            expect(jjsOMS.Message.Response.ResponseType.ARRAYBUFFER).toBe('arraybuffer');
            expect(jjsOMS.Message.Response.ResponseType.DEFAULT).toBe('');
        });
    });
});
