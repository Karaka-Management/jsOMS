/**
 * Set message.
 *
 * @param {{delay:int}} data Message data
 *
 * @since 1.0.0
 */
export function reloadMessage (data) {
    setTimeout(function () {
        document.location.reload(true);
    }, parseInt(data.delay));
};
