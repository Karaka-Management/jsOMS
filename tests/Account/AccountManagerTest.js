describe('AccounManagertTest', function ()
{
    "use strict";

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let obj = new jsOMS.Account.AccountManager();

            expect(obj.get(2)).toBe(null);
        });
    });

    describe('testSetGet', function ()
    {
        it('Testing default functionality', function ()
        {
            let obj = new jsOMS.Account.AccountManager();
            let acc = new jsOMS.Account.Account();

            obj.add(acc);
            expect(obj.get(0)).toBe(acc);

            obj.remove(0);
            expect(obj.get(0)).toBe(null);
        });
    });
});
