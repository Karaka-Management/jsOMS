import { LogLevel } from './LogLevel.js';
import { Request } from '../Message/Request/Request.js';
import { SystemUtils } from '../System/SystemUtils.js';

/**
 * Logger class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class Logger
{
    /**
     * @constructor
     *
     * @param {boolean} [verbose] Verbose logging
     * @param {boolean} [ui]      Ui logging
     * @param {boolean} [remote]  Remote logging
     *
     * @since 1.0.0
     */
    constructor (verbose = true, ui = true, remote = false)
    {
        /** @type {boolean} verbose */
        this.verbose = verbose;

        /** @type {boolean} ui */
        this.ui = ui;

        /** @type {boolean} remote */
        this.remote = remote;
    };

    /**
     * Get logging instance
     *
     * @param {boolean} [verbose] Verbose logging
     * @param {boolean} [ui]      Ui logging
     * @param {boolean} [remote]  Remote logging
     *
     * @return {Logger}
     *
     * @since 1.0.0
     */
    static getInstance (verbose = true, ui = true, remote = false)
    {
        if (!Logger.instance) {
            Logger.instance = new Logger(verbose, ui, remote);
        }

        return Logger.instance;
    };

    /**
     * Interpolate message
     *
     * @param {string} message   Message structure
     * @param {Object} [context] Context to put into message
     * @param {string} [level]   Log level
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    interpolate (message, context)
    {
        message = typeof message === 'undefined' ? Logger.MSG_FULL : message;

        for (const replace in context) {
            if (Object.prototype.hasOwnProperty.call(context, replace) && typeof message === 'string') {
                message = message.replace('{' + replace + '}', context[replace]);
            }
        }

        return (typeof message) !== 'string' ? JSON.stringify(message) : message;
    };

    /**
     * Create context
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     * @param {string} level     Log level
     *
     * @return {Object}
     *
     * @since 1.0.0
     */
    createContext (message, context, level)
    {
        let stack;
        try {
            throw new Error('');
        } catch (e) {
            stack = e.stack || '';
        }

        context.backtrace = stack;
        context.datetime  = (new Date()).toISOString();
        context.version   = '1.0.0';
        context.os        = SystemUtils.getOS();
        context.browser   = SystemUtils.getBrowser();
        context.path      = typeof window === 'undefined' ? '' : window.location.href;
        context.datetime  = (new Date()).toString();
        context.level     = level;
        context.message   = message;

        return context;
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     * @param {string} level     Log level
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    write (message, context, level)
    {
        context = this.createContext(message, context, level);

        if (this.verbose) {
            this.writeVerbose(message, context, level);
        }

        if (this.ui) {
            this.writeUi(message, context);
        }

        if (this.remote) {
            this.writeRemote(context);
        }
    };

    /**
     * Create ui log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    writeUi (message, context)
    {
        /** global: Notification */
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then(function (permission) { });
        }

        const notification = new Notification('Logger', { body: this.interpolate(message, context) });
        setTimeout(notification.close.bind(notification), 4000);
    };

    /**
     * Create local log message in console
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     * @param {string} level     Log level
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    writeVerbose (message, context, level)
    {
        let color = '000';

        switch (level) {
            case 'info':
            case 'notice':
            case 'log':
                color = '000';
                break;
            case 'debug':
                color = '289E39';
                break;
            case 'warning':
            case 'alert':
                color = 'FFA600';
                break;
            case 'error':
            case 'critical':
            case 'emergency':
                color = 'CF304A';
                break;
            default:
        }

        console.log('%c' + this.interpolate(message, context, level), 'color: #' + color);
    };

    /**
     * Create remote log message
     *
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    writeRemote (context)
    {
        const request = new Request();
        request.setData(context);
        request.setType(jsOMS.Message.Response.Response.ResponseType.JSON);
        request.setUri('/{/lang}/api/log');
        request.setMethod(Request.RequestMethod.POST);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setSuccess(function (xhr)
        {
        });
        request.send();
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    emergency (message, context = {})
    {
        this.write(message, context, LogLevel.EMERGENCY);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    alert (message, context = {})
    {
        this.write(message, context, LogLevel.ALERT);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    critical (message, context = {})
    {
        this.write(message, context, LogLevel.CRITICAL);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    error (message, context = {})
    {
        this.write(message, context, LogLevel.ERROR);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    warning (message, context = {})
    {
        this.write(message, context, LogLevel.WARNING);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    notice (message, context = {})
    {
        this.write(message, context, LogLevel.NOTICE);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    info (message, context = {})
    {
        this.write(message, context, LogLevel.INFO);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    debug (message, context = {})
    {
        this.write(message, context, LogLevel.DEBUG);
    };

    /**
     * Create log message
     *
     * @param {string} level     Log level
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    log (level, message, context = {})
    {
        this.write(message, context, level);
    };

    /**
     * Create log message
     *
     * @param {string} message   Message to display
     * @param {Object} [context] Context to put into message
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    console (message, context = {})
    {
        this.writeVerbose(message, context, LogLevel.INFO);
    };
}

Logger.instance = null;
Logger.MSG_FULL = '{datetime}; {level}; {version}; {os}; {browser}; {path}; {message}';
