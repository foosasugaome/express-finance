const express = require('express')
const router = express.Router()
require('dotenv').config()
const axios = require('axios')
const db = require('../models')

router.get('/', async(req, res) => {
    try {
        const resp = await axios.get(`https://api.stockdata.org/v1/data/intraday?symbols=AAPL&api_token=nor9KytrvTKeJTvFaxKLpFeFAdPruqrnNuAXFdmj`)

        // const ctx = document.getElementById('myChart').getContext('2d')
        res.render('chart/chart.ejs',{objResponse : resp.data.data})
    } catch(err) {
        console.log(err)
    }
    
})


module.exports=router
