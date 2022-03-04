const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config() // allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
const db = require('./models/index.js')
const PORT = process.env.PORT || 8000
const axios = require('axios')
const methodOverride = require("method-override");

// MIDDLEWARE
app.set('view engine', 'ejs') 
app.use(ejsLayouts) 
app.use(cookieParser()) 
app.use(express.urlencoded({extended: false})) 
app.use(express.static('public'))
app.use(require('morgan')('dev'));
app.use(methodOverride("_method"));

// CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next)=>{
    if(req.cookies.userId){
        // decrypting the incoming user id from the cookie
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET_KEY)
        // converting the decrypted id into a readable string
        const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8)
        // querying the db for the user with that id
        const user = await db.user.findByPk(decryptedIdString)
        // assigning the found user to res.locals.user in the routes, and user in the ejs
        res.locals.user = user
    } else res.locals.user = null
    next() // move on to next middleware
})

app.use('/register', require('./controllers/register'))
app.use('/login', require('./controllers/login'))
app.use('/portfolio', require('./controllers/portfolio'))
app.use('/watchlist', require('./controllers/watchlist'))
app.use('/news', require('./controllers/news'))
app.use('/lookup', require('./controllers/lookup'))
app.use('/company',require('./controllers/company'))

app.get('/', async (req,res)=>{
    let servMsg = null
    let querySymbol
    if(res.locals.user){        
        try {
            const foundWatchList = await db.watchlist.findAll({
                where: {userId: res.locals.user.id}                                      
            })                 
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
            
            //get related news
            const objNews = {}
            const newsArray = []
            const endDate = new Date()
            const startDate = new Date(endDate)
            startDate.setDate(startDate.getDate()-1)
            let formStartDate = startDate.toISOString().split('T')[0]
            let formEndDate = endDate.toISOString().split('T')[0]            
            for(let j = 0; j< stonk.stonks.length;j++) {            
                let newsEndPoint = `https://finnhub.io/api/v1/company-news?symbol=${stonk.stonks[j].symbol}&from=${formStartDate}&to=${formEndDate}&token=${process.env.API_TOKEN}`
                const apiFetchNews = await axios.get(newsEndPoint)
                newsArray.push(apiFetchNews.data)                               
            }
            objNews.title = 'News'
            objNews.news =newsArray
            
            console.log(objNews.news[0][0])       
            // res.send(objNews.news)
            res.render('index.ejs', {message: null, w : stonk,n:objNews.news})            
            
        } catch(err) {            
            
            res.render('index.ejs',{message: err, w: null,n: null})           
        }
    } else {
        let endpoint = `https://finnhub.io/api/v1/news?category=general&token=${process.env.API_TOKEN}&minId=10`
        const guestNews = await axios.get(endpoint)
        res.render('index.ejs',{message: `Hello Guest!`, news:guestNews.data})
    }    
})

app.get('/logout', (req,res)=>{
    res.clearCookie('userId')
    res.redirect('/')    
})

app.listen(PORT, err=> {
    if(err) console.log(err)
    console.log(`Server listening to port : ${PORT}`)

})
