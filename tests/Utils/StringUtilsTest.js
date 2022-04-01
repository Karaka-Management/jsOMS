describe('StringUtilsTest', function ()
{
    'use strict';

    describe('testTrim', function ()
    {
        it('Testing trim functionality', function ()
        {
            expect(jsOMS.trim(' hello ')).toBe('hello');
            expect(jsOMS.trim('  hello')).toBe('hello');
            expect(jsOMS.trim('hello   ')).toBe('hello');
        });

        it('Testing rtrim functionality', function ()
        {
            expect(jsOMS.rtrim(' hello ')).toBe(' hello');
            expect(jsOMS.rtrim('  hello')).toBe('  hello');
            expect(jsOMS.rtrim('hello   ')).toBe('hello');
        });

        it('Testing ltrim functionality', function ()
        {
            expect(jsOMS.ltrim(' hello ')).toBe('hello ');
            expect(jsOMS.ltrim('  hello')).toBe('hello');
            expect(jsOMS.ltrim('hello   ')).toBe('hello   ');
        });
    });

    describe('testStrpbrk', function ()
    {
        it('Testing strpbrk functionality', function ()
        {
            expect(jsOMS.strpbrk('This is a simple text.', 'ai')).toBe('is is a simple text.');
            expect(jsOMS.strpbrk('This is a simple text.', 'mt')).toBe('mple text.');
            expect(jsOMS.strpbrk('This is a simple text.', 'z')).toBe('');
        });
    });

    describe('testSubstrCount', function ()
    {
        it('Testing substring cound functionality', function ()
        {
            expect(jsOMS.substr_count('This is a simple text.', 'is')).toBe(2);
            expect(jsOMS.substr_count('This is a simple text.', 'text')).toBe(1);
            expect(jsOMS.substr_count('This is a simple text.', 'imples')).toBe(0);
        });
    });

    describe('testSpecialchars', function ()
    {
        it('Testing htmlspecialchars functionality', function ()
        {
            expect(jsOMS.htmlspecialchars('<a href="test">Test</a>')).toBe('&lt;a href=&quot;test&quot;&gt;Test&lt;/a&gt;');
        });
    });
});