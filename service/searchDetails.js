const scraper = require('puppeteer');
const db = require('../model/index');
module.exports = async function searchDetails(query) {
    console.log("SEARCH DETAILS", query)
    const browser = await scraper.launch();
    const page = await browser.newPage()
    await page.goto("https://www.getzips.com/zip.htm")
    await page.type('#fldZIPCode', `${query.zip}`)
    await page.click('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > form > div:nth-child(3) > p > input[type=SUBMIT]')
    await page.waitForNavigation();
    let element = await page.$('body > p:nth-child(9) > table > tbody > tr:nth-child(2) > td:nth-child(3) > p')
    let value = await page.evaluate(el => el.textContent, element)
    console.log(value)
    if(value){
        const propertyId = await db.property.findOne({
            where: {
                property_name: query.property_name
            },
            attributes: ['id'],
            raw: true
        })
        const details = {
            name: query.property_name,
            city:query.city,
            state:query.state,
            zip:query.zip,
            phone:query.phone,
            property_type:query.property_type,
            capacity:Number(query.capacity),
            property_address:query.property_address,
            state:query.state,
            county: value,
            property_id: propertyId.id
        }
        console.log("property DETAILS", details)
        await db.propertyDetails.create(details)
        return {
            success: true,
            data: details
        }
    }
    await browser.close();
    return {
        success: false
    }
}
