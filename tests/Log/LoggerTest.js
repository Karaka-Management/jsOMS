describe('LoggerTest', function ()
{
    "use strict";

    describe('testLocalLogging', function ()
    {
        it('Testing emergency functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.emergency();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing alert functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.alert();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing critical functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.critical();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing error functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.error();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing warning functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.warning();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing notice functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.notice();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing info functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.info();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing debug functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.debug();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.log();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.log();
            expect(console.log).toHaveBeenCalled();
        });

        it('Testing console functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(true, false, false);

            log.console();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('testInvalidLocalLogging', function ()
    {
        it('Testing emergency functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.emergency();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing alert functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.alert();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing critical functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.critical();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing error functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.error();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing warning functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.warning();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing notice functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.notice();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing info functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.info();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing debug functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.debug();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.log();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.log();
            expect(console.log).not.toHaveBeenCalled();
        });

        it('Testing console functionality', function ()
        {
            spyOn(console, 'log');

            let log = new jsOMS.Log.Logger(false, false, false);

            log.console();
            expect(console.log).toHaveBeenCalled();
        });
    });
});
