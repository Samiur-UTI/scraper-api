const scraper = require('puppeteer');
const db = require('../model/index');
module.exports = async function searchDetails(query) {
    // console.log("SEARCH DETAILS", query)
    const prevDetails = await detailFinder(query.property_name,query.map);
    if (!prevDetails) {
        const browser = await scraper.launch({
            executablePath: '/usr/bin/chromium-browser'
        });
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
        await page.goto("https://www.getzips.com/zip.htm")
        await page.type('#fldZIPCode', `${query.zip}`)
        // await page.screenshot({ path: 'screenshot1.png', fullPage: true });
        await Promise.all([
            page.click('body > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > form > div:nth-child(3) > p > input[type=SUBMIT]'),
            page.waitForNavigation()
        ])
        let element = await page.$('body > p:nth-child(9) > table > tbody > tr:nth-child(2) > td:nth-child(3) > p')
        let value = await page.evaluate(el => el.textContent, element)
        // MAP SCRAPING
        let mapUrl = query.map ? query.map : 'https://www.floridahealthfinder.gov/facilitylocator/FacilityMap.aspx?pLicID=443001&pLinkID=2602207'
        // await page.goto(mapUrl)
        // await page.screenshot({ path: 'screenshot3.png', fullPage: true });
        if (value) {
            const propertyId = await db.property.findOne({
                where: {
                    property_name: query.property_name
                },
                attributes: ['id'],
                raw: true
            })
            const details = {
                name: query.property_name,
                city: query.city,
                state: query.state,
                zip: query.zip,
                phone: query.phone,
                photo: JSON.stringify(photUrlMaker()),
                property_type: query.property_type,
                capacity: Number(query.capacity),
                property_address: query.property_address,
                state: query.state,
                county: value,
                property_id: propertyId.id
            }
            await db.propertyDetails.create(details)
            let propertyDetails = await db.propertyDetails.findOne({
                where: {
                    name: details.name,
                    zip: details.zip
                },
                raw: true
            })
            propertyDetails = {
                ...propertyDetails,
                map: mapUrl
            }

            return {
                success: true,
                data: propertyDetails
            }
        }
        await browser.close();
        return {
            success: false
        }
    }
    return {
        success: true,
        data: prevDetails
    }
}
async function detailFinder(property_name,map) {
    const response = await db.propertyDetails.findOne({
        where: {
            name: property_name,
        },
        raw: true
    })
    if(response){
        return {
            ...response,
            map
        }
    }
}
function photUrlMaker() {
    let s3AccessUrl = process.env.AWS_S3
    let array = []
    for (let i = 1; i <= 9; i++) {
        let ext = 'jpg';
        if (i === 1 || i === 8) {
            ext = 'png'
        }
        let temp = s3AccessUrl + `${i}.${ext}`
        array.push(temp)
    }
    // console.log(array)
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return [array[0], array[1]];
}
