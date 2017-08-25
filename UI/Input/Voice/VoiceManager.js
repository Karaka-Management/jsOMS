/**
 * Form manager class.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    /** @namespace jsOMS.UI */
    jsOMS.Autoloader.defineNamespace('jsOMS.UI.Input.Voice');

    // todo: remove once obsolete
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    /**
     * @constructor
     *
     * @since 1.0.0
     */
    jsOMS.UI.Input.Voice.VoiceManager = function (app, commands, lang)
    {
        this.app = app;
        this.recognition = new SpeechRecognition();
        this.speechRecognitionList = new SpeechGrammarList();
        this.commands = commands;
        this.lang = typeof lang === 'undefined' ? 'en-US' : lang;      
    };

    jsOMS.UI.Input.Voice.VoiceManager.prototype.setup = function()
    {
        let self = this;

        this.recognition.lang = this.lang;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        if(typeof this.commands !== 'undefined') {
            this.speechRecognitionList.addFromString(this.commands, 1);
            recognition.grammars = this.speechRecognitionList;
        }

        this.recognition.onresult = function(event) {


            console.log(event.results[0][0].transcript);
        }

        this.recognition.onspeechend = function() {
            self.recognition.stop();
        }

        this.recognition.onnomatch = function(event) {
            console.log('Couldn\'t recognize speech');
        }

        this.recognition.onerror = function(event) {
            console.log('Error during speech recognition: ' + event.error);
        }
    };

    jsOMS.UI.Input.Voice.VoiceManager.prototype.setLanguage = function(lang)
    {
        // todo: eventually restart
        this.recognition.lang = lang;
    };

    jsOMS.UI.Input.Voice.VoiceManager.prototype.setCommands = function(commands)
    {
        // todo: eventually restart
        this.speechRecognitionList.addFromString(commands, 1);
        recognition.grammars = this.speechRecognitionList;
    };

    jsOMS.UI.Input.Voice.VoiceManager.prototype.start = function()
    {
        this.recognition.start();
    };

    jsOMS.UI.Input.Voice.VoiceManager.prototype.stop = function()
    {
        this.recognition.stop();
    };
}(window.jsOMS = window.jsOMS || {}));