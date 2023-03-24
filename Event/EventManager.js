import { Logger } from '../Log/Logger.js';

/**
 * Request manager class.
 *
 * Used for pooling requests.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.0
 * @version   1.0.0
 * @since     1.0.0
 */
export class EventManager
{
    /**
     * @constructor
     *
     * @since 1.0.0
     */
    constructor ()
    {
        /** @type {Logger} logger */
        this.logger = Logger.getInstance();

        /** @type {Object.<string, string>} groups */
        this.groups = {};

        /** @type {Object.<string, function>} callbacks */
        this.callbacks = {};
    };

    /**
     * Add event group (element)
     *
     * Adding the same event overwrites the existing one as "waiting"
     *
     * @param {string|number} group Group id
     * @param {string|number} id    Event id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    addGroup (group, id)
    {
        if (typeof this.groups[group] === 'undefined') {
            this.groups[group] = {};
        }

        this.groups[group][id] = false;
    };

    /**
     * Resets the group status
     *
     * @param {string|number} group Group id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    reset (group)
    {
        for (const id in this.groups[group]) {
            if (Object.prototype.hasOwnProperty.call(this.groups[group], id)) {
                this.groups[group][id] = false;
            }
        }
    };

    /**
     * Does group have outstanding events
     *
     * @param {string|number} group Group id
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    hasOutstanding (group)
    {
        if (typeof this.groups[group] === 'undefined') {
            return false;
        }

        for (const id in this.groups[group]) {
            if (!Object.prototype.hasOwnProperty.call(this.groups[group], id) || !this.groups[group][id]) {
                return true;
            }
        }

        return false;
    };

    /**
     * Trigger event based on regex for group and/or id
     *
     * @param {string|number} group  Group id (can be regex)
     * @param {string|number} [id]   Event id (can be regex)
     * @param {null|Object}   [data] Data for event
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    triggerSimilar (group, id = '', data = null)
    {
        const groupIsRegex = group.startsWith('/');
        const idIsRegex    = id.startsWith('/');

        const groups = {};
        for (const groupName in this.groups) {
            const groupNameIsRegex = groupName.startsWith('/');

            if (groupIsRegex) {
                if (groupName.match(group)) {
                    groups[groupName] = [];
                }
            } else if (groupNameIsRegex && group.match(groupName)) {
                groups[groupName] = [];
            } else if (groupName === group) {
                groups[groupName] = [];
            }
        }

        for (const groupName in groups) {
            for (const idName in this.groups[groupName]) {
                const idNameIsRegex = idName.startsWith('/');

                if (idIsRegex) {
                    if (idName.match(id)) {
                        groups[groupName].push(idName);
                    }
                } else if (idNameIsRegex && id.match(idName)) {
                    groups[groupName].push(id);
                } else if (idName === id) {
                    groups[groupName].push([]);
                }
            }

            if (groups[groupName].length === 0) {
                groups[groupName].push(id);
            }
        }

        let triggerValue = false;
        for (const groupName in groups) {
            for (const id in groups[groupName]) {
                triggerValue = this.trigger(groupName, id, data) || triggerValue;
            }
        }

        return triggerValue;
    };

    /**
     * Trigger event finished
     *
     * Executes the callback specified for this group if all events are finished
     *
     * @param {string|number} group  Group id
     * @param {string|number} [id]   Event id
     * @param {null|Object}   [data] Data for event
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    trigger (group, id = '', data = null)
    {
        if (typeof this.callbacks[group] === 'undefined') {
            return false;
        }

        if (Math.abs(Date.now() - this.callbacks[group].lastRun) < 300) {
            return false;
        }

        if (typeof this.groups[group] !== 'undefined') {
            this.groups[group][id] = true;
        }

        if (this.hasOutstanding(group)) {
            return false;
        }

        const length                  = this.callbacks[group].callbacks.length;
        this.callbacks[group].lastRun = Date.now();

        for (let i = 0; i < length; ++i) {
            this.callbacks[group].callbacks[i](data);
        }

        if (this.callbacks[group].remove) {
            this.detach(group);
        } else if (this.callbacks[group].reset) {
            this.reset(group);
        }

        return true;
    };

    /**
     * Detach event
     *
     * @param {string|number} group Group id
     *
     * @return {void}
     *
     * @since 1.0.0
     */
    detach (group)
    {
        return this.detachCallback(group) | this.detachGroup(group);
    };

    /**
     * Detach callback
     *
     * @param {string|number} group Group id
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    detachCallback (group)
    {
        if (Object.prototype.hasOwnProperty.call(this.callbacks, group)) {
            delete this.callbacks[group];

            return true;
        }

        return false;
    };

    /**
     * Detach group
     *
     * @param {string|number} group Group id
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    detachGroup (group)
    {
        if (Object.prototype.hasOwnProperty.call(this.groups, group)) {
            delete this.groups[group];

            return true;
        }

        return false;
    };

    /**
     * Attach callback to event group
     *
     * @param {string|number} group    Group id
     * @param {function}      callback Callback or route for the event
     * @param {boolean}       [remove] Should be removed after execution
     * @param {boolean}       [reset]  Reset after triggering
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    attach (group, callback, remove = false, reset = false)
    {
        if (!Object.prototype.hasOwnProperty.call(this.callbacks, group)) {
            this.callbacks[group] = { remove: remove, reset: reset, callbacks: [], lastRun: 0 };
        }

        this.callbacks[group].callbacks.push(callback);

        return true;
    };

    /**
     * Is a certain group allready attached
     *
     * @param {string|number} group Group id
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    isAttached (group)
    {
        return Object.prototype.hasOwnProperty.call(this.callbacks, group);
    };

    /**
     * Count events
     *
     * @return {number}
     *
     * @since 1.0.0
     */
    count ()
    {
        return Object.keys(this.callbacks).length;
    };
};
