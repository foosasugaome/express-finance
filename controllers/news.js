const express = require('express')
const router = express.Router()
require('dotenv').config()
const axios = require('axios')
const db = require('../models')

router.get('/', async (req, res) => {
    try  {
        let endpoint = `https://finnhub.io/api/v1/news?category=general&token=${process.env.API_TOKEN}&minId=10`
        const respNews = await axios.get(endpoint)

        let quotesEndPoint = `https://api.stockdata.org/v1/data/quote?symbols=AMZN,MSFT,AAPL,TSLA,FB,GOOG,NFLX,&api_token=${process.env.STOCKDATA_TOKEN}`
        let responseQuotes = await axios.get(quotesEndPoint)
        let quotes = responseQuotes.data.data

        let cryptoEndPoint = `https://api.stockdata.org/v1/data/currency/latest?symbols=BTCUSD,ETHUSD,XRPUSD,BCHUSD,ADAUSD,LTCUSD,XEMUSD,XLMUSD,DOGEUSD&api_token=${process.env.STOCKDATA_TOKEN}`
        let resCrypto = await axios.get(cryptoEndPoint)

        res.render('news/news.ejs',{message: null, news: respNews.data, quotes: quotes, crypto: resCrypto.data.data})
    } catch(err) {        
        res.render('news/news.ejs', {message: err})
    }
})


module.exports = router