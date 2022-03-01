const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()

router.get('/',(req,res)=> {
    try {        
        res.render('users/login.ejs',{message: null})
    } catch(err) {
        res.render('users/login.ejs',{message: err})
    }    
})

router.post('/', async (req, res)=>{
    const user = await db.user.findOne({where: {username: req.body.username}})
    if(!user) { // didn't find user in the database
        console.log('user not found!')
        res.render('users/login.ejs', {message: 'Invalid email/password'})
    } else if(!bcrypt.compareSync(req.body.password, user.password)) { // found user but password was wrong 
        console.log('Incorrect Password')
        res.render('users/login.ejs', {error: 'Invalid email/password'})
    } else {

        console.log('logging in the user!')
        
        const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        console.log(encryptedUserIdString)
        
        res.cookie('userId', encryptedUserIdString)        
        res.redirect('/')
    }
 })



module.exports = router