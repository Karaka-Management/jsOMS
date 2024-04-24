import { Account } from '../../Account/Account.js';

describe('AccountTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let obj = new Account();

            expect(obj.getId()).toBe(0);
        });
    });
});
