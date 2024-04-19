import { RequestType } from '../../../Message/Request/RequestType.js';

describe('RequestTypeTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(RequestType).length).toBe(4);
        });

        it('Testing values of enums', function ()
        {
            expect(RequestType.JSON).toBe('json');
            expect(RequestType.RAW).toBe('raw');
            expect(RequestType.FILE).toBe('file');
            expect(RequestType.URL_ENCODE).toBe('url');
        });
    });
});
