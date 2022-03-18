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
        const tableResult = prepareTableResult(tableData[0])
        // console.log("TABLE RESULT ==========\n", tableResult)
        
        await browser.close();

    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}
function prepareTableResult(tableData) {
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
    return resultArr
}