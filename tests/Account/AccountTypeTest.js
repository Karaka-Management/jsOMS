describe('AccountTypeTest', function ()
{
    "use strict";

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(jsOMS.Account.AccountType).length).toBe(2);
        });

        it('Testing values of enums', function ()
        {
            expect(jsOMS.Account.AccountType.USER).toBe(0);
            expect(jsOMS.Account.AccountType.GROUP).toBe(1);
        });
    });
});
