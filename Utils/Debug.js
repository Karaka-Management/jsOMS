var visited = [];
var findings = {};
var cssSelectors = {},
    cssSelectorsLength = 0;
const cssFiles = ['http://127.0.0.1/cssOMS/styles.css'];
const cssFilesLength = cssFiles.length;
const domain = window.location.hostname;
const pageLimit = 10;

var cssRequest = new XMLHttpRequest();
cssRequest.onreadystatechange = function()
{
    if (cssRequest.readyState == 4 && cssRequest.status == 200) {
        const cssText = this.responseText;
        const result = cssText.match(/[a-zA-Z0-9\ :>~\.\"'#,\[\]=\-\(\)\*]+{/g),
            resultLength = result.length;

        for (let i = 1; i < resultLength; ++i) {
            let sel = result[i].substring(0, result[i].length - 1).trimLeft().trimRight().trimRight();
            if (!cssSelectors.hasOwnProperty(sel)) {
                cssSelectors[sel] = 0;
                ++cssSelectorsLength;
            }
        }
    }
}

for (let i = 0; i < cssFilesLength; ++i) {
    cssRequest.open('GET', cssFiles[i], true);
    cssRequest.send();
}

validatePage = function(url)
{
    if (visited.includes(url) || visited.length > pageLimit - 1) {
        return;
    }

    // mark url as visited
    visited.push(url);
    findings[url] = {};

    // web request
    var webRequest = new XMLHttpRequest();
    webRequest.onreadystatechange = function()
    {
        if (webRequest.readyState == 4 && webRequest.status == 200) {
            // replace content
            document.open();
            document.write(this.responseText);
            document.close();

            // analyze img alt attribute
            let imgAlt = document.querySelectorAll('img:not([alt]), img[alt=""], img[alt=" "]');
            findings[url]['img_alt'] = imgAlt.length;

            // analyze img src
            let imgSrc = document.querySelectorAll('img:not([src]), img[src=""], img[src=" "]');
            findings[url]['img_src'] = imgSrc.length;

            // analyze empty link
            let aHref = document.querySelectorAll('a:not([alt]), a[href=""], a[href=" "], a[href="#"]');
            findings[url]['href_empty'] = aHref.length;

            // analyze inline on* function
            let onFunction = document.querySelectorAll('[onafterprint], [onbeforeprint], [onbeforeunload], [onerror], [onhaschange], [onload], [onmessage], [onoffline], [ononline], [onpagehide], [onpageshow], [onpopstate], [onredo], [onresize], [onstorage], [onundo], [onunload], [onblur], [onchage], [oncontextmenu], [onfocus], [onformchange], [onforminput], [oninput], [oninvalid], [onreset], [onselect], [onsubmit], [onkeydown], [onkeypress], [onkeyup], [onclick], [ondblclick], [ondrag], [ondragend], [ondragenter], [ondragleave], [ondragover], [ondragstart], [ondrop], [onmousedown], [onmousemove], [onmouseout], [onmouseover], [onmouseup], [onmousewheel], [onscroll], [onabort], [oncanplay], [oncanplaythrough], [ondurationchange], [onemptied], [onended], [onerror], [onloadeddata], [onloadedmetadata], [onloadstart], [onpause], [onplay], [onplaying], [onprogress], [onratechange], [onreadystatechange], [onseeked], [onseeking], [onstalled], [onsuspend], [ontimeupdate], [onvolumechange], [onwaiting]');
            findings[url]['js_on'] = onFunction.length;

            // analyze missing form element attributes
            let formElements = document.querySelectorAll('input:not([id]), input[type=""], select:not([id]), textarea:not([id]), label:not([for]), label[for=""], label[for=" "], input:not([name]), select:not([name]), textarea:not([name]), form:not([id]), form:not([action]), form[action=""], form[action=" "], form[action="#"]');
            findings[url]['form_elements'] = formElements.length;

            // analyze invalid container-children relationship (e.g. empty containers, invalid children)
            let invalidContainerChildren = document.querySelectorAll(':not(tr) > td, :not(tr) > th, colgroup *:not(col), :not(colgroup) > col, tr > :not(td):not(th), optgroup > :not(option), :not(select) > option, :not(fieldset) > legend, select > :not(option):not(optgroup), :not(select):not(optgroup) > option, table > *:not(thead):not(tfoot):not(tbody):not(tr):not(colgroup):not(caption)');
            findings[url]['invalid_container_children'] = invalidContainerChildren.length;

            // has inline styles
            let hasInlineStyles = document.querySelectorAll('*[style]');
            findings[url]['form_elements'] = hasInlineStyles.length;

            // analyze css usage
            let cssFound;
            for (let i in cssSelectors) {
                try {
                    cssFound = document.querySelectorAll(i.replace(/:hover|:active/gi, ''));
                    cssSelectors[i] = cssFound === null ? 0 : cssFound.length
                } catch (e) {}
            }

            // check other pages
            let links = document.querySelectorAll('a'),
                    linkLength = links.length;

            for (let i = 0; i < linkLength; ++i) {
                if (visited.includes(links[i].href) ||
                    (!links[i].href.startsWith('/') && links[i].href.startsWith('http') && !links[i].href.includes(domain))
                ) {
                    continue;
                }

                validatePage(links[i].href);
            }
        }
    };

    webRequest.open('GET', url, true);
    webRequest.send();
};

validatePage(location.href);

console.table(findings);
console.table(cssSelectors);