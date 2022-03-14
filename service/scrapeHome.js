const scraper = require('puppeteer');
const db = require('../model/index');
async function scrape() {
    const browser = await scraper.launch()
    const page = await browser.newPage()
    try {
        await page.goto("https://www.floridahealthfinder.gov/facilitylocator/FacilitySearch.aspx")
        const optionsType = await page.$$eval("#ctl00_mainContentPlaceHolder_FacilityType option", options => options.map(option => option.text.trim()))
        const valuesType = await page.$$eval("#ctl00_mainContentPlaceHolder_FacilityType option", options => options.map(option => option.value.trim()))
        const optionsCounty = await page.$$eval("#ctl00_mainContentPlaceHolder_County option", options => options.map(option => option.text.trim()))
        const valuesCounty = await page.$$eval("#ctl00_mainContentPlaceHolder_County option", options => options.map(option => option.value.trim()))
        const propertyTypeTable = prepareTableResult(optionsType, valuesType)
        const countyTable = prepareTableResult(optionsCounty, valuesCounty)
        const propertyData = await db.propertyType.findAll({
            attributes: ['name', 'value']
        })
        const countyData = await db.county.findAll({
            attributes: ['name', 'value']
        })
        if (propertyData.length === 0) {
            await db.propertyType.bulkCreate(propertyTypeTable.map(prp => prp))
        }
        if (countyData.length === 0) {
            await db.county.bulkCreate(countyTable.map(cnty => cnty))
        }
        await db.propertyType.update(propertyTypeTable.map(prp => prp), {
            where: {
                name: propertyTypeTable.map(prp => prp.name),
                value: propertyTypeTable.map(prp => prp.value)
            }
        })
        await db.county.update(countyTable.map(cnty => cnty), {
            where: {
                name: countyTable.map(cnty => cnty.name),
                value: countyTable.map(cnty => cnty.value)
            }
        })
        await browser.close()
        const property = await db.propertyType.findAll()
        const county = await db.county.findAll()
        const data = {
            property,
            county
        }
        return {
            success: true,
            message:'Home page scraped successfully',
            data
        }
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}
function prepareTableResult(options, values) {
    let result = []
    for (let i = 0; i < options.length; i++) {
        result.push({
            name: options[i],
            value: values[i]
        })
    }
    return result
}
module.exports = scrape