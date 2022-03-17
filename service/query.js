const db = require('../model/index');
module.exports = async function query(req){
    //need to check if the searh query is valid
    if(!req.facility || !req.name){
        //if not, return error
        return {
            success: false,
            message: 'Invalid search query'
        }
    }
    //if valid, check db for the query
    const {facility,name,city,county,phone} = req;
    const propertyTypeDetails = await db.propertyType.findOne({
        where: {
            value: facility
        },
        attributes: ['name'],
        raw: true
    })
    const countyDetails =  await db.county.findOne({
        where: {
            value: county
        },
        attributes: ['name'],
        raw: true
    })
    // console.log(propertyTypeDetails)
    // console.log(countyDetails)
    const resultData = await db.property.findAll({
        where: {
            property_type: propertyTypeDetails.name,
            county: countyDetails.name,
        },
        attributes: ['id','property_name','property_address','city','state','county','phone','property_type','zipcode','capacity','photo','property_id','county_id'],
    })
    if(!resultData.length){

    }
    //if query is in db, return the result
    //if query is not in db, scrape the website and save the result to db and return the result
    return {  
        success: true,
        message: 'Success',
     } 
}