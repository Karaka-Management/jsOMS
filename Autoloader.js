import { AssetManager } from './Asset/AssetManager.js';

/**
 * Autoloader.
 *
 * The autoloader is responsible for defining namespaces and dynamically loading js
 * files that are not yet included. The intention is to provide a similar functionality as
 * include, import etc. Contrary to it's name the autoloader is not able to truly autoload
 * referenced classes.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export const Autoloader = {};

/** @type {string[]} Autoloader.loaded */
Autoloader.loaded = [];

/** @type {string[]} Autoloader.namespaced */
Autoloader.namespaced = [];

/** @type {AssetManager} Autoloader.assetLoader */
Autoloader.assetLoader = new AssetManager();

/**
 * Define namespace
 *
 * @param {string} namespace Namespace
 *
 * @return {void}
 *
 * @since 1.0.0
 */
Autoloader.defineNamespace = function (namespace)
{
    if (Autoloader.namespaced.indexOf(namespace) !== -1) {
        return;
    }

    const paths = namespace.split('.');
    paths.splice(0, 1);

    const length = paths.length;
    let current  = window.omsApp;

    if (typeof current === 'undefined') {
        return;
    }

    for (let i = 0; i < length; ++i) {
        if (typeof current[paths[i]] === 'undefined') {
            current[paths[i]] = {};
        }

        current = current[paths[i]];
    }

    Autoloader.namespaced.push(namespace);
};

/**
 * Collect all loaded JS files
 *
 * @return {void}
 *
 * @since 1.0.0
 */
Autoloader.initPreloaded = function ()
{
    const scripts = document.getElementsByTagName('script');
    const length  = !scripts ? 0 : scripts.length;

    for (let i = 0; i < length; ++i) {
        /** global: URL */
        /** @var {string} URL */
        scripts[i].src.replace(URL + '/', '');

        if (Autoloader.loaded.indexOf(scripts[i].src) === -1) {
            Autoloader.loaded.push(scripts[i].src);
        }
    }
};

/**
 * Add loaded script
 *
 * @param {string} file Script URI
 *
 * @return {void}
 *
 * @since 1.0.0
 */
Autoloader.addPreloaded = function (file)
{
    if (Autoloader.loaded.indexOf(file) === -1) {
        Autoloader.loaded.push(file);
    }
};

/**
 * Include script
 *
 * @param {string}   file     Script URI
 * @param {function} callback Callback after script loading
 *
 * @return {void}
 *
 * @since 1.0.0
 */
Autoloader.include = function (file, callback)
{
    const length = file.length;

    for (let i = 0; i < length; ++i) {
        if (Autoloader.loaded.indexOf(file) === -1) {
            this.assetLoader.load(file, 'js');

            Autoloader.loaded.push(file);
        }
    }

    if (typeof callback !== 'undefined' && callback !== null) {
        callback();
    }
};
