const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')
const db = require('../models')

// API_TOKEN='c8dtp7qad3i91d977dt0'
// SANDBOX_API_TOKEN='sandbox_c8dtp7qad3i91d977dtg'

router.get('/:id', async (req,res) => {
    try  {
        let symbol = req.params.id
        let endPoint_GLOBAL_QUOTE = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`        
        let endPoint_PROFILE = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.API_TOKEN}`

        const resGLOBAL_QUOTE = await axios.get(endPoint_GLOBAL_QUOTE)
        const resProfile = await axios.get(endPoint_PROFILE)
        
        console.log(resGLOBAL_QUOTE.data["Global Quote"])
        console.log(resProfile.data)
        res.render('company/index.ejs',{message: null, gq: resGLOBAL_QUOTE.data["Global Quote"], p: resProfile.data})
    } catch(err) {
        res.render('company/index.ejs',{message: err})    
    }    
})


module.exports= router