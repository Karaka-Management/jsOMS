/**
 * Math formula evaluator
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
(function (jsOMS) {
    'use strict';

    /**
     * Evaluate math formula
     *
     * @param {string} equation Equation
     *
     * @return {null|number}
     *
     * @since 1.0.0
     */
    jsOMS.mathEvaluate = function (equation)
    {
        const stack   = [];
        const postfix = jsOMS.shuntingYard(equation);
        const length  = postfix.length;

        for (let i = 0; i < length; ++i) {
            if (!isNaN(parseFloat(postfix[i])) && isFinite(postfix[i])) {
                stack.push(postfix[i]);
            } else {
                const a = jsOMS.parseValue(stack.pop());
                const b = jsOMS.parseValue(stack.pop());

                if (postfix[i] === '+') {
                    stack.push(a + b);
                } else if (postfix[i] === '-') {
                    stack.push(b - a);
                } else if (postfix[i] === '*') {
                    stack.push(a * b);
                } else if (postfix[i] === '/') {
                    stack.push(b / a);
                } else if (postfix[i] === '^') {
                    stack.push(Math.pow(b, a));
                }
            }
        }

        const result = stack.pop();

        return !isNaN(parseFloat(result)) && isFinite(result) ? result : null;
    };

    /**
     * Parse value
     *
     * @param {string} value Value to parse
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    jsOMS.parseValue = function (value)
    {
        return typeof value === 'string' ? (value.indexOf('.') === -1 ? parseInt(value) : parseFloat(value)) : value;
    };

    /**
     * Perform shunting yard
     *
     * @param {string} value Value to parse
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    jsOMS.shuntingYard = function (equation)
    {
        const stack     = [];
        const operators = {
            '^': { precedence: 4, order: 1 },
            '*': { precedence: 3, order: -1 },
            '/': { precedence: 3, order: -1 },
            '+': { precedence: 2, order: -1 },
            '-': { precedence: 2, order: -1 }
        };
        const output    = [];

        equation = equation.replace(/\s+/g, '');
        equation = equation.split(/([\+\-\*\/\^\(\)])/).filter(function (n) { return n !== ''; });

        const length = equation.length;
        let token;

        for (let i = 0; i < length; ++i) {
            token = equation[i];

            if (!isNaN(parseFloat(token)) && isFinite(token)) {
                output.push(token);
            } else if ('^*/+-'.indexOf(token) !== -1) {
                const o1 = token;
                let o2   = stack[stack.length - 1];

                while ('^*/+-'.indexOf(o2) !== -1
                    && ((operators[o1].order === -1 && operators[o1].precedence <= operators[o2].precedence)
                        || (operators[o1].order === 1 && operators[o1].precedence < operators[o2].precedence))
                ) {
                    output.push(stack.pop());
                    o2 = stack[stack.length - 1];
                }

                stack.push(o1);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }

                stack.pop();
            }
        }

        while (stack.length > 0) {
            output.push(stack.pop());
        }

        return output;
    };
}(window.jsOMS = window.jsOMS || {}));
