const jsVarStr = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const jsSingleQuoteStr = `'[^'\\\\]*(:?\\\\[\\s\\S][^'\\\\]*)*'`;
const jsDoubleQuoteStr = `"[^"\\\\]*(:?\\\\[\\s\\S][^"\\\\]*)*"`;
const jsQuoteStr = `(?:${jsSingleQuoteStr}|${jsDoubleQuoteStr})`;
const jsKeyStr = `(?:${jsVarStr}|${jsQuoteStr})`;
const jsPropStr = `(?:\\.${jsVarStr}|\\[${jsQuoteStr}\\])`;
const jsEmptyStr = `(?:''|"")`;
const reverseStr = ':function\\(a\\)\\{' +
    '(?:return )?a\\.reverse\\(\\)' +
    '\\}';
const sliceStr = ':function\\(a,b\\)\\{' +
    'return a\\.slice\\(b\\)' +
    '\\}';
const spliceStr = ':function\\(a,b\\)\\{' +
    'a\\.splice\\(0,b\\)' +
    '\\}';
const swapStr = ':function\\(a,b\\)\\{' +
    'var c=a\\[0\\];a\\[0\\]=a\\[b(?:%a\\.length)?\\];a\\[b(?:%a\\.length)?\\]=c(?:;return a)?' +
    '\\}';
const actionsObjRegexp = new RegExp(
    `var (${jsVarStr})=\\{((?:(?:${
				jsKeyStr}${reverseStr}|${
				jsKeyStr}${sliceStr}|${
				jsKeyStr}${spliceStr}|${
				jsKeyStr}${swapStr
			  }),?\\r?\\n?)+)\\};`);
