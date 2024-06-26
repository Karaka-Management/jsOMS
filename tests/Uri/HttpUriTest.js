import { HttpUri } from '../../Uri/HttpUri.js';

describe('HttpUriTest', function ()
{
    'use strict';

    describe('testParseUrl', function ()
    {
        it('Testing php parsing mode', function ()
        {
            let parsed = HttpUri.parseUrl('http://username:password@example.com:8080/test/path?test=123&two=ha#frag', 'php');

            expect(parsed.scheme).toBe('http');
            expect(parsed.user).toBe('username');
            expect(parsed.pass).toBe('password');
            expect(parsed.host).toBe('example.com');
            expect(parsed.port).toBe('8080');
            expect(parsed.path).toBe('/test/path');
            expect(parsed.fragment).toBe('frag');
            expect(parsed.query).toBe('test=123&two=ha');
        });

        it('Testing strict parsing mode', function ()
        {
            let parsed = HttpUri.parseUrl('http://username:password@example.com:8080/test/path?test=123&two=ha#frag', 'strict');

            expect(parsed.scheme).toBe('http');
            expect(parsed.user).toBe('username');
            expect(parsed.pass).toBe('password');
            expect(parsed.host).toBe('example.com');
            expect(parsed.port).toBe('8080');
            expect(parsed.path).toBe('/test/path');
            expect(parsed.fragment).toBe('frag');
            expect(parsed.query).toBe('test=123&two=ha');
        });

        it('Testing loose parsing mode', function ()
        {
            let parsed = HttpUri.parseUrl('http://username:password@example.com:8080/test/path?test=123&two=ha#frag', 'loose');

            expect(parsed.scheme).toBe('http');
            expect(parsed.user).toBe('username');
            expect(parsed.pass).toBe('password');
            expect(parsed.host).toBe('example.com');
            expect(parsed.port).toBe('8080');
            expect(parsed.path).toBe('/test/path');
            expect(parsed.fragment).toBe('frag');
            expect(parsed.query).toBe('test=123&two=ha');
        });

        it('Testing invalid parsing mode', function ()
        {
            let thrown = function ()
            {
                HttpUri.parseUrl('http://username:password@example.com:8080/test/path?test=123&two=ha#frag', 'invalid');
            };
            expect(thrown).toThrowError(Error, 'Unexpected parsing mode.');
        });
    });

    describe('testGetUriQueryParameter', function ()
    {
        it('Testing query extraction', function ()
        {
            let parsed = HttpUri.parseUrl('http://username:password@example.com:8080/test/path?test=123&two=ha#frag', 'php');
            let query  =HttpUri.getUriQueryParameter(parsed.query, 'test');

            expect(query).toBe('123');

            query =HttpUri.getUriQueryParameter(parsed.query, 'two');
            expect(query).toBe('ha');
        });
    });
});
