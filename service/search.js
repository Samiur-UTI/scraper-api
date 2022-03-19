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

        if (facility === 'ALL') {
            await page.select('select[name="ctl00$mainContentPlaceHolder$FacilityType"]', `${facility}`);
        } else {
            await page.select('select[name="ctl00$mainContentPlaceHolder$FacilityType"]', `${facility}` + `  `);
        }
        if (name) { await page.type('#ctl00_mainContentPlaceHolder_FacilityName', `${name}`) }
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
        await page.screenshot({ path: 'screenshot2.png', fullPage: true });
        let tableData = await page.$$eval('#ctl00_mainContentPlaceHolder_dgFacilities', row => {
            return Array.from(row, el => {
                const columns = el.querySelectorAll('tr')
                return columns.length ? Array.from(columns, col => col.innerText.trim()) : null
            })
        })
        tableData[0].splice(0,1)
        let propertySearch = await prepareTableResult(tableData[0])
        await browser.close();
        // console.log("SEARCH RESULT ===========\n",propertySearch)
        await db.property.bulkCreate(propertySearch.map(el => (el)))
        return {
            success: true,
            data: propertySearch
        }
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}
async function prepareTableResult(tableData) {
    const resultArr = []
    tableData.forEach((el) => {
        const fieldObject = {
            property_name:'',
            property_type:'',
            property_address:'',
            city:'',
            state:'',
            zip:'',
            phone:'',
            capacity:''
        }
        let tempArray = el.split('\t')
        for(let i =0; i<tempArray.length; i++){
            fieldObject[Object.keys(fieldObject)[i]] = tempArray[i]
        }
        resultArr.push(fieldObject)
    })
    let propertySearch = await Promise.all(
        resultArr.map(async (el) => {
            const propertyTypeDetails = await db.propertyType.findOne({
                where: {
                    name: el.property_type
                },
                attributes: ['id'],
                raw: true
            })
            return {
                ...el,
                ...Number(el.phone),
                ...Number(el.zip),
                ...Number(el.capacity),
                property_type_id: propertyTypeDetails.id
            }
        })
    )
    propertySearch = propertySearch.map(property => {
        return {
            ...property,
            property_name: property.property_name.replace(/\s\s+/g, ' '),
            property_address: property.property_address.replace(/\s\s+/g, ' '),
            city: property.city.replace(/\s\s+/g, ' '),
            state: property.state.replace(/\s\s+/g, ' '),
            zip: property.zip.replace(/\s\s+/g, ' '),
            phone: property.phone.replace(/\s\s+/g, ' '),
            capacity: Number(property.capacity)
        }
    })
    return propertySearch
}