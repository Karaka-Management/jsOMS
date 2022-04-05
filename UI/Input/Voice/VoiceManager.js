import { Logger } from '../../../Log/Logger.js';

/**
 * Voice manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 1.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class VoiceManager
{
    /**
     * @constructor
     *
     * @param {Object} app      Application
     * @param {Object} commands Available commands
     * @param {string} lang     Localization
     *
     * @since 1.0.0
     */
    constructor (app, commands = {}, lang = 'en-US')
    {
        this.app                   = app;
        this.commands              = commands;
        this.lang                  = lang;
        this.recognition           = null;
        this.speechRecognitionList = null;

        if (SpeechRecognition !== null) {
            this.recognition           = new SpeechRecognition();
            this.speechRecognitionList = new SpeechGrammarList();
        }
    };

    /**
     * Setup or re-initialize voice manager.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setup ()
    {
        if (SpeechRecognition === null) {
            return;
        }

        const self                       = this;
        this.recognition.lang            = this.lang;
        this.recognition.interimResults  = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.continuous      = true;
        this.recognition.lang            = this.lang;

        if (typeof this.commands !== 'undefined') {
            this.speechRecognitionList.addFromString(this.getCommandsString(), 1);
            this.recognition.grammars = this.speechRecognitionList;
        }

        this.recognition.onstart = function () {};
        // @todo find a way to run a re-init after end every x seconds (where x = 3 or 5 seconds)
        // this.recognition.addEventListener('end', reset(function () {return self.recognition.start}, 3000));

        this.recognition.onresult = function (event)
        {
            const result   = jsOMS.trim(event.results[event.resultIndex][0].transcript);
            const commands = Object.keys(self.commands);

            for (const command of commands) {
                if (result.startsWith(command)) {
                    self.commands[command](result.substr(command.length).trim());
                }
            }
        };

        this.recognition.onspeechend = function ()
        {
        };

        this.recognition.onnomatch = function (event)
        {
            Logger.instance.warning('Couldn\'t recognize speech');
        };

        this.recognition.onerror = function (event)
        {
            Logger.instance.warning('Error during speech recognition: ' + event.error);
        };
    };

    /**
     * Create commands/grammar string from commands
     *
     * @return {string}
     *
     * @since 1.0.0
     */
    getCommandsString ()
    {
        return '#JSGF V1.0; grammar phrase; public <phrase> = ' + Object.keys(this.commands).join(' | ') + ' ;';
    };

    /**
     * Set language
     *
     * @param {string} lang Language code (e.g. en-US)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setLanguage (lang)
    {
        this.recognition.lang = lang;
    };

    /**
     * Add command/grammar and callback.
     *
     * @param {string} command Command id
     * @param {callback} callback Callback for command
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    add (command, callback)
    {
        this.commands[command] = callback;
    };

    /**
     * Start voice listener.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    start ()
    {
        if (SpeechRecognition === null) {
            return;
        }

        this.recognition.start();
    };

    /**
     * Stop voice listener.
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    stop ()
    {
        if (SpeechRecognition === null) {
            return;
        }

        this.recognition.stop();
    };
};

/**
 * @todo SpeechRecognition polyfill
 *  Remove the speech recognition wrapper once it is obsolete and supported by the major browsers.
 */
/* eslint-disable */
/** global: webkitSpeechRecognition */
/** global: SpeechRecognition */
var SpeechRecognition = typeof SpeechRecognition !== 'undefined'
    ? SpeechRecognition
    : typeof webkitSpeechRecognition !== 'undefined'
        ? webkitSpeechRecognition
        : null;

/** global: webkitSpeechGrammarList */
/** global: SpeechGrammarList */
var SpeechGrammarList = typeof SpeechGrammarList !== 'undefined'
    ? SpeechGrammarList
    : typeof webkitSpeechGrammarList !== 'undefined'
        ? webkitSpeechGrammarList
        : null;

/** global: webkitSpeechRecognitionEvent */
/** global: SpeechRecognitionEvent */
var SpeechRecognitionEvent = typeof SpeechRecognitionEvent !== 'undefined'
    ? SpeechRecognitionEvent
    : typeof webkitSpeechRecognitionEvent !== 'undefined'
        ? webkitSpeechRecognitionEvent
        : null;
/* eslint-enable */
