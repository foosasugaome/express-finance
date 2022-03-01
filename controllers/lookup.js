const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_TOKEN
const finnhubClient = new finnhub.DefaultApi()

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key

router.post('/', async (req, res)=>{
  let keyword = req.body.keyword
  let endpoint = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`

  try {
    const response = await axios.get(endpoint)
    // res.send(response.data.bestMatches)
    res.render('stocks/results.ejs', {message: null, result: response.data})    
  }catch(err) {    
    res.render('stocks/results.ejs', {message: err})
  }
})


// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       // data is successfully parsed as a JSON object:
//       console.log(data);
//     }
// });

module.exports = router