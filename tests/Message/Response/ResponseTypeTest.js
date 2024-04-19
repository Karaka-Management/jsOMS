import { ResponseType } from '../../../Message/Response/ResponseType.js';

describe('ResponseTypeTest', function ()
{
    'use strict';

    describe('testEnum', function ()
    {
        it('Testing amount of enums', function ()
        {
            expect(Object.keys(ResponseType).length).toBe(6);
        });

        it('Testing values of enums', function ()
        {
            expect(ResponseType.TEXT).toBe('text');
            expect(ResponseType.JSON).toBe('json');
            expect(ResponseType.DOCUMENT).toBe('document');
            expect(ResponseType.BLOB).toBe('blob');
            expect(ResponseType.ARRAYBUFFER).toBe('arraybuffer');
            expect(ResponseType.DEFAULT).toBe('');
        });
    });
});
