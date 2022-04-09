/**
 * Reload page.
 *
 * @param {{delay:number}} data Message data
 *
 * @since 1.0.0
 */
export function reloadMessage (data) {
    setTimeout(function () {
        document.location.reload();
    }, parseInt(data.delay));
};
