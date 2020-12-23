const puppeteer = require('puppeteer');
const url = require("url")
    // const devices = require('puppeteer/DeviceDescriptors')
async function start(id) {
    const browser = await puppeteer.launch({
        headless: false,
        /*args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
		*/
    });
    //let URL = "https://m.youtube.com/watch?v=" + id
    let URL = "https://m.youtube.com/watch?v=" + id
    console.log("start url:", URL)
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //    await page.emulate(devices['iPhone X'])
    await page.goto(URL)
        // await page.waitForNavigation()
    await page.waitForTimeout(3000)
        // page.waitForNavigation({timeout: 3000, waitUntil: ['domcontentloaded', 'waitUntil']})
    console.log("goto url:", URL)
    let ydata = await page.evaluate(asnc() => {

                return await new Promise((resolve, reject) => {
                            let allUrl = {}
                            setTimeout(() => {
                                console.log("ytInitialPlayerResponse:", window.ytInitialPlayerResponse)
                                console.log("formats:", window.ytInitialPlayerResponse.streamingData.formats)
                                console.log("adaptiveFormats:", window.ytInitialPlayerResponse.streamingData.adaptiveFormats)
                                console.log("videoDetails:", window.ytInitialPlayerResponse.videoDetails)
                            }, 5000)


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


			let body = ""
			/*
			setInterval(()=>{
				console.log("------------------start-------------------")
				// setParse()
				let tokens = setParse()
				console.log("-------------------tokens----------------:", tokens)
			}, 5000)
			*/
			let baseUrl = "https://www.youtube.com" + yt.config_.PLAYER_JS_URL
			console.log("baseurl:", baseUrl)
			let ajax = new XMLHttpRequest()
			ajax.open('GET', baseUrl, true)
			ajax.send()
			ajax.onreadystatechange = function () {
				if (ajax.readyState === 4) {
					if (ajax.status === 200) {
						//let str = JSON.parse(ajax.response)
						body = ajax.response

						start()
						//console.log(ajax.response);
					}
				}
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




				console.log("decodedUrl:", decodedUrl)
				// Make some adjustments to the final url.
				//const parsedUrl = url.parse(decodedUrl, true);
				const host = getUrl(decodedUrl);
				console.log("format url:", host)
				// Deleting the `search` part is necessary otherwise changes to
				// `query` won't reflect when running `url.format()`
				//delete parsedUrl.search;

				// let query = parsedUrl.query;


				// This is needed for a speedier download.
				// See https://github.com/fent/node-ytdl-core/issues/127
				// query.ratebypass = 'yes';
				if (sig) {
					// When YouTube provides a `sp` parameter the signature `sig` must go
					// into the parameter it specifies.
					// See https://github.com/fent/node-ytdl-core/issues/417
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
				// format.url = url.format(parsedUrl);
			}

			let rdata = []

			function start() {
				let tokens = setParse()
				let loc_formats = window.ytInitialPlayerResponse.streamingData.adaptiveFormats
				let formats = Object.assign({}, loc_formats);
				console.log("formats:", loc_formats)
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
					console.log("解析出的sig:", sig)

					//console.log("format center:", format)
					/*
					let cipher = format.signatureCipher || format.cipher;
					if (cipher) {
					  Object.assign(format, querystring.parse(cipher));
					  delete format.signatureCipher;
					  delete format.cipher;
					}
					const sig = tokens && format.s ? exports.decipher(tokens, format.s) : null;
					console.log("sig:", sig)
					*/
					//exports.setDownloadURL(format, sig);
					// decipheredFormats[format.url] = format;
					rdata.push({
						format: format,
						sig: "df"
					})
				});
				// console.log("adaptiveFormats:", window.ytInitialPlayerResponse.streamingData.adaptiveFormats)
				//resolve(rdata)
				console.log("-------------------tokens----------------:", tokens, formats)
			}



			function setParse() {
				const objResult = actionsObjRegexp.exec(body);
				const funcResult = actionsFuncRegexp.exec(body);
				//console.log("----------------objResult:", objResult)  
				if (!objResult || !funcResult) {
					return null;
				}

				const obj = objResult[1].replace(/\$/g, '\\$');
				const objBody = objResult[2].replace(/\$/g, '\\$');
				const funcBody = funcResult[1].replace(/\$/g, '\\$');

				let result = reverseRegexp.exec(objBody);
				console.log("boj bodey :", objBody, result, "------=", result[1])

				const reverseKey = result && result[1]
					.replace(/\$/g, '\\$')
					.replace(/\$|^'|^"|'$|"$/g, '');
				console.log("reverseKey=", reverseKey)
				result = sliceRegexp.exec(objBody);
				const sliceKey = result && result[1]
					.replace(/\$/g, '\\$')
					.replace(/\$|^'|^"|'$|"$/g, '');

				console.log("sliceKey=", sliceKey)
				result = spliceRegexp.exec(objBody);
				const spliceKey = result && result[1]
					.replace(/\$/g, '\\$')
					.replace(/\$|^'|^"|'$|"$/g, '');
				console.log("sliceKey=", spliceKey)
				result = swapRegexp.exec(objBody);
				const swapKey = result && result[1]
					.replace(/\$/g, '\\$')
					.replace(/\$|^'|^"|'$|"$/g, '');
				console.log("swapKey=", swapKey)
				const keys = `(${[reverseKey, sliceKey, spliceKey, swapKey].join('|')})`;
				console.log("keys=", keys)
				const myreg = `(?:a=)?${obj
				  }(?:\\.${keys}|\\['${keys}'\\]|\\["${keys}"\\])` +
					`\\(a,(\\d+)\\)`;
				const tokenizeRegexp = new RegExp(myreg, 'g');
				console.log("tokenizeRegexp=", tokenizeRegexp)

				const tokens = [];
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



			/*
                try {
                    // let dom = document.getElementsByClassName("entry-content")[0]
                    let domtime = document.getElementsByClassName("ytp-time-display notranslate")[0]
                    let countstr = (document.getElementsByClassName("view-count style-scope yt-view-count-renderer")[0]).innerText
                    allUrl['length_format'] = domtime.getElementsByClassName("ytp-time-duration")[0].innerHTML
                        // allUrl['browser_count'] = document.getElementsByClassName("short-view-count style-scope yt-view-count-renderer")[0].innerText
                    allUrl['browser_count'] = countstr
                    allUrl['title'] = (document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[0]).innerText
                    resolve(allUrl)
                } catch (e) {

                    resolve(allUrl)
                    reject(e)
                }
				*/

		})
		//return allUrl
	})
	//console.log("ydata:", ydata)

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

		// Make some adjustments to the final url.
		//console.log("decodedUrl:", decodedUrl)
		const parsedUrl = url.parse(decodedUrl, true);
		//console.log("parseUrl:", parsedUrl)
		//console.log("format url:", parsedUrl)
		// Deleting the `search` part is necessary otherwise changes to
		// `query` won't reflect when running `url.format()`
		delete parsedUrl.search;

		let query = parsedUrl.query;


		// This is needed for a speedier download.
		// See https://github.com/fent/node-ytdl-core/issues/127
		console.log("计算出 sig:", sig)
		query.ratebypass = 'yes';
		if (sig) {
			// When YouTube provides a `sp` parameter the signature `sig` must go
			// into the parameter it specifies.
			// See https://github.com/fent/node-ytdl-core/issues/417
			query[format.sp || 'signature'] = sig;
		}
		//console.log("format url:", url.format(parsedUrl))
		//console.log("url.format:", url.format(parsedUrl))
		format.url = url.format(parsedUrl);
	};
	//console.log("ydata:", ydata)
	for (let i = 0; i < ydata.length; i++) {
		let yobj = ydata[i]
		setDownloadURL(yobj.format, yobj.sig)
		if (yobj.format.mimeType.indexOf("audio") > -1)
			console.log("yobj:", yobj.format)
	}
	// browser.close()

}

start("5C-bK3jNx_k")