const puppeteer = require('puppeteer');

(async() => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto('https://www.youtube.com/watch?v=a06s-PkBi1g');
        await page.screenshot({ path: './example.png' });
        let ydata = await page.evaluate(async() => {

            return await new Promise((resolve, reject) => {
                let allUrl = {}
                let data = ytInitialPlayerResponse.videoDetails
                let time = ytInitialPlayerResponse.videoDetails.lengthSeconds

                let h = parseInt(time / 3600)
                let s = parseInt((time - h * 3600) / 60)

                let m = time - h * 3600 - s * 60
                if (m < 10) m = "0" + m
                if (s < 10) s = "0" + s
                let tstr = h + ":" + s + ":" + m
                resolve({
                    length_format: tstr,
                    th_id: data.videoId,
                    title: data.title,
                    browser_count: data.viewCount
                })
            })

        })
        console.log("---------------", ydata)
        await browser.close();
    } catch (e) {
        console.log("e:", e)
    }

})();