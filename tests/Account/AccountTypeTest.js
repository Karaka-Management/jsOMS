import { AccountType } from '../../Account/AccountType.js';

describe('AccountTypeTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(AccountType).length).toBe(2);
        });

        it('Testing values of enums', function ()
        {
            expect(AccountType.USER).toBe(0);
            expect(AccountType.GROUP).toBe(1);
        });
    });
});
