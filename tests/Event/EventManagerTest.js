describe('EventManagerTest', function ()
{
    "use strict";

    describe('testDefault', function ()
    {
        it('Testing default functionality', function ()
        {
            let manager = new jsOMS.Event.EventManager();

            expect(manager.hasOutstanding('invalid')).toBeFalsy(null);
            expect(manager.trigger('invalid')).toBeFalsy(null);
            expect(manager.count()).toBe(0);
        });
    });

    describe('testBase', function ()
    {
        it('Testing base functionality', function ()
        {
            let manager = new jsOMS.Event.EventManager();

            expect(manager.attach('group', function() { return true; }, false, false)).toBeTruthy();
            expect(manager.attach('group', function() { return true; }, false, false)).toBeFalsy();
            expect(manager.count()).toBe(1);
        });
    });

    describe('testReset', function ()
    {
        it('Testing reset functionality', function ()
        {
            let manager = new jsOMS.Event.EventManager();

            expect(manager.attach('group', function() { return true; }, false, true)).toBeTruthy();
            manager.addGroup('group', 'id1');
            manager.addGroup('group', 'id2');

            expect(manager.trigger('group', 'id1')).toBeFalsy();
            expect(manager.trigger('group', 'id2')).toBeTruthy();
            expect(manager.trigger('group', 'id2')).toBeFalsy();
            expect(manager.count()).toBe(1);
        });
    });

    describe('testDetach', function ()
    {
        it('Testing detach functionality', function ()
        {
            let manager = new jsOMS.Event.EventManager();

            expect(manager.attach('group', function() { return true; }, false, true)).toBeTruthy();
            manager.addGroup('group', 'id1');
            manager.addGroup('group', 'id2');

            expect(manager.count()).toBe(1);
            expect(manager.detach('group')).toBeTruthy();
            expect(manager.count()).toBe(0);
            expect(manager.detach('group')).toBeFalsy();
        });
    });

    describe('testRemove', function ()
    {
        it('Testing remove functionality', function ()
        {
            let manager = new jsOMS.Event.EventManager();

            expect(manager.attach('group1', function() { return true; }, true, false)).toBeTruthy();
            expect(manager.attach('group2', function() { return true; }, true, false)).toBeTruthy();
            expect(manager.count()).toBe(2);

            manager.trigger('group1');
            expect(manager.count()).toBe(1);
        });
    });
});
