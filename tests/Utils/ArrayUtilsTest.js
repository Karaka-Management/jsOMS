describe('ArrayUtilsTest', function ()
{
    "use strict";

    describe('testGetArray', function ()
    {
        it('Testing get functionality', function ()
        {
            const expected = {
                'a' : {
                    'aa' : 1,
                    'ab' : [
                        'aba',
                        'ab0',
                        [
                            3,
                            'c',
                        ],
                        4,
                    ],
                },
                2 : '2a',
            };

            expect(jsOMS.getArray('a/ab/1', expected)).toBe('ab0');
        });
    });
});