const db = require('../model/index');
const search = require('./search');
module.exports = async function query(req) {
    //need to check if the searh query is valid
    if (!req.facility || !req.name) {
        //if not, return error
        return {
            success: false,
            message: 'Invalid search query'
        }
    }
    //if valid, check db for the query
    const { facility, name, city } = req;
    let resultData;
    if (facility === "ALL") {
        //if all facility, search for all facility
        resultData = await db.property.findAll({
            attributes: [
                'property_name',
                'city',
                'state',
                'zip',
                'phone',
                'property_type',
                'capacity',
                'property_address',
                'property_type_id'
            ],
            raw: true,
        })
        // console.log("DB CHECK ==========\n", resultData)
    } else {
        const propertyTypeDetails = await db.propertyType.findOne({
            where: {
                value: facility
            },
            attributes: ['name'],
            raw: true
        })
        resultData = await db.property.findAll({
            where: {
                property_type: propertyTypeDetails.name,
            },
            attributes: ['id', 'property_name', 'property_address', 'city', 'state', 'phone', 'property_type', 'zip', 'capacity', 'photo', 'property_type_id'],
            raw: true
        })
        // console.log("DB CHECK ==========\n", resultData)
    }
    const preparedResponse = sortAndFilterResult(resultData,name,city)
    console.log("PREPARED RESPONSE ==========\n", preparedResponse)
    if(!preparedResponse.length){
        //if query is not in db, scrape the website and save the result to db and return the result
        console.log("SEND TO SEARCH")
        const result = await search((req))
        if(!result.success || !result.data.length){
            return {
                success: false,
                message: 'No results found'
            }
        }
        const searchResponse = sortAndFilterResult(result.data,name,city)
        return {
            success: true,
            data: searchResponse
        }
    }
    //if query is in db, return the result
    return {  
        success: true,
        data: preparedResponse,
    } 
}
function sortAndFilterResult(dbResults,name,city){
    let result = []
    dbResults.forEach(el => {
        if(el.property_name.toLowerCase().includes(name.toLowerCase()) && el.city.toLowerCase().includes(city.toLowerCase())){
            result.push(el)
        }
    })
    return result.sort(function(a, b){
        let x = a.property_name.toLowerCase();
        let y = b.property_name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
}