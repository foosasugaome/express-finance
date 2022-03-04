const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')
const db = require('../models')
const { response } = require('express')

router.get('/', async (req,res)=> {
    let servMsg = null
    let querySymbol
    if(res.locals.user){        
        try {
            const foundWatchList = await db.watchlist.findAll({
                where: {userId: res.locals.user.id}                                      
            })     
            console.log(foundWatchList.length)
            const stonk = {}
            stonk.watchlist = 'Watchlist'
            const arrayWatchlist = [] 
            for(let i =0; i<foundWatchList.length; i++) {
                myObj = {}                
                querySymbol = foundWatchList[i].symbol
                let endPoint = `https://finnhub.io/api/v1/quote?symbol=${querySymbol}&token=${process.env.SANDBOX_API_TOKEN}`
                const apiFetch = await axios.get(endPoint)            
                myObj.symbol = foundWatchList[i].symbol
                myObj.name = foundWatchList[i].stockname
                myObj.quotes=apiFetch.data
                arrayWatchlist.push(myObj)     
            }                      
            stonk.stonks= arrayWatchlist                 
                    
            res.render('watchlist/index.ejs', {message: servMsg, watchlist : stonk})            
            
        } catch(err) {            
            // console.log(err)
            res.render('watchlist/index.ejs',{message: err, watchlist: null})           
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
            res.redirect('/watchlist')
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