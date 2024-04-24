import { LocalStorage } from '../../DataStorage/LocalStorage.js';

describe('LocalStorageTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            if (typeof window === 'undefined') {
                expect(LocalStorage.available()).toBeFalse();
            } else {
                expect(LocalStorage.available()).toBeTruthy();
            }
        });
    });
});
