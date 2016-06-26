/**
 * Asset manager.
 *
 * @author     OMS Development Team <dev@oms.com>
 * @author     Dennis Eichhorn <d.eichhorn@oms.com>
 * @copyright  2013 Dennis Eichhorn
 * @license    OMS License 1.0
 * @version    1.0.0 * @since      1.0.0
 */
(function (jsOMS)
{
    "use strict";

    jsOMS.Asset = {};

    /**
     * @constructor
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Asset.AssetManager = function ()
    {
        this.assets = {};
    };

    /**
     * Load asset.
     *
     * @param {string} path Asset path
     * @param {string} filetype Filetype of the asset
     * @param {requestCallback} [callback] Callback after load
     *
     * @return {string|boolean}
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Asset.AssetManager.prototype.load = function (path, filetype, callback)
    {
        let hash;

        if (!this.assets[(hash = jsOMS.hash(path))]) {
            let fileref = null;

            if (filetype === 'js') {
                fileref = document.createElement('script');
                fileref.setAttribute('type', 'text/javascript');
                fileref.setAttribute('src', path);

                if (typeof fileref !== 'undefined') {
                    document.getElementsByTagName('head')[0].appendChild(fileref);
                }

                this.assets[hash] = path;
            } else if (filetype === 'css') {
                fileref = document.createElement('link');
                fileref.setAttribute('rel', 'stylesheet');
                fileref.setAttribute('type', 'text/css');
                fileref.setAttribute('href', path);

                if (typeof fileref !== 'undefined') {
                    document.getElementsByTagName('head')[0].appendChild(fileref);
                }

                this.assets[hash] = path;
            } else if (filetype === 'img') {
                this.assets[hash]     = new Image();
                this.assets[hash].src = path;
            } else if (filetype === 'audio') {
                // TODO: implement audio asset
            } else if (filetype === 'video') {
                // TODO: implement video asset
            }

            if (callback) {
                fileref.onreadystatechange = function ()
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
     * @param {string} id Id of the asset (hash)
     *
     * @return
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Asset.AssetManager.prototype.get = function (id)
    {
        if (this.assets[id]) {
            return this.assets[id];
        }

        return undefined;
    };

    /**
     * Remove asset.
     *
     * @param {string} key Key of the asset (hash)
     *
     * @return {boolean}
     *
     * @method
     *
     * @since 1.0.0
     * @author Dennis Eichhorn <d.eichhorn@oms.com>
     */
    jsOMS.Asset.AssetManager.prototype.remove = function (key)
    {
        if (typeof this.assets[key] !== 'undefined') {
            delete this.assets[key];

            return true;
        }

        return false;
    };
}(window.jsOMS = window.jsOMS || {}));
