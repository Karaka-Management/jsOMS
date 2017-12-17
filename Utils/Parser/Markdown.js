(function (jsOMS)
{
    "use strict";
    /** @namespace jsOMS.Views */
    jsOMS.Autoloader.defineNamespace('jsOMS.Utils.Parser.Markdown');

    jsOMS.Utils.Parser.Markdown.blockTypes = {
        '#': ['Header'],
        '*': ['Rule', 'List'],
        '+': ['List'],
        '-': ['SetextHeader', 'Table', 'Rule', 'List'],
        '0': ['List'],
        '1': ['List'],
        '2': ['List'],
        '3': ['List'],
        '4': ['List'],
        '5': ['List'],
        '6': ['List'],
        '7': ['List'],
        '8': ['List'],
        '9': ['List'],
        ':': ['Table'],
        '<': [],
        '=': ['SetextHeader'],
        '>': ['Quote'],
        '[': ['Reference'],
        '_': ['Rule'],
        '`': ['FencedCode'],
        '|': ['Table'],
        '~': ['FencedCode'],
    };

    jsOMS.Utils.Parser.Markdown.unmarkedBlockTypes = [
        'Code',
    ];

    jsOMS.Utils.Parser.Markdown.specialCharacters = [
        '\\', '`', '*', '_', '{', '}', '[', ']', '(', ')', '>', '#', '+', '-', '.', '!', '|',
    ];

    jsOMS.Utils.Parser.Markdown.strongRegex = {
        '*': '/^[*]{2}((?:\\\\\*|[^*]|[*][^*]*[*])+?)[*]{2}(?![*])/s',
        '_': '/^__((?:\\\\_|[^_]|_[^_]*_)+?)__(?!_)/us',
    };

    jsOMS.Utils.Parser.Markdown.emRegex = {
        '*': '/^[*]((?:\\\\\*|[^*]|[*][*][^*]+?[*][*])+?)[*](?![*])/s',
        '_': '/^_((?:\\\\_|[^_]|__[^_]*__)+?)_(?!_)\b/us',
    };

    jsOMS.Utils.Parser.Markdown.regexHtmlAttribute = '[a-zA-Z_:][\w:.-]*(?:\s*=\s*(?:[^"\'=<>`\s]+|"[^"]*"|\'[^\']*\'))?';

    jsOMS.Utils.Parser.Markdown.voidElements = [
        'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source',
    ];

    jsOMS.Utils.Parser.Markdown.textLevelElements = [
        'a', 'br', 'bdo', 'abbr', 'blink', 'nextid', 'acronym', 'basefont',
        'b', 'em', 'big', 'cite', 'small', 'spacer', 'listing',
        'i', 'rp', 'del', 'code',          'strike', 'marquee',
        'q', 'rt', 'ins', 'font',          'strong',
        's', 'tt', 'kbd', 'mark',
        'u', 'xm', 'sub', 'nobr',
                   'sup', 'ruby',
                   'var', 'span',
                   'wbr', 'time',
    ];

    jsOMS.Utils.Parser.Markdown.inlineTypes = {
        '"': ['SpecialCharacter'],
        '!': ['Image'],
        '&': ['SpecialCharacter'],
        '*': ['Emphasis'],
        ':': ['Url'],
        '<': ['UrlTag', 'EmailTag', 'SpecialCharacter'],
        '>': ['SpecialCharacter'],
        '[': ['Link'],
        '_': ['Emphasis'],
        '`': ['Code'],
        '~': ['Strikethrough'],
        '\\': ['EscapeSequence'],
    };

    jsOMS.Utils.Parser.Markdown.inlineMarkerList = '!"*_&[:<>`~\\';

    jsOMS.Utils.Parser.Markdown.continuable = [
        'Code', 'FencedCode', 'List', 'Quote', 'Table'
    ];

    jsOMS.Utils.Parser.Markdown.completable = [
        'Code', 'FencedCode'
    ];

    jsOMS.Utils.Parser.Markdown.safeLinksWhitelist = [
        'http://', 'https://', 'ftp://', 'ftps://', 'mailto:', 
        'data:image/png;base64,', 'data:image/gif;base64,', 'data:image/jpeg;base64,', 
        'irc:', 'ircs:', 'git:', 'ssh:', 'news:', 'steam:',
    ];

    jsOMS.Utils.Parser.Markdown.definitionData = {};

    jsOMS.Utils.Parser.Markdown.parse = function(text) 
    {
        jsOMS.Utils.Parser.Markdown.definitionData = {};
        text = text.replace("\r\n", "\n").replace("\r", "\n");
        text = jsOMS.trim(text, "\n");

        const lines = text.split("\n");
        const markup = jsOMS.Utils.Parser.Markdown.lines(lines);

        return jsOMS.trim(markup, "\n");
    };

    jsOMS.Utils.Parser.Markdown.lines = function(lines)
    {
        let currentBlock = null;
        let blocks = [];

        outerloop:
        for (let line in lines) {
            line = lines[line];

            if (jsOMS.rtrim(line) === '') {
                if (currentBlock !== null) {
                    currentBlock['interrupted'] = true;
                }

                continue;
            }

            if (line.indexOf("\t") !== -1) {
                let parts = line.split("\t");
                line = parts[0];

                parts.shift();

                for (let part in parts) {
                    part = parts[part];

                    const shortage = 4 - line.length() % 4;

                    line += ' '.repeat(shortage);
                    line += part;
                }
            }

            let indent = 0;
            while (typeof line[indent] !== 'undefined' && line[indent] === ' ') {
                indent++;
            }

            text = indent > 0 ? line.substr(indent) : line;
            let lineArray = {body: line, indent: indent, text: text};

            if (typeof currentBlock['continuable'] !== 'undefined') {
                let block = jsOMS.Utils.Parser.Markdown['block' + currentBlock['type'] + 'Continue'](lineArray, currentBlock);

                if (typeof block !== 'undefined') {
                    currentBlock = block;
                } else if (jsOMS.Utils.Parser.Markdown.completable.indexOf(currentBlock['type']) !== -1) {
                    currentBlock = jsOMS.Utils.Parser.Markdown['block' + currentBlock['type'] + 'Complete'](lineArray);
                }
            }

            let marker = text[0];
            let blockTypes = jsOMS.Utils.Parser.Markdown.unmarkedBlockTypes;

            if (typeof jsOMS.Utils.Parser.Markdown.blockTypes[marker] !== 'undefined') {
                for (let blockType in jsOMS.Utils.Parser.Markdown.blockTypes[marker]) {
                    blockType = jsOMS.Utils.Parser.Markdown.blockTypes[marker][blockType];

                    blockTypes.push(blockType);
                }
            }

            for (let blockType in blockTypes) {
                let block = jsOMS.Utils.Parser.Markdown['block' + blockType](lineArray, currentBlock);

                if (typeof block !== 'undefined') {
                    block['type'] = blocktype;

                    if (typeof block['identified'] === 'undefined') {
                        blocks.push(currentBlock);

                        block['identified'] = true;
                    }

                    if (jsOMS.Utils.Parser.Markdown.continuable.indexof(blockType) !== -1) {
                        block['continuable'] = true;
                    }

                    currentBlock = block;

                    continue outerloop;
                }
            }

            if (typeof currentBlock !== 'undefined' 
                && typeof currentBlock['type'] === 'undefined'
                && typeof currentBlock['interrupted'] === 'undefined'
            ) {
                currentBlock['element']['text'] += "\n" + text;
            } else {
                blocks.push(currentBlock);
                currentBlock = jsOMS.Utils.Parser.Markdown.paragraph(lineArray);
                currentBlock['identified'] = true;
            }
        }

        if (typeof currentBlock['continuable'] !== 'undefined' && jsOMS.Utils.Parser.Markdown.completable.indexOf(currentBlock['type']) !== -1) {
            currentBlock = jsOMS.Utils.Parser.Markdown['block' + currentBlock['type'] + 'Complete'](currentBlock);
        }

        blocks.push(currentBlock);
        blocks.shift();
        let markup = '';

        for (let block in blocks) {
            block = blocks[block];

            if (typeof block['hidden'] !== 'undefined') {
                continue;
            }

            markup += "\n";
            markup += typeof block['markup'] !== 'undefined' ? block['markup'] : jsOMS.Utils.Parser.Markdown.element(block['element']);
        }

        markup += "\n";

        return markup;
    };

    jsOMS.Utils.Parser.Markdown.blockCode = function(lineArray, block)
    {
        if (typeof block !== 'undefined' && typeof block['type'] === 'undefined' && typeof block['interrputed'] === 'undefined') {
            return;
        }

        if (lineArray['indent'] < 4) {
            return;
        }

        let text = lineArray['body'].substr(4);

        return {
            element: {
                name: 'pre',
                handler: 'element',
                text: {
                    name: 'code',
                    text: text
                }
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.blockCodeContinue = function(lineArray, block)
    {
        if (lineArray['indent'] < 4) {
            return;
        }

        if (typeof block['interrupted'] !== 'undefined') {
            block['element']['text']['text'] += "\n";

            delete block['interrputed'];
        }

        block['element']['text']['text'] += "\n";
        text = lineArray['body'].substr(4);
        block['element']['text']['text'] += text;

        return block;
    };

    jsOMS.Utils.Parser.Markdown.blockCodeComplete = function(block)
    {
        text = block['element']['text']['text'];
        block['element']['text']['text'] = text;

        return block;
    };

    jsOMS.Utils.Parser.Markdown.blockFencedCode = function(lineArray)
    {
        let matches = [];
        const regex = new RegExp('/^[' + lineArray['text'][0] + ']{3,}[ ]*([\w-]+)?[ ]*$/');;

        if ((matches = lineArray['text'].match(regex)) === null) {
            return;
        }

        let elementArray = {
            name: 'code',
            text: ''
        }

        if (typeof matches[1] !== 'undefined') {
            elementArray['attributes'] = {
                'class': 'language-' + matches[1]
            }
        }

        return {
            char: lineArray['text'][0],
            element: {
                name: 'pre',
                handler: 'element',
                text: elementArray
            }
        }
    };

    jsOMS.Utils.Parser.Markdown.blockFencedCodeContinue = function(lineArray, block)
    {
        if (typeof block['complete'] !== 'undefined') {
            return;
        }

        if (typeof block['interrupted'] !== 'undefined') {
            block['element']['text']['text'] += "\n";

            delete block['interrupted'];
        }

        const regex = new RegExp('/^' + block['char'] + '{3,}[ ]*$/');

        if (lineArray['text'].match(regex) !== null) {
            block['element']['text']['text'] = block['element']['text']['text'].substr(1);
            block['complete'] = true;

            return block;
        }

        block['element']['text']['text'] += "\n" + lineArray['body'];

        return block;
    };

    jsOMS.Utils.Parser.Markdown.blockFencedCodeComplete = function(block)
    {
        let text = block['element']['text']['text'];
        block['element']['text']['text'] = text;

        return block;
    };

    jsOMS.Utils.Parser.Markdown.blockHeader = function(lineArray)
    {
        if (typeof lineArray['text'][1] === 'undefined') {
            return;
        }

        let level = 1;
        while (typeof lineArray['text'][level] !== 'undefined' && lineArray['text'][level] === '#') {
            level++;
        }

        if (level > 6) {
            return;
        }

        text = jsOMS.trim(lineArray['text'], '# ');
        
        return {
            element: {
                name: 'h' + Math.min(6, level),
                text: text,
                handler: 'line'
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.blockList = function(lineArray)
    {
        let list = lineArray['text'][0] <= '-' ? ['ul', '[*+-]'] : ['ol', '[0-9]+[.]'];
        let matches = null;
        const regex = new RegExp('/^(' + list[1] + '[ ]+)(.*)/');

        if ((matches = lineArray['text'].match(regex)) === null) {
            return;
        }

        block = {
            indent: lineArray['indent'],
            pattern: list[1],
            elment: {
                name: list[0],
                handler: 'elements'
            }
        };

        if (list[0] === 'ol') {
            let listStart = matches[0].substr(0, matches[0].indexOf('.'));
        }

        block['li'] = {
            name: 'li',
            handler: 'li',
            text: [
                matches[2]
            ]
        };

        block['element']['text'].push(block['li']);

        return block;
    };

    jsOMS.Utils.Parser.Markdown.blockListContinue = function(lineArray, block)
    {
        let matches = null;
        const regex = new RegExp('/^' + block['pattern'] + '(?:[ ]+(.*)|$)/');

        if (block['indent'] === lineArray['indent'] && (matches = lineArray['text'].match(regex) !== null)) {
            if (typeof block['interrupted'] !== 'undefined') {
                block['li']['text'].push('');

                delete block['interrupted'];
            }

            delete block['li'];

            let text = typeof matches[1] !== 'undefined' ? matches[1] : '';
            block['li'] = {
                name: 'li',
                handler: 'li',
                text: [
                    text
                ]
            };

            block['element']['text'].push(block['li']);

            return block;
        }

        if (lineArray['text'][0] === '[' && jsOMS.Utils.Parser.Markdown.blockReference(lineArray)) {
            return block;
        }

        if (typeof block['interrupted'] === 'undefined') {
            let text = lineArray['body'].replace(/^[ ]{0,4}/, '');
            block['li']['text'].push(text);

            return block;
        }

        if (lineArray['indent'] > 0) {
            block['li']['text'].push('');
            let text = lineArray['body'].replace(/^[ ]{0,4}/, '');
            block['li']['text'].push(text);

            delete block['interrupted'];

            return block;
        }
    };

    jsOMS.Utils.Parser.Markdown.blockQuote = function(lineArray)
    {
        let matches = null;

        if ((matches = lineArray['text'].match(/^>[ ]?(.*)/)) === null) {
            return;
        }

        return {
            element: {
                name: 'blockquote',
                handler: 'lines',
                text: matches[1]
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.blockQuoteContinue = function(lineArray, block)
    {
        if (lineArray['text'][0] === '>' && (matches = lineArray['text'].match(/^>[ ]?(.*)/)) !== null) {
            if (typeof block['interrputed'] !== 'undefined') {
                block['element']['text'].push('');

                delete block['interrupted'];
            }

            block['element']['text'].push(matches[1]);

            return block;
        }

        if (typeof block['interrupted'] === 'undefined') {
            block['element']['text'].push(lineArray['text']);

            return block;
        }
    };

    jsOMS.Utils.Parser.Markdown.blockRule = function(lineArray)
    {
        const regex = new RegExp('/^([' + lineArray['text'][0] + '])([ ]*\1){2,}[ ]*$/');

        if (lineArray['text'].match(regex) === null) {
            return;
        }

        return {
            element: {
                name: 'hr'
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.blockSetextHeader = function(lineArray, block)
    {
        if(typeof block === 'undefined' || typeof block['type'] !== 'undefined' || typeof block['interrupted'] !== 'undefined') {
            return;
        }

        if (jsOMS.rtrim(lineArray['text'], lineArray['text'][0]) !== '') {
            return;
        }

        block['element']['name'] = lineArray['text'][0] === '=' ? 'h1' : 'h2';

        return block;
    };

    jsOMS.Utils.Parser.Markdown.blockReference = function(lineArray)
    {
        let matches = null;

        if ((matches = lineArray['text'].match(/^\[(.+?)\]:[ ]*<?(\S+?)>?(?:[ ]+["\'(](.+)["\')])?[ ]*$/)) === null) {
            return;
        }

        let id = matches[1].toLowerCase();
        let data = {
            url: matches[2],
            title: typeof matches[3] !== 'undefined' ? matches[3] : null,
        };

        jsOMS.Utils.Parser.Markdown.definitionData['Reference'][id] = data;
        
        return {hidden: true};
    };

    jsOMS.Utils.Parser.Markdown.blockTable = function(lineArray, block)
    {
        if (typeof block === 'undefined' || typeof block['type'] !== 'undefined' || typeof block['interrupted'] !== 'undefined') {
            return
        }

        if (block['element']['text'].indexOf('|') !== -1 && jsOMS.rtrim(lineArray['text'], ' -:|') === '') {
            let alignments = [];
            let divider = lineArray['text'];
            divider = jsOMS.trim(divider);
            divider = jsOMS.trim(divider, '|');
            
            const dividerCells = divider.split('|');
            let dividerLength = dividerCells.length;

            for (let i = 0; i < dividerLength; i++) {
                let dividerCell = jsOMS.trim(dividerCells[i]);

                if (dividerCell === '') {
                    continue;
                }

                let alignment = null;

                if (dividerCell[0] === ':') {
                    alignment = 'left';
                }

                if (dividerCell.substr(-1) === ':') {
                    alignment = alignment === 'left' ? 'center' : 'right';
                }

                alignments.push(alignment);
            }

            let headerElements = [];
            let header = block['element']['text'];
            header = jsOMS.trim(header);
            header = jsOMS.trim(header, '|');
            let headerCells = header.split('|');
            const headerLength = headerCells.length;

            for (let i = 0; i < headerLength; i++) {
                let headerCell = jsOMS.trim(headerCells[i]);
                let headerElement = {
                    name: 'th',
                    text: headerCell,
                    handler: 'line'
                };

                if (typeof alignments[i] !== 'undefined') {
                    let alignment = alignments[i];
                    headerElement['attributes'] = {
                        style: 'text-align: ' + alignment + ';'
                    };
                }

                headerElements.push(headerElement);
            }

            block = {
                alignments: alignments,
                identified: true,
                element: {
                    name: 'table',
                    handler: 'elements'
                }
            };

            block['element']['text'].push({
                name: 'thead',
                handler: 'elements'
            });

            block['element']['text'].push({
                name: 'tbody',
                handler: 'elements',
                text: []
            });

            block['element']['text'][0]['text'].push({
                name: 'tr',
                handler: 'elements',
                text: headerElements
            });

            return block;
        }
    };

    jsOMS.Utils.Parser.Markdown.blockTableContinue = function(lineArray, block)
    {
        if (typeof block['interrupted'] !== 'undefined') {
            return;
        }

        if (lineArray['text'][0] === '|' || lineArray['text'].indexOf('|') !== -1) {
            let elements = [];
            let row = lineArray['text'];
            row = jsOMS.trim(row);
            row = jsOMS.trim(row, '|');

            let matches = row.match(/(?:(\\\\[|])|[^|`]|`[^`]+`|`)+/g);
            let index = matches[0].length;

            for (let i = 0; i < index; index++) {
                let cell = jsOMS.trim(matches[0][index]);
                let element = {
                    name: 'td',
                    handler: 'line',
                    text: cell
                };

                if (typeof block['alignments'][index] !== 'undefined') {
                    element['attributes'] = {
                        style: 'text-align: ' + block[alignments][index] + ';',
                    }
                }

                elements.push(element);
            }

            element = {
                name: 'tr',
                handler: 'element',
                text: elements
            };
            block['element']['text'][1]['text'].push(element);

            return block;
        }
    };

    jsOMS.Utils.Parser.Markdown.paragraph = function(lineArray)
    {
        return {
            element: {
                name: 'p',
                text: lineArray['text'],
                handler: 'line'
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.line = function(text)
    {
        let markup = '';
        let excerpt = null;
        
        outerloop:
        while (excerpt = jsOMS.strpbrk(text, jsOMS.Utils.Parser.Markdown.inlineMarkerList)) {
            let marker = excerpt[0];
            let markerPosition = text.indexOf(marker);
            let excerptArray = {text: excerpt, context: text};

            for (let inlineType in jsOMS.Utils.Parser.Markdown.inlineTypes[marker]) {
                inlineType = jsOMS.Utils.Parser.Markdown.inlineTypes[marker][inlineType];
                
                let inline = jsOMS.Utils.Parser.Markdown['inline' + inlineType](excerptArray);

                if (typeof inline === 'undefined') {
                    continue;
                }

                if (typeof inline['position'] !== 'undefined' && inline['position'] > markerPosition) {
                    continue;
                }

                if (typeof inline['position'] === 'undefined') {
                    inline['position'] = markerPosition;
                }

                let unmarkedText = text.substr(0, inline['position']);
                markup += jsOMS.Utils.Parser.Markdown.unmarkedText(unmarkedText);
                markup += typeof inline['markup'] !== undefined ? inline['markup'] : jsOMS.Utils.Parser.Markup.element(inline['element']);
                text = text.substr(inline['position'] + inline['extent']);

                continue outerloop;
            }

            let unmarkedText = text.substr(0, markerPosition + 1);
            markup += jsOMS.Utils.Parser.Markdown.unmarkedText(unmarkedText);
            text = text.substr(markerPosition + 1);
        }

        markup += jsOMS.Utils.Parser.Markdown.unmarkedText(text);

        return markup;
    };

    jsOMS.Utils.Parser.Markdown.inlineCode = function (excerpt)
    {
        let marker = excerpt['text'][0];
        let matches = null;
        const regex = new RegExp('/^(' + marker + '+)[ ]*(.+?)[ ]*(?<!' + marker + ')\1(?!' + marker + ')/s');

        if ((matches = excerpt['text'].match(regex)) === null) {
            return;
        }

        text = matches[2].replace(/[ ]*\n/, ' ');

        return {
            extent: matches[0].length,
            element: {
                name: 'code',
                text: text
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineEmailTag = function (excerpt)
    {
        let matches = null;

        if (excerpt['text'].indexOf('>') === -1 || (matches = excerpt['text'].match(/^<((mailto:)?\S+?@\S+?)>/i)) === null) {
            return;
        }

        let url = matches[1];

        if (typeof matches[2] === 'undefined') {
            url = 'mailto:' + url;
        }

        return {
            extent: matches[0].length,
            element: {
                name: 'a',
                text: matches[1],
                attributes: {
                    href: url
                }
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineEmphasis = function (excerpt)
    {
        if (typeof excerpt['text'][1] === 'undefined') {
            return;
        }

        let marker = excerpt['text'][0];
        let matches = null;
        const regex1 = new RegExp(jsOMS.Utils.Parser.Markdown.strongRegex[marker]);
        const regex2 = new RegExp(jsOMS.Utils.Parser.Markdown.emRegex[marker]);
        let emphasis = '';

        if (excerpt['text'][1] === marker && (matches = excerpt['text'].match(regex1)) !== null) {
            emphasis = 'strong';
        } else if ((matches = excerpt['text'].match(regex2)) !== null) {
            emphasis = 'em';
        } else {
            return;
        }

        return {
            extent: matches[0].length,
            element: {
                name: emphasis,
                handler: 'line',
                text: matches[1]
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineEscapeSequence = function(excerpt)
    {
        if (typeof excerpt['text'][1] === 'undefined' || jsOMS.Utils.Parser.Markdown.specialCharacters.indexOf(excerpt['text'][1]) === -1) {
            return;
        }

        return {
            markup: excerpt['text'][1],
            extent: 2
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineImage = function (excerpt)
    {
        if (typeof excerpt['text'][1] === 'undefined' || excerpt['text'][1] !== '[') {
            return;
        }

        excerpt['text'] = excerpt['text'].substr(1);
        let link = jsOMS.Utils.Parser.Markdown.inlineLink(excerpt);

        if (typeof link === 'undefined') {
            return;
        }

        let inline = {
            extent: link['extent'] + 1,
            element: {
                name: 'img',
                attributes: {
                    src: link['element']['attributes']['href'],
                    alt: link['element']['text']
                }
            }
        };

        for (let e in link['element']['attributes']) {
            inline['element']['attributes'][e] = link['element']['attributes'][e];
        }

        delete inline['element']['attributes']['href'];

        return inline;
    };

    jsOMS.Utils.Parser.Markdown.inlineLink = function(excerpt)
    {
        let element = {
            name: 'a',
            handler: 'line',
            text: null,
            attributes: {
                href: null,
                title: null
            }
        };
        let extent = 0;
        let remainder = excerpt['text'];
        let matches = null;

        if ((matches = remainder.match(/\[((?:[^][]++|(?R))*+)\]/)) === null) {
            return;
        }

        element['text'] = matches[1];
        extent += matches[0].length;
        remainder = remainder.substr(extent);

        if ((matches = remainder.match(/^[(]\s*+((?:[^ ()]++|[(][^ )]+[)])++)(?:[ ]+("[^"]*"|\'[^\']*\'))?\s*[)]/)) !== null) {
            element['attributes']['href'] = matches[1];
            
            if (typeof matches[2] !== 'undefined') {
                element['attributes']['title'] = matches[2].substr(1, -1);
            }

            extent += matches[0].length;
        } else {
            let definition = null;
            if ((matches = remainder.match(/^\s*\[(.*?)\]/)) !== null) {
                definition = matches[1].length > 0 ? matches[1] : element['text'];
                definition = definition.toLowerCase();
                extent += matches[0].length; 
            } else {
                definition = element['text'].toLowerCase();
            }

            if (typeof jsOMS.Utils.Parser.Markdown.definitionData['Reference'][definition] === 'undefined') {
                return;
            }

            let def = jsOMS.Utils.Parser.Markdown.definitionData['Reference'][definition];
            element['attributes']['href'] = def['url'];
            element['attributes']['title'] = def['title'];
        }

        return {
            extent: extent,
            element: element
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineSpecialCharacter = function (excerpt)
    {
        if (excerpt['text'][0] === '&' || excerpt['text'].match(/^&#?\w+;/) === null) {
            return {
                markup: '&amp;',
                extent: 1
            };
        }

        let specialChr = {'>': 'gt', '<': 'lt', '"': 'quote'};

        if (typeof specialChar[excerpt['text'][0]] !== 'undefined') {
            return {
                markup: '&' + specialChar[excerpt['text'][0]] + ';',
                extent: 1
            };
        }
    };

    jsOMS.Utils.Parser.Markdown.inlineStrikethrough = function (excerpt)
    {
        if (typeof excerpt['text'][1] === 'undefined') {
            return;
        }

        let matches = null;
        if (excerpt['text'][1] !== '~' || (matches = excerpt['text'].match(/^~~(?=\S)(.+?)(?<=\S)~~/)) === null) {
            return;
        }

        return {
            extent: matches[0].length,
            element: {
                name: 'del',
                text: matches[1],
                handler: 'line'
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineUrl = function (excerpt)
    {
        if (typeof excerpt['text'][2] === 'undefined' || excerpt['text'][2] !== '/') {
            return;
        }

        let matches = null;
        if ((matches = excerpt['context'].match(/\bhttps?:[\/]{2}[^\s<]+\b\/*/ui)) === null) {
            return;
        }

        // todo: carefull php different?! match position missing
        return {
            extent: matches[0].length,
            position: 0,
            element: {
                name: 'a',
                text: matches[0],
                attributes: {
                    href: matches[0]
                }
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.inlineUrlTag = function (excerpt)
    {
        let matches = null;
        if (excerpt['text'].indexOf('>') === -1 || (matches = excerpt['text'].match(/^<(\w+:\/{2}[^ >]+)>/i)) === null) {
            return;
        }

        let url = matches[1];

        return {
            extent: matches[0].length,
            element: {
                name: 'a',
                text: url,
                attributes: {
                    href: url
                }
            }
        };
    };

    jsOMS.Utils.Parser.Markdown.unmarkedText = function (text)
    {
        return text.replace(/(?:[ ][ ]+|[ ]*\\\\)\n/, "<br />\n").replace(" \n", "\n");
    };

    jsOMS.Utils.Parser.Markdown.element = function (element)
    {
        element = jsOMS.Utils.Parser.Markdown.sanitizeElement(element);
        let markup = '<' + element['name'];

        if (typeof element['attributes'] !== 'undefined') {
            for (let key in element['attributes']) {
                if (element['attributes'][key] === null) {
                    continue;
                }

                markup += ' ' + key + '="' + jsOMS.Utils.Parser.Markdown.escape(element['attributes'][key]) + '"';
            }
        }

        if (typeof element['text'] !== 'undefined') {
            markup += '>';
            markup += typeof element['handler'] !== 'undefined' ? jsOMS.Utils.Parser.Markdown[element['handler']](element['text']) : jsOMS.Utils.Parser.Markdown.escape(element['text'], true);
            markup += '</' + element['name'] + '>';
        } else {
            markup += ' />';
        }

        return markup;
    }

    jsOMS.Utils.Parser.Markdown.elements = function (elements)
    {
        let markup = '';
        const length = elements.length;

        for (let i = 0; i < length; i++) {
            markup += "\n" + jsOMS.Utils.Parser.Markdown.element(elements[i]);
        }

        markup += "\n";

        return markup;
    };

    jsOMS.Utils.Parser.Markdown.li = function (lines) {
        let markup = jsOMS.Utils.Parser.Markdown.lines(lines);
        let trimmedMarkup = jsOMS.trim(markup);

        if (lines.indexOf('') === -1 && trimmedMarkup.substr(0, 3) === '<p>') {
            markup = trimmedMarkup;
            markup = markup.substr(3);
            let position = markup.indexOf('</p>');
            let temp = markup.substr(0, position - 1) + markup.substr(position + 4);
            markup = temp;
        }

        return markup;
    };

    jsOMS.Utils.Parser.Markdown.sanitizeElement = function (element)
    {
        const safeUrlNameToAtt = {
            a: 'href',
            img: 'src'
        };

        if (typeof safeUrlNameToAtt[element['name']] !== 'undefined') {
            element = jsOMS.Utils.Parser.Markdown.filterUnsafeUrlInAttribute(element, safeUrlNameToAtt[element['name']]);
        }

        if (typeof element['attributes'] !== 'undefined' && element['attributes'] !== null && element['attributes'] !== '') {
            for (let att in element['attributs']) {
                if (att.match(/^[a-zA-Z0-9][a-zA-Z0-9-_]*+$/) === null) {
                    delete element['attributes'][att]
                } else if (jsOMS.Utils.Parser.Markdown.striAtStart(att, 'on')) {
                    delete element['attributes'][att];
                }
            }
        }

        return element;
    };

    jsOMS.Utils.Parser.Markdown.filterUnsafeUrlInAttribute = function (element, attribute) 
    {
        const length = jsOMS.Utils.Parser.Markdown.safeLinksWhitelist.length;

        for (let i = 0; i < length; i++) {
            if (jsOMS.Utils.Parser.Markdown.striAtStart(element['attributes'][attribute], jsOMS.Utils.Parser.Markdown.safeLinksWhitelist[i])) {
                return element;
            }
        }

        element['attributes'][attribute] = element['attributes'][attribute].replace(':', '%3A');

        return element;
    };

    jsOMS.Utils.Parser.Markdown.escape = function (text, allowQuotes) 
    {
        allowQuotes = typeof allowQuotes === 'undefined' ? false : true;

        return jsOMS.htmlspecialchars(text, allowQuotes);
    };

    jsOMS.Utils.Parser.Markdown.striAtStart = function (string, needle)
    {
        const lenght = needle.length;

        if(length > string.length) {
            return false;
        } 

        return string.substr(0, length).toLowerCase() === needle.toLowerCase();
    };
}(window.jsOMS = window.jsOMS || {}));
