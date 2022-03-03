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

router.get('/details/:id', async (req,res)=>{
    try 
        {
            const foundPortfolio = await db.portfolio.findOne({
            where: {id: req.params.id},
            include: [db.portfoliodetail,db.usertransaction]            
        })        
        // console.log(foundPortfolio) 
        const objPortfolio = foundPortfolio.dataValues    
        const stonk = {}
        stonk.portfolioname = objPortfolio.portfolioname
        const arrayPortfolio = [] 
        for(let i =0; i< objPortfolio.portfoliodetails.length; i++){
            let myObj = {}
            let querySymbol = objPortfolio.portfoliodetails[i].dataValues.symbol
            // let endPoint = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${querySymbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
            let endPoint = `https://finnhub.io/api/v1/quote?symbol=${querySymbol}&token=${process.env.SANDBOX_API_TOKEN}`
            const apiFetch = await axios.get(endPoint)            
            myObj.symbol=objPortfolio.portfoliodetails[i].dataValues.symbol
            myObj.stonkName=objPortfolio.portfoliodetails[i].dataValues.stockname                  
            myObj.quotes=apiFetch.data

            let qty = 0
            let count = 0
            let cost = 0    
            for(let j = 0; j < objPortfolio.usertransactions.length;j++) {
                if(objPortfolio.usertransactions[j].symbol == objPortfolio.portfoliodetails[i].dataValues.symbol)  {
                    count+=1
                    if(objPortfolio.usertransactions[j].transtype == 'Buy') {
                        
                        cost += parseFloat(objPortfolio.usertransactions[j].price)
                        console.log(objPortfolio.usertransactions[j].symbol + ' | ' + cost)
                    }
                    qty += objPortfolio.usertransactions[j].quantity                   
                }  
            }
            myObj.averageCost = cost/count
            myObj.qty = qty
            arrayPortfolio.push(myObj)                 
        }        
        stonk.stonks=arrayPortfolio             
        // res.send(stonks)                  
        res.render('watchlist/details.ejs',{message: null, portfolio: stonk})
    } catch(err) {        
        res.render('watchlist/details.ejs',{message:err , portfolio: null})
    }    
})

router.get('/add', (req,res)=> {
    let servMsg = null
    if(res.locals.user){
        res.render('watchlist/add.ejs',{message: servMsg})    
    } else {
        servMsg = `You need to login to create a new portfolio.`
        res.render('watchlist/add.ejs',{message: servMsg})
    }    
})

router.post('/add', async (req,res)=> {
    if(res.locals.user){

        try {
            const [newPortfolio, created] = await db.portfolio.findOrCreate({
                where: {portfolioname: req.body.portfolio}        
            })
            if(!created){
                console.log('Portfolio already exists.')
                res.render('watchlist/add.ejs',{message: 'Portfolio already exists.'})
            } else {
                console.log(res.locals.user.id)
                newPortfolio.userId = res.locals.user.id
                newPortfolio.portfolioname = req.body.portfolio
                newPortfolio.dateadded = Date.now()
                await newPortfolio.save()
    
                // //encrypt id (AES)
                // const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET_KEY)
                // const encryptedUserIdString = encryptedUserId.toString()
    
                // // save to cookie encryptedUserId
                // res.cookie('userId',encryptedUserIdString)             
                res.redirect('/portfolio')
            }
        } catch(err) {
            res.render('watchlist/add.ejs', {message: err})
        }
    } else {
        res.render('watchlist/add.ejs',{message: `You need to login to create a new portfolio.`})
    }    
})

module.exports = router