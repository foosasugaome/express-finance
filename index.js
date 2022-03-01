const express = require('express') // import express
const app = express() // create an express instance
const ejsLayouts = require('express-ejs-layouts') // import ejs layouts
require('dotenv').config() // allows us to access env vars
const cookieParser = require('cookie-parser')
const cryptoJS = require('crypto-js')
const db = require('./models/index.js')
const PORT = process.env.PORT || 8000

// MIDDLEWARE
app.set('view engine', 'ejs') 
app.use(ejsLayouts) 
app.use(cookieParser()) 
app.use(express.urlencoded({extended: false})) 
app.use(express.static('public'))
app.use(require('morgan')('dev'));

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
app.use('/news', require('./controllers/news'))
app.use('/lookup', require('./controllers/lookup'))

app.get('/', (req,res)=>{
    res.render('index.ejs')
})

app.get('/logout', (req,res)=>{
    res.clearCookie('userId')
    res.redirect('/')    
})

app.listen(PORT, err=> {
    if(err) console.log(err)
    console.log(`Server listening to port : ${PORT}`)

})
