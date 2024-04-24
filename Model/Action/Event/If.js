/**
 * Prevent UI action.
 *
 * @param {Object}   action   Action data
 * @param {function} callback Callback
 * @param {string}   id       Action element
 *
 * @since 1.0.0
 */
export function ifAction (action, callback, id)
{
    'use strict';

    const conditions = action.conditions;
    const data = Object.values(action.data)[0];

    for (const i in conditions) {
        if (conditions[i].comp === '==' && data === conditions[i].value) {
            action.key = conditions[i].jump - 1;
            break;
        } else if (conditions[i].comp === '!=' && data !== conditions[i].value) {
            action.key = conditions[i].jump - 1;
            break;
        } else if (conditions[i].comp === '>' && data > conditions[i].value) {
            action.key = conditions[i].jump - 1;
            break;
        } else if (conditions[i].comp === '<' && data < conditions[i].value) {
            action.key = conditions[i].jump - 1;
            break;
        } else if (conditions[i].comp === '>=' && data >= conditions[i].value) {
            action.key = conditions[i].jump - 1;
            break;
        } else if (conditions[i].comp === '<=' && data <= conditions[i].value) {
            action.key = conditions[i].jump - 1;
            break;
        } else if (conditions[i].comp === '') {
            // empty comparison => else statement

            action.key = conditions[i].jump - 1;
            break;
        }
    }

    callback();
};
