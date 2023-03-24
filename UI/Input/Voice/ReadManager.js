/**
 * Form manager class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class ReadManager
{
    /**
     * @constructor
     *
     * @param {string} lang Localization
     *
     * @since 1.0.0
     */
    constructor (lang = 'en-US')
    {
        this.pitch  = 1;
        this.rate   = 1;
        this.lang   = lang;
        this.voices = [];
        this.voice  = null;

        if (SpeechRecognition !== null) {
            this.voices = window.speechSynthesis.getVoices();
            this.voice  = this.voices[0];
        }
    };

    /**
     * Read text.
     *
     * @param {string} text Text to read
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    read (text)
    {
        /** global: SpeechSynthesisUtterance */
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang  = this.lang;
        utter.voice = this.voice;
        utter.pitch = this.pitch;
        utter.rate  = this.rate;

        window.speechSynthesis.speak(utter);
    };

    /**
     * Set Language.
     *
     * @param {string} lang Language id (e.g. en-US)
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setLanguage (lang)
    {
        this.lang = lang;
    };

    /**
     * Set pitch.
     *
     * @param {int} pitch Pitch
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setPitch (pitch)
    {
        this.pitch = pitch;
    };

    /**
     * Set rate.
     *
     * @param {int} rate Rate
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    setRate (rate)
    {
        this.rate = rate;
    };

    /**
     * Get supported voices.
     *
     * @return {Array}
     *
     * @since 1.0.0
     */
    getVoices ()
    {
        return this.voices;
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
