const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()

router.get('/',(req,res)=> {
    res.render('portfolios/portfolio.ejs',{message: ''})
})

module.exports=router