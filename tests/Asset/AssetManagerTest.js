import { AssetManager } from '../../Asset/AssetManager.js';

describe('AssetManagerTest', function ()
{
    'use strict';

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let asset = new AssetManager();
            expect(asset.get('invalid')).toBe(null);
            expect(asset.remove('invalid')).toBeFalsy();
        });
    });

    describe('testAssetInteraction', function ()
    {
        it('Testing asset interaction functionality', function ()
        {
            let asset = new AssetManager(),
                base = window.location.href.substr(0, window.location.href.length - 15);

            asset.registerLoadedAssets();

            expect(asset.get(base + '../Utils/oLib.js')).not.toBe(null);
            expect(asset.remove(base + '../Utils/oLib.js')).toBeTruthy();
            expect(asset.load(base + '../Utils/oLib.js', 'js')).not.toBeFalsy();
        });
    });
});
