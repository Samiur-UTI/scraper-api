const express = require('express')
const app = express()
const router = express.Router();
const bodyParser = require('body-parser')
const port = process.env.PORT || 8000;
const scraper = require('./service/scrape');
const scrape = require('./service/scrape');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//Routes
router.get('/search', async function(req, res) {
    await scrape()
    res.send('Scrape complete')
})
router.get('/:id/details',function(req, res) {
    res.send('This is the details of id')
})


app.use('/', router)
app.listen(port, () => console.log(`Test app listening on port ${port}!`))