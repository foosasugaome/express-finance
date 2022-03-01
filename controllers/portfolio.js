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
            res.render('portfolios/portfolio.ejs',{message: servMsg})           
        }                
    } else {
        res.render('portfolios/portfolio.ejs',{message: `You need to login to create a new portfolio.`})
    }    
})

router.get('/to', async (req,res)=> {
    let strSymbol = req.query.symbol
    
    if(res.locals.user) {
        try {            
            const listPortfolio = await db.portfolio.findAll({
                where: {userId: res.locals.user.id}
            })
            console.log('i am here')
            res.render('portfolios/select.ejs',{message: servMsg, symbol: strSymbol, portfolio: listPortfolio})
        } catch(err) {
            res.render('portfolios/select.ejs',{message: err})
        }
    } else {
        res.render('./users/login.ejs', {message : 'Your session timed out.'})
    }
})

router.get('/details/:id', (req,res)=>{
    
    res.render('portfolios/details.ejs', {message : 'hello'})
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