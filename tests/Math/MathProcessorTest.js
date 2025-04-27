import { MathProcessor } from '../../Math/MathProcessor.js';

describe('MathProcessorTest', function ()
{
    'use strict';

    describe('testBasicEvaluation', function ()
    {
        it('Testing formula evaluation', function ()
        {
            expect(MathProcessor.mathEvaluate('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3 + 1.5')).toBeCloseTo(4.5, 2);
            expect(MathProcessor.mathEvaluate('3+4*2/(1-5)^2^3+1.5')).toBeCloseTo(4.5, 2);
            expect(MathProcessor.mathEvaluate('invalid')).toBe(null);
            expect(MathProcessor.mathEvaluate('3+4*2/(1-5^2^3+1.5')).toBe(null);
        });
    });
});