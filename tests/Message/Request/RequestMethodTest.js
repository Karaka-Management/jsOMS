import { RequestMethod } from '../Message/Request/RequestMethod.js';

describe('RequestMethodTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(RequestMethod).length).toBe(5);
        });

        it('Testing values of enums', function ()
        {
            expect(RequestMethod.POST).toBe('POST');
            expect(RequestMethod.GET).toBe('GET');
            expect(RequestMethod.PUT).toBe('PUT');
            expect(RequestMethod.DELETE).toBe('DELETE');
            expect(RequestMethod.HEAD).toBe('HEAD');
        });
    });
});
