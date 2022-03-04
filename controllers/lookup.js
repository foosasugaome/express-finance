const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')


// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key

router.post('/', async (req, res)=>{
  let keyword = req.body.keyword
  let endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`

  try {
    const response = await axios.get(endpoint)
    res.render('stocks/results.ejs', {message: null, result: response.data})    
  }catch(err) {    
    res.render('stocks/results.ejs', {message: err})
  }
})

module.exports = router