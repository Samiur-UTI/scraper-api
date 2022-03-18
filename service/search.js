const db = require('../model/index');
const scraper = require('puppeteer');
module.exports = async function searchAndScrape(req){
    let {facility,name,city,county,address,zip} = req;
    county = Number(county) + 1 
    try {
        const browser = await scraper.launch();
        const page = await browser.newPage()
        await page.goto("https://www.floridahealthfinder.gov/facilitylocator/FacilitySearch.aspx")
        
        await page.select('select[name="ctl00$mainContentPlaceHolder$FacilityType"]', `${facility}`+`  `);
        await page.type('#ctl00_mainContentPlaceHolder_FacilityName', `${name}`)
        await page.type('#ctl00_mainContentPlaceHolder_FacilityAddress', `${address}`)
        await page.type("#ctl00_mainContentPlaceHolder_City", `${city}`)
        await page.type("#ctl00_mainContentPlaceHolder_Zipcode", `${zip}`)
        await page.click('#SearchTable > tbody > tr:nth-child(9) > td:nth-child(2) > div.lookupFieldContainer > input')
        await page.click(`#ctl00_mainContentPlaceHolder_County > option:nth-child(${county})`);
        await page.screenshot({path: 'screenshot.png', fullPage: true});
        await browser.close();
        
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}