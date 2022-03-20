const express = require('express')
const app = express()
const router = express.Router();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 8000;
const scrapeHome = require('./service/scrapeHome');
const query = require('./service/query');
const searchDetails = require('./service/searchDetails')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Routes

router.get('/', async (req, res) => {
    console.log('Home page loader hitted!')
    const response = await scrapeHome();
    if(response.error) {
        return response.error;
    }
    console.log("RESPONSE RETURNED")
    res.send(response);
})

router.post('/search', async function(req, res) {
    const response = await query(req.body);
    if(!response || !response.success) {
        res.json({
            success: false,
            message: "Could not find the search result"
        })
    }else{
        res.send(response)
    }
})
router.get('/details',async function(req, res) {
    if(req.query.hasOwnProperty('zip') && req.query.hasOwnProperty('property_address')) {
        const response = await searchDetails(req.query);
        if(response && response.success){
            res.send(response)
        }
        return{
            success: false,
            message: "Could not find the search details"
        }
    }
})


app.use('/', router)
app.listen(port, () => console.log(`Test app listening on port ${port}!`))