import { LocalStorage } from '../../DataStorage/LocalStorage.js';

describe('LocalStorageTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            expect(LocalStorage.available()).toBeTruthy();
        });
    });
});
