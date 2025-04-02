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
            let asset = new AssetManager();
            let base = typeof window === 'undefined' ? '' : window.location.href.slice(0, -15);

            asset.registerLoadedAssets();

            if (typeof window === 'undefined') {
                expect(true).toBeTrue();

                return;
            }

            expect(asset.get(base + '../Utils/oLib.js')).not.toBe(null);
            expect(asset.remove(base + '../Utils/oLib.js')).toBeTruthy();
            expect(asset.load(base + '../Utils/oLib.js', 'js')).not.toBeFalsy();
        });
    });
});