const actionsFuncRegexp = new RegExp(`${`function(?: ${jsVarStr})?\\(a\\)\\{` +
				`a=a\\.split\\(${jsEmptyStr}\\);\\s*` +
				`((?:(?:a=)?${jsVarStr}`}${
			  jsPropStr
			}\\(a,\\d+\\);)+)` +
				`return a\\.join\\(${jsEmptyStr}\\)` +
				`\\}`);
			const reverseRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${reverseStr}`, 'm');
			const sliceRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${sliceStr}`, 'm');
			const spliceRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${spliceStr}`, 'm');
			const swapRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${swapStr}`, 'm');

function setParse(body) {
    var objResult = actionsObjRegexp.exec(body);
    var funcResult = actionsFuncRegexp.exec(body);
    //console.log("----------------objResult:", objResult)  
    if (!objResult || !funcResult) {
        return null;
    }

    var obj = objResult[1].replace(/\$/g, '\\$');
    var objBody = objResult[2].replace(/\$/g, '\\$');
    var funcBody = funcResult[1].replace(/\$/g, '\\$');

    let result = reverseRegexp.exec(objBody);
    console.log("boj bodey :", objBody, result, "------=", result[1])

    var reverseKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');
    console.log("reverseKey=", reverseKey)
    result = sliceRegexp.exec(objBody);
    var sliceKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');

    console.log("sliceKey=", sliceKey)
    result = spliceRegexp.exec(objBody);
    var spliceKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');
    console.log("sliceKey=", spliceKey)
    result = swapRegexp.exec(objBody);
    var swapKey = result && result[1]
        .replace(/\$/g, '\\$')
        .replace(/\$|^'|^"|'$|"$/g, '');
    console.log("swapKey=", swapKey)
    var keys = `(${[reverseKey, sliceKey, spliceKey, swapKey].join('|')})`;
    console.log("keys=", keys)
    var myreg = `(?:a=)?${obj
				  }(?:\\.${keys}|\\['${keys}'\\]|\\["${keys}"\\])` +
        `\\(a,(\\d+)\\)`;
    var tokenizeRegexp = new RegExp(myreg, 'g');
    console.log("tokenizeRegexp=", tokenizeRegexp)

    var tokens = [];
    while ((result = tokenizeRegexp.exec(funcBody)) !== null) {
        let key = result[1] || result[2] || result[3];
        switch (key) {
            case swapKey:
                tokens.push(`w${result[4]}`);
                break;
            case reverseKey:
                tokens.push('r');
                break;
            case sliceKey:
                tokens.push(`s${result[4]}`);
                break;
            case spliceKey:
                tokens.push(`p${result[4]}`);
                break;
        }
    }
    return tokens;
}

function setDownloadURL(format, sig) {
        let decodedUrl;
        if (format.url) {
            decodedUrl = format.url;
        } else {
            return;
        }

        try {
            decodedUrl = decodeURIComponent(decodedUrl);
        } catch (err) {
            return;
        }
        const host = getUrl(decodedUrl);
        if (sig) {
            host.query[format.sp || 'signature'] = sig;
        }

        let qurl = ""
        let query = host.query
        for (key in query) {
            if (qurl) {
                qurl += "&" + key + "=" + query[key]
            } else {
                qurl += key + "=" + query[key]
            }

        }
        let yurl = host.hostname + "?" + qurl

        format.url = yurl
        console.log("yurl:", yurl)
        return yurl
}

function querystringparse(str) {
    let nstrarr = str.split("&")
    let o = {}
    for (let i = 0; i < nstrarr.length; i++) {
        let nd = nstrarr[i]
        let ndarr = nd.split("=")
        o[ndarr[0]] = ndarr[1]
    }

    return o
}

const swapHeadAndPosition = (arr, position) => {
				const first = arr[0];
				arr[0] = arr[position % arr.length];
				arr[position] = first;
				return arr;
			};

function decipher(tokens, sig) {
    sig = sig.split('');
    for (let i = 0, len = tokens.length; i < len; i++) {
        let token = tokens[i],
            pos;
        switch (token[0]) {
            case 'r':
                sig = sig.reverse();
                break;
            case 'w':
                pos = ~~token.slice(1);
                sig = swapHeadAndPosition(sig, pos);
                break;
            case 's':
                pos = ~~token.slice(1);
                sig = sig.slice(pos);
                break;
            case 'p':
                pos = ~~token.slice(1);
                sig.splice(0, pos);
                break;
        }
    }
    return sig.join('');
}

function parseUrl(e) {
    var t, n, r, i, o, a = {};
    e = e ? e.replace(/[^\?]*\?/, "") : ""
    var l = e.split("&");
    for (i = 0, o = l.length; o > i; i++) t = l[i], n = t.indexOf("="), -1 !== n && (r = t.substr(n + 1), r = decodeURIComponent(r), a[t.substr(0, n)] = r);
    return a
}

function getUrl(url) {
    let query = parseUrl(url)

    let purl = {
        protocol: "https",
        slashes: true,
        host: "",
        hostname: '',
        query: query,
        pathname: "",
        path: ""
    }

    return {
        hostname: url.substring(0, url.indexOf("?")),
        query: query
    }

    purl['host'] = url.substring(0, url.indexOf("?"))
    query.ratebypass = 'yes';

    return purl
}     

var youtube = {
    basejs: "",
    init: function () {
        console.log("-------init-----:")
        
        console.log("-------document-----:", document)
        if (!document.getElementById("youtube_download")) {
            this.createEl()
        }
        
        //this.start()
    },

    createEl() { 
        let dom = document.createElement("div")
        let self = this;
        dom.onclick = function () {
            //this.style.display = 'none';
            //alert("hello")
            self.start();
        }
        dom.id = "youtube_download"
        dom.style.position = "absolute";
        dom.style.right = "50px;";
        dom.style.bottom = "100px";
        dom.style.width = "100px";
        dom.style.height = "100px";
        dom.style.background = "red";
        dom.style.opacity = "0.7";
        dom.style.borderRadius = "30%";
        dom.style.zIndex = 10000;
        dom.style.padding = "10px";

         dom.innerHTML = "download";

        document.body.appendChild(dom);
    },
    start: function() {
        let self = this;
        let baseUrl = "https://www.youtube.com" + yt.config_.PLAYER_JS_URL
        let ajax = new XMLHttpRequest()
        ajax.open('GET', baseUrl, true)
        ajax.send()
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    self.basejs = ajax.response
                    self.startparse()
                }
            }
        }
    },
    startparse: function() {
        let tokens = setParse(this.basejs)
        let self = this;
        let loc_formats = window.ytInitialPlayerResponse.streamingData.adaptiveFormats
        let formats = Object.assign({}, loc_formats);
        console.log("tokens:", tokens)
        let arr = []
        loc_formats.forEach(ft => {
            console.log("format:", ft)
            let format = Object.assign({}, ft);
            let cipher = format.signatureCipher || format.cipher;
            console.log("cipher---:", cipher)

            if (cipher) {
                Object.assign(format, querystringparse(cipher));
                delete format.signatureCipher;
                delete format.cipher;
            }
            const sig = tokens && format.s ? decipher(tokens, format.s) : null;
            setDownloadURL(format, sig);
            if (format.mimeType.indexOf("audio") > -1) { 
                //self.download(format.url)
                let name = "youtube_" + Math.ceil(Math.random() * 1000)
                arr.push({
                    name: name,
                    url: format.url
                })
            }
        });
        self.download(arr)       
    },
    download: function (param) { 
        console.log("param:", param)
        try {
            pdata = JSON.stringify(param)
            window.youtubedown.testchanel(pdata)
        } catch (e) {
            console.log("e:", e)
        }
    }
}

setTimeout(function() {
    youtube.init()
}, 1000)