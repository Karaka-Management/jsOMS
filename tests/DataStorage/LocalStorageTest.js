describe('LocalStorageTest', function ()
{
    "use strict";

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            expect(jsOMS.DataStorage.LocalStorage.available()).toBeTruthy();
        });
    });
});
