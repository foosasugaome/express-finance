const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')
const db = require('../models')
const res = require('express/lib/response')




router.get('/', async (req,res)=> {
    let servMsg = null
    if(res.locals.user){        
        try {
            const foundPortfolio = await db.portfolio.findAll({
                where: {userId: res.locals.user.id}                                      
            })           
            res.render('portfolios/portfolio.ejs', {message: servMsg, portfolio : foundPortfolio})            
        } catch(err) {            
            // console.log(err)
            res.render('portfolios/portfolio.ejs',{message: servMsg, portfolio: null})           
        }                
    } else {
        res.render('portfolios/portfolio.ejs',{message: `You need to login to create a new portfolio.`, portfolio: null})
    }    
})

// grab portfolio list then render add stock to portfolio form
router.get('/to', async (req,res)=> {
    let stockSymbol = req.query.symbol
    let stockName = req.query.name
    let servMsg = null
    if(res.locals.user) {
        try {            
            const listPortfolio = await db.portfolio.findAll({
                where: {userId: res.locals.user.id}
            })
            console.log(res.locals.user.id)
            res.render('portfolios/addstock.ejs',{message: servMsg, symbol: [stockSymbol,stockName], portfolio: listPortfolio})
        } catch(err) {
            res.render('portfolios/addstock.ejs',{message: err, portfolio: null})
        }
    } else {
        res.render('./users/login.ejs', {message : 'Your session timed out.'})
    }
})

// add stock to portfolio
router.post('/add_stock', async (req, res) => {
    if(res.locals.user){
        // let formValues = req.body.portfolioid + req.body.quantity + req.body.price + req.body.transtype    
        let qty = parseInt(req.body.quantity)
        let price = parseInt(req.body.price)
        if(req.body.transtype=="Sell"){
            qty *= -1            
        }
        try {
            const [newStock, created] = await db.portfoliodetail.findOrCreate({
                where: {portfolioId: req.body.portfolioid,symbol: req.query.symbol}
            })
            if(created){
                newStock.stockname = req.query.name
                newStock.symbol = req.query.symbol
                newStock.portfolioId = req.body.portfolioid
                newStock.dateadded = Date.now()
                await newStock.save()
            }


            const addStock = await db.usertransaction.create({
                userId: res.locals.user.id,
                portfolioId: req.body.portfolioid,
                portfoliodetailsId: req.body.portfolioid,
                transdate: Date.now(),
                symbol:req.query.symbol,
                transtype: req.body.transtype,            
                quantity: qty,
                price: price
            })
            await addStock.save()
            res.redirect('/portfolio')
        }catch(err) {
            res.render('portfolios/addstock.ejs', {message: err, portfolio: null})    
        }
        res.render('portfolios/addstock.ejs', {message: null, portfolio: null})
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
            for(let j = 0; j < objPortfolio.usertransactions.length;j++) {
                if(objPortfolio.usertransactions[j].symbol == objPortfolio.portfoliodetails[i].dataValues.symbol)  {
                    qty += objPortfolio.usertransactions[j].quantity                   
                }  
            }
            myObj.qty = qty
            arrayPortfolio.push(myObj)                 
        }        
        stonk.stonks=arrayPortfolio                               
        res.render('portfolios/details.ejs',{message: null, portfolio: stonk})
    } catch(err) {
        res.render('portfolios/details.ejs',{message:err , portfolio: null})
    }    
})

router.get('/add', (req,res)=> {
    let servMsg = null
    if(res.locals.user){
        res.render('portfolios/add.ejs',{message: servMsg})    
    } else {
        servMsg = `You need to login to create a new portfolio.`
        res.render('portfolios/add.ejs',{message: servMsg})
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
                res.render('portfolios/add.ejs',{message: 'Portfolio already exists.'})
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
            res.render('portfolios/add.ejs', {message: err})
        }
    } else {
        res.render('portfolios/add.ejs',{message: `You need to login to create a new portfolio.`})
    }    
})

module.exports = router