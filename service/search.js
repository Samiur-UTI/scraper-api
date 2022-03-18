const db = require('../model/index');
const scraper = require('puppeteer');
module.exports = async function searchAndScrape(req) {
    let { facility, name, city, county, address, zip } = req;
    county = Array.isArray(county) ? '' : Number(county) + 1 
    try {
        console.log(facility, name, city, county, address, zip)
        const browser = await scraper.launch();
        const page = await browser.newPage()
        await page.goto("https://www.floridahealthfinder.gov/facilitylocator/FacilitySearch.aspx")

        if(facility === 'ALL'){
            await page.select('select[name="ctl00$mainContentPlaceHolder$FacilityType"]', `${facility}`);
        }else{
            await page.select('select[name="ctl00$mainContentPlaceHolder$FacilityType"]', `${facility}` + `  `);
        }
        await page.type('#ctl00_mainContentPlaceHolder_FacilityName', `${name}`)
        if (address) { await page.type('#ctl00_mainContentPlaceHolder_FacilityAddress', `${address}`) }
        if (city) { await page.type("#ctl00_mainContentPlaceHolder_City", `${city}`) }
        if (zip) { await page.type("#ctl00_mainContentPlaceHolder_Zipcode", `${zip}`) }
        if (county) {
            await page.click('#SearchTable > tbody > tr:nth-child(9) > td:nth-child(2) > div.lookupFieldContainer > input')
            await page.click(`#ctl00_mainContentPlaceHolder_County > option:nth-child(${county})`)
        }
        await page.screenshot({ path: 'screenshot1.png', fullPage: true });
        await page.click(`#ctl00_mainContentPlaceHolder_SearchButton`);
        await page.waitForNavigation();
        const response = await page.evaluate(() => {
            const empty = document.getElementById('#ctl00_mainContentPlaceHolder_lblError')
            return empty ? empty.innerHTML : null
        })
        if (response) {
            console.log(response)
            return response
        }
        await page.screenshot({ path: 'screenshot2.png', fullPage: true });
        await browser.close();

    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}