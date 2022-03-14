const scraper = require('puppeteer');
const db = require('../model/index');
async function scrape(){
    const browser = await scraper.launch()
    const page = await browser.newPage()
    await page.goto("https://www.floridahealthfinder.gov/facilitylocator/FacilitySearch.aspx")
    const options = await page.$$eval("#ctl00_mainContentPlaceHolder_FacilityType option", options => options.map(option => option.text))
    db.propertyType.bulkCreate(options.map(option => ({name: option})))     
    await browser.close()
}
module.exports = scrape