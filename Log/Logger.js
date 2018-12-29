/**
 * Logger class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";
    /** @namespace jsOMS.Log */
    jsOMS.Autoloader.defineNamespace('jsOMS.Log');

    jsOMS.Log.Logger = class {
        /**
         * @constructor
         *
         * @param {boolean} verbose Verbose logging
         * @param {boolean} ui Ui logging
         * @param {boolean} remote Remote logging
         *
         * @since 1.0.0
         */
        constructor (verbose = true, ui = true, remote = false)
        {
            this.verbose = verbose;
            this.ui      = ui;
            this.remote  = remote;
        };

        /**
         * Get logging instance
         *
         * @param {boolean} [verbose] Verbose logging
         * @param {boolean} [ui]      Ui logging
         * @param {boolean} [remote]  Remote logging
         *
         * @return {Object}
         *
         * @since  1.0.0
         */
        static getInstance (verbose = true, ui = true, remote = false)
        {
            if(!jsOMS.Log.Logger.instance) {
                jsOMS.Log.Logger.instance = new jsOMS.Log.Logger(verbose, ui, remote);
            }

            return jsOMS.Log.Logger.instance;
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
         * @since  1.0.0
         */
        interpolate (message, context, level)
        {
            message = typeof message === 'undefined' ? jsOMS.Log.Logger.MSG_FULL : message;

            for (let replace in context) {
                if (context.hasOwnProperty(replace) && typeof message === 'string') {
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
         * @since  1.0.0
         */
        createContext (message, context, level)
        {
            context.datetime = (new Date()).toISOString();
            context.version  = '1.0.0';
            context.os       = jsOMS.Message.Request.Request.getOS();
            context.browser  = jsOMS.Message.Request.Request.getBrowser();
            context.path     = window.location.href;
            context.level    = level;
            context.message  = message;

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
         * @since  1.0.0
         */
        write (message, context, level)
        {
            context = this.createContext(message, context, level);

            if (this.verbose) {
                this.writeVerbose(message, context, level);
            }

            if (this.ui) {
                // todo: fill log box, set class and initiate animation
            }

            if (this.remote) {
                this.writeRemote(message, context, level);
            }
        };

        /**
         * Create local log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         * @param {string} level     Log level
         *
         * @return {void}
         *
         * @since  1.0.0
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
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         * @param {string} level     Log level
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        writeRemote (message, context, level)
        {
            let request = new jsOMS.Message.Request.Request();
            request.setData(context);
            request.setType(jsOMS.Message.Response.Response.ResponseType.JSON);
            request.setUri('/{/lang}/api/log');
            request.setMethod(jsOMS.Message.Request.Request.RequestMethod.POST);
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
         * @since  1.0.0
         */
        emergency (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.EMERGENCY);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        alert (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.ALERT);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        critical (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.CRITICAL);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        error (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.ERROR);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        warning (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.WARNING);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        notice (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.NOTICE);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        info (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.INFO);
        };

        /**
         * Create log message
         *
         * @param {string} message   Message to display
         * @param {Object} [context] Context to put into message
         *
         * @return {void}
         *
         * @since  1.0.0
         */
        debug (message, context = {})
        {
            this.write(message, context, jsOMS.Log.LogLevel.DEBUG);
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
         * @since  1.0.0
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
         * @since  1.0.0
         */
        console (message, context = {})
        {
            this.writeVerbose(message, context, jsOMS.Log.LogLevel.INFO);
        };
    }

    jsOMS.Log.Logger.instance = null;
    jsOMS.Log.Logger.MSG_FULL = '{datetime}; {level}; {version}; {os}; {browser}; {path}; {message}';
}(window.jsOMS = window.jsOMS || {}));
