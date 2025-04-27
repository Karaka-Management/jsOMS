import { jsOMS } from '../../Utils/oLib.js';

/**
 * Code text area.
 *
 * @copyright Dennis Eichhorn
 * @license   OMS License 2.2
 * @version   1.0.0
 * @since     1.0.0
 */
export class CodeArea {
    /**
     * @constructor
     *
     * @param {string} id Form id
     *
     * @since 1.0.0
     */
    constructor(e) {
        const self = this;
        this.div = e;
        this.isMouseDown = false;

        // LAYOUT (table 2 panels)
        const table = document.createElement('table');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '0');

        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');

        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);

        this.ta = this.div.querySelector('.codeTextarea');

        // TEXTAREA NUMBERS (Canvas)
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 500;
        this.ta.canvasLines = canvas;

        td1.appendChild(canvas);
        td2.appendChild(this.ta);
        this.div.appendChild(table);

        this.ta.addEventListener('scroll', function (e) {
            self.render();
        });

        this.ta.addEventListener('mousedown', function (e) {
            self.isMouseDown = true;
        });

        this.ta.addEventListener('mouseup', function (e) {
            self.isMouseDown = false;
            self.render();
        });

        this.ta.addEventListener('mousemove', function (e) {
            if (self.isMouseDown) {
                self.render();
            }
        });
    };

    render () {
        try {
            const canvas = this.ta.canvasLines;
            if (canvas.height != this.ta.clientHeight) {
                canvas.height = this.ta.clientHeight; // on resize
            }
            const ctx = canvas.getContext('2d');

            const fontSize = parseInt(window.getComputedStyle(this.ta).fontSize);
            const lineHeight = parseInt(window.getComputedStyle(this.ta).lineHeight);

            ctx.fillStyle = window.getComputedStyle(this.div).background;
            ctx.fillRect(0, 0, 42, this.ta.scrollHeight + 1);
            ctx.fillStyle = window.getComputedStyle(this.div).color;
            ctx.font = window.getComputedStyle(this.ta).fontSize + ' monospace';

            const startIndex = Math.floor(this.ta.scrollTop / lineHeight, 0);
            const endIndex = startIndex + Math.ceil(this.ta.clientHeight / lineHeight, 0);

            let ph = 0;
            let text = '';

            for (let i = startIndex; i < endIndex; i++) {
                ph = fontSize - this.ta.scrollTop + i * lineHeight;
                text = '' + (1 + i);

                ctx.fillText(text, 40 - text.length * fontSize / 2, ph);
            }
        } catch (e) {
            console.log(e.message);
        }
    };
};

jsOMS.ready(function ()
{
    'use strict';

    const textareas = document.querySelectorAll('.codeArea');
    const length = textareas.length;
    for (let i = 0; i < length; ++i) {
        const textarea = new CodeArea(textareas[i]);
        textarea.render();
    }
});
