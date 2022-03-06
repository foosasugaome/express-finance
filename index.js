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
    if(res.locals.user){
        try {
            const foundWatchlist = await db.watchlist.findAll({
                where: {userId: res.locals.user.id}
            })
            let strSymbols = ""
            for(let i = 0; i < foundWatchlist.length; i++){
                strSymbols += foundWatchlist[i].symbol + ","
            }
            let cardHeader = 'Your watchlist'
            if(strSymbols == "") {
                strSymbols = 'AMZN,MSFT,TSLA,GOOG,V'
                cardHeader = 'Tech Stocks'
            }
            let quotesEndPoint = `https://api.stockdata.org/v1/data/quote?symbols=${strSymbols}&api_token=${process.env.STOCKDATA_TOKEN}`
            let responseQuotes = await axios.get(quotesEndPoint)

            let newsEndPoint = `https://api.stockdata.org/v1/news/all?symbols=${strSymbols}&filter_entities=false&language=en&api_token=${process.env.STOCKDATA_TOKEN}` 
            let responseNews = await axios.get(newsEndPoint)

            let quotes = responseQuotes.data.data
            let news = responseNews.data.data
            const marqueeContent = "test"
            console.log(quotes)
            
            res.render('index.ejs', {message: null, news: news, quotes: quotes, cardHeader: cardHeader})
        }catch (err) {
            console.log(`console.log ${err}` )            
            res.render('index.ejs', {message: `An error has occured. Please contact your administrator.`, news: null, quotes: null})
        }
    }else{        
        let endpoint = `https://api.stockdata.org/v1/news/all?symbols=TSLA%2CAMZN%2CMSFT&filter_entities=true&language=en&api_token=${process.env.STOCKDATA_TOKEN}`
        const guestNews = await axios.get(endpoint)        
        res.render('index.ejs',{message: `Hello Guest!`, news: guestNews.data.data})
    }
})

app.get('/logout', (req,res)=>{
    res.clearCookie('userId')
    res.redirect('/')    
})

app.listen(PORT, err=> {
    if(err) console.log(err)
    console.log(`Server listening to port : ${PORT} 🎧`)

})
