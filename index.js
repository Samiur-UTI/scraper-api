const express = require('express')
const app = express()
const router = express.Router();
const bodyParser = require('body-parser')
const port = process.env.PORT || 8000;
const scrapeHome = require('./service/scrapeHome');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Routes

router.get('/', async (req, res) => {
    const response = await scrapeHome();
    if(response.error) {
        return response.error;
    }
    res.send(response);
})

router.get('/search', async function(req, res) {
    // await scrape()
    res.send('Scrape complete')
})
router.get('/:id/details',function(req, res) {
    res.send('This is the details of id')
})


app.use('/', router)
app.listen(port, () => console.log(`Test app listening on port ${port}!`))