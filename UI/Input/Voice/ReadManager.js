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
    jsOMS.UI.Input.Voice.ReadManager = function ()
    {
        this.pitch = 1;
        this.rate = 1;
        this.voice = 'en-US';
        
        this.voices = window.speechSynthesis.getVoices();
    };

    jsOMS.UI.Input.Voice.ReadManager.prototype.read = function(text)
    {
        let utter = new SpeechSynthesisUtterance(text);
        utter.voice = this.voice;
        utter.pitch = this.pitch;
        utter.rate = this.rate;
        window.speechSynthesis.speak(utter);
    };

    jsOMS.UI.Input.Voice.ReadManager.prototype.setLanguage = function(lang)
    {
        this.lang = lang;
    };

    jsOMS.UI.Input.Voice.ReadManager.prototype.setPitch = function(pitch)
    {
        this.pitch = pitch;
    };

    jsOMS.UI.Input.Voice.ReadManager.prototype.setRate = function(rate)
    {
        this.rate = rate;
    };

    jsOMS.UI.Input.Voice.ReadManager.prototype.getVoices = function()
    {
        return this.voices;
    };
}(window.jsOMS = window.jsOMS || {}));