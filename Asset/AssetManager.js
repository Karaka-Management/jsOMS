/**
 * Asset manager.
 *
 * @copyright  Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0
 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Asset = {};

    jsOMS.Asset.AssetManager = class {
        /**
         * @constructor
         *
         * @since 1.0.0
         */
        constructor ()
        {
            this.assets = {};
            this.registerLoadedAssets();
        };

        /**
         * Register all loaded assets.
         *
         * @return {void}
         *
         * @since 1.0.0
         */
        registerLoadedAssets ()
        {
            const scripts = document.getElementsByTagName('script'),
                length    = !scripts ? 0 : scripts.length;

            this.assets = {};

            for (let i = 0; i < length; ++i) {
                this.assets[jsOMS.hash(scripts[i].src)] = scripts[i].src;
            }
        };

        /**
         * Load asset.
         *
         * @param {string}          path       Asset path
         * @param {string}          filetype   Filetype of the asset
         * @param {requestCallback} [callback] Callback after load
         *
         * @return {string|boolean}
         *
         * @since 1.0.0
         */
        load (path, filetype, callback)
        {
            let hash;

            if (!this.assets[(hash = jsOMS.hash(path))]) {
                let fileref = null;

                if (filetype === 'js') {
                    fileref = document.createElement('script');
                    fileref.setAttribute('type', 'text/javascript');
                    fileref.setAttribute('src', path);

                    if (typeof fileref !== 'undefined') {
                        const head = document.getElementsByTagName('head');

                        if (head) {
                            head[0].appendChild(fileref);
                        }
                    }

                    this.assets[hash] = path;
                } else if (filetype === 'css') {
                    fileref = document.createElement('link');
                    fileref.setAttribute('rel', 'stylesheet');
                    fileref.setAttribute('type', 'text/css');
                    fileref.setAttribute('href', path);

                    if (typeof fileref !== 'undefined') {
                        const head = document.getElementsByTagName('head');

                        if (head) {
                            head[0].appendChild(fileref);
                        }
                    }

                    this.assets[hash] = path;
                } else if (filetype === 'img') {
                    /** global: Image */
                    this.assets[hash]     = new Image();
                    this.assets[hash].src = path;
                } else if (filetype === 'audio') {
                    // TODO: implement audio asset
                } else if (filetype === 'video') {
                    // TODO: implement video asset
                }

                if (callback) {
                    fileref.onreadystatechange ()
                    {
                        if (this.readyState === 'complete') {
                            callback();
                        }
                    };

                    fileref.onload = callback();
                }

                return hash;
            }

            return false;
        };

        /**
         * Get asset.
         *
         * @param {string} key Key of the asset
         *
         * @return {null|string}
         *
         * @since 1.0.0
         */
        get (key)
        {
            key = jsOMS.hash(key);

            if (this.assets[key]) {
                return this.assets[key];
            }

            return null;
        };

        /**
         * Remove asset.
         *
         * @param {string} key Key of the asset
         *
         * @return {boolean}
         *
         * @since 1.0.0
         */
        remove (key)
        {
            key = jsOMS.hash(key);

            if (typeof this.assets[key] !== 'undefined') {
                delete this.assets[key];

                return true;
            }

            return false;
        };
    };
}(window.jsOMS = window.jsOMS || {}));
