describe('MathProcessorTest', function ()
{
    "use strict";

    describe('testEvaluation', function ()
    {
        it('Testing formula evaluation', function ()
        {
            expect(jsOMS.mathEvaluate('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3 + 1.5')).toBeCloseTo(4.5, 2);
            expect(jsOMS.mathEvaluate('invalid')).toBe(null);
        });
    });
});