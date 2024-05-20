/**
 * LocalStorage class.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export class LocalStorage
{
    /**
     * Is local storage available?
     *
     * @return {boolean}
     *
     * @since 1.0.0
     */
    static available ()
    {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    };
};
