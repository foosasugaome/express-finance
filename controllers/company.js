const express = require('express')
const router = express.Router()
require('dotenv').config()
const axios = require('axios')
const db = require('../models')

router.get('/:id', async (req,res) => {
    try  {
        let symbol = req.params.id
        let isInWatchList = false        

        const foundSymbol = await db.watchlist.findOne({
            where: {userId: res.locals.user.id, symbol: symbol}            
        })
        if(foundSymbol) {            
            isInWatchList= true
        }
        
        let quoteEndPoint = `https://api.stockdata.org/v1/data/quote?symbols=${symbol}&api_token=${process.env.STOCKDATA_TOKEN}`

        const resQuote = await axios.get(quoteEndPoint)
        const quote = resQuote.data.data

        let profileEndPoint = `https://api.stockdata.org/v1/entity/profile?symbols=${symbol}&api_token=${process.env.STOCKDATA_TOKEN}`
        const resProfile = await axios.get(profileEndPoint)
        const profile = resProfile.data.data
        

        let newsEndPoint = `https://api.stockdata.org/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=${process.env.STOCKDATA_TOKEN}`
        
        const resNews = await axios.get(newsEndPoint)
        const news = resNews.data.data

        res.render('company/index.ejs',{message: null, quote: quote, profile: profile, news: news, isWatchList: isInWatchList})

    } catch(err) {
        console.log(err)
        let errDisplay = `Sorry, we cannot pull data for ${req.params.id} at the moment. Please try again later.`
        res.render('company/index.ejs',{message: errDisplay, quote:null})    
    }    
})

router.delete("/:id", async (req,res) => {
    if(res.locals.user){
        try {
            const foundRecord = await db.watchlist.findOne({
                where: {userId: res.locals.user.id,symbol: req.body.symbol}
            })
            await foundRecord.destroy()
            res.redirect(`/company/${req.body.symbol}`)    
        } catch(err) {
            res.render('company/index.ejs', {message: err, quote: nuull, profile: null, news: null, isWatchList: null})    
        }
    }else {
        res.render('./user/login.ejs', {message : 'Your session timed out.'})
    }

})


module.exports= router