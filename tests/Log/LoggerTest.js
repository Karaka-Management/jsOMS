import { Logger } from '../../Log/Logger.js';

describe('LoggerTest', function ()
{
    'use strict';

    const isVerbose = typeof window !== 'undefined';

    describe('testLocalLogging', function ()
    {
        it('Testing emergency functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.emergency();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing alert functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.alert();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing critical functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.critical();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing error functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.error();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing warning functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.warning();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing notice functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.notice();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing info functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.info();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing debug functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.debug();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.log();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(log, 'write');

            log.log();
            expect(log.write).toHaveBeenCalled();
        });

        it('Testing console functionality', function ()
        {
            let log = new Logger(isVerbose, false, false);
            spyOn(console, 'log');

            log.console();
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('testInvalidLocalLogging', function ()
    {
        it('Testing emergency functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.emergency();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing alert functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.alert();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing critical functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.critical();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing error functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.error();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing warning functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.warning();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing notice functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.notice();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing info functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.info();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing debug functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.debug();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.log();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing log functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(log, 'writeVerbose');

            log.log();
            expect(log.writeVerbose).not.toHaveBeenCalled();
        });

        it('Testing console functionality', function ()
        {
            let log = new Logger(false, false, false);
            spyOn(console, 'log');

            log.console();
            expect(console.log).toHaveBeenCalled();
        });
    });
});
