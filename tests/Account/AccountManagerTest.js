import { AccountManager } from '../../Account/AccountManager.js';

describe('AccountManagerTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let obj = new AccountManager();

            expect(obj.get(2)).toBe(null);
        });
    });

    describe('testSetGet', function ()
    {
        it('Testing default functionality', function ()
        {
            let obj = new AccountManager();
            let acc = new Account();

            obj.add(acc);
            expect(obj.get(0)).toBe(acc);

            obj.remove(0);
            expect(obj.get(0)).toBe(null);
        });
    });
});
