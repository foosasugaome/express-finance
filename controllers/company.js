const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub')
require('dotenv').config()
const axios = require('axios')
const db = require('../models')

router.get('/:id', (req,res) => {
    res.send(`hello`)
})


module.exports= router