const express = require('express')
const app = express()
const router = express.Router();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 8000;
const scrapeHome = require('./service/scrapeHome');
const query = require('./service/query');
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
    if(!response.success){
        res.send(response);
    }else{
        res.send('Scrape complete')
    }
    console.log(response)
    
})
router.get('/:id/details',function(req, res) {
    res.send('This is the details of id')
})


app.use('/', router)
app.listen(port, () => console.log(`Test app listening on port ${port}!`))