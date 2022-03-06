const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')
const db = require('../models')

router.get('/', async (req,res)=> {
    let servMsg = null
    let querySymbol
    if(res.locals.user){        
        try {
            const foundWatchList = await db.watchlist.findAll({
                where: {userId: res.locals.user.id}                                      
            })     
            let strSymbol = ""
            for(let i =0; i<foundWatchList.length; i++) {                
                strSymbol += `${foundWatchList[i].symbol},` 
            }                 
            let stonk = null
            if(strSymbol == "") {
                servMsg = `You have nothing in your watchlist.`
            } else {
                let endPoint = `https://api.stockdata.org/v1/data/quote?symbols=${strSymbol}&api_token=${process.env.STOCKDATA_TOKEN}`                 
                const resQuotes = await axios.get(endPoint)
                stonk = resQuotes.data.data
            }
            
            // console.log(stonk)
            res.render('watchlist/index.ejs', {message: servMsg, watchlist : stonk})                        
        } catch(err) {                        
            console.log(err)
            res.render('watchlist/index.ejs',{message: `Sorry something went wrong. Please contact your administrator.`, watchlist: null})           
        }                
    } else {
        res.render('watchlist/index.ejs',{message: `You need to login to view your watchlist.`, watchlist: null})
    }    
})

// add stock to watchlist
router.get('/addstock', async (req, res) => {
    
    if(res.locals.user){        
        try {
            const [newStock, created] = await db.watchlist.findOrCreate({
                where: {userId: res.locals.user.id,symbol: req.query.symbol}
            })
            if(created){
                newStock.stockname = req.query.name
                newStock.symbol = req.query.symbol                
                newStock.dateadded = Date.now()
                await newStock.save()
            }


            const addStock = await db.usertransaction.create({
                userId: res.locals.user.id,                                
                transdate: Date.now(),
                stockname: req.query.name,
                symbol:req.query.symbol            
            })
            await addStock.save()      
            if(req.query.o=="prof") {
                res.redirect(`/company/${req.query.symbol}`)
            }else {
                res.redirect('/watchlist')
            }                  
        }catch(err) {
            res.render('watchlist/index.ejs', {message: err, watchlist: null})    
        }        
    }else{
        res.render('./users/login.ejs', {message : 'Your session timed out.'})
    }   
})

router.delete("/:id", async (req,res) => {
    if(res.locals.user){
        try {
            const foundRecord = await db.watchlist.findOne({
                where: {userId: res.locals.user.id,symbol: req.body.symbol}
            })
            await foundRecord.destroy()
            res.redirect('/watchlist')    
        } catch(err) {
            res.render('watchlist/index.ejs', {message: err, watchlist: null})    
        }
    }else {
        res.render('./user/login.ejs', {message : 'Your session timed out.'})
    }

})

module.exports = router