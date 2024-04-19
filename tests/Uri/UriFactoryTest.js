import { UriFactory } from '../../Uri/UriFactory.js';

describe('UriFactoryTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            expect(UriFactory.getQuery('Invalid')).toBe(null);
        });
    });

    describe('testSetGet', function ()
    {
        it('Testing query setting', function ()
        {
            expect(UriFactory.setQuery('Valid', 'query1')).toBeTruthy();
            expect(UriFactory.getQuery('Valid')).toBe('query1');

            expect(UriFactory.setQuery('Valid', 'query2', true)).toBeTruthy();
            expect(UriFactory.getQuery('Valid')).toBe('query2');

            expect(UriFactory.setQuery('Valid', 'query3', false)).toBeFalsy();
            expect(UriFactory.getQuery('Valid')).toBe('query2');

            expect(UriFactory.setQuery('/valid2', 'query4')).toBeTruthy();
            expect(UriFactory.getQuery('/valid2')).toBe('query4');
        });
    });

    describe('testClearing', function ()
    {
        it('Testing query clearing', function ()
        {
            UriFactory.setQuery('Valid', 'query1');
            UriFactory.setQuery('Valid', 'query2', true);
            UriFactory.setQuery('Valid', 'query3', false);
            UriFactory.setQuery('/valid2', 'query4');

            expect(UriFactory.clear('Valid')).toBeTruthy();
            expect(UriFactory.clear('Valid')).toBeFalsy();
            expect(UriFactory.getQuery('Valid')).toBe(null);
            expect(UriFactory.getQuery('/valid2')).toBe('query4');

            expect(UriFactory.clearAll()).toBeTruthy();
            expect(UriFactory.getQuery('/valid2')).toBe(null);

            expect(UriFactory.setQuery('/abc', 'query1')).toBeTruthy();
            expect(UriFactory.setQuery('/valid2', 'query2')).toBeTruthy();
            expect(UriFactory.setQuery('/valid3', 'query3')).toBeTruthy();
            expect(UriFactory.clearLike('^d+$')).toBeFalsy();
            expect(UriFactory.clearLike('\/[a-z]*\d')).toBeTruthy();
            expect(UriFactory.getQuery('/valid2')).toBe(null);
            expect(UriFactory.getQuery('/valid3')).toBe(null);
            expect(UriFactory.getQuery('/abc')).toBe('query1');
        });
    });

    describe('testBuilder', function ()
    {
        it('Testing global queries', function ()
        {
            let uri  = 'www.test-uri.com?id={@ID}&test={.mTest}&two={/path}&hash={#hash}&found={/not}?v={/valid2}',
                vars = {
                '@ID'   : 1,
                '.mTest': 'someString',
                '/path' : 'PATH',
                '#hash' : 'test',
            },
            expected = 'www.test-uri.com?id=1&test=someString&two=PATH&hash=test&found=ERROR%20PATH&v=query4';

            expect(UriFactory.setQuery('/valid2', 'query4')).toBeTruthy();
            expect(UriFactory.build(uri, vars)).toBe(expected);
        });
    });
});