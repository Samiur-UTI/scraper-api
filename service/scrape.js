const scraper = require('puppeteer');

async function scrape(){
    const browser = await scraper.launch()
    const page = await browser.newPage()
    await page.goto("https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc")
    await page.screenshot({
        path: 'screenshot.png'
    })
    await browser.close()
}
module.exports = scrape