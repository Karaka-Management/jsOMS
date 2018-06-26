describe('AccountTest', function ()
{
    "use strict";

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let obj = new jsOMS.Account.Account();

            expect(obj.getId()).toBe(0);
        });
    });
});
