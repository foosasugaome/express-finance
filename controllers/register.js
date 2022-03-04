const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()

router.get('/',(req,res)=> {
    res.render('users/register.ejs',{message: ''})
})

// pos
router.post('/', async(req, res)=> {
    try {
        const [newUser, created] = await db.user.findOrCreate({
            where: {username: req.body.username,
            email: req.body.email}        
        })
        if(!created){
            console.log('User already exists.')
            res.render('users/register.ejs',{message: 'User already exists.'})
        } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10)
            newUser.password = hashedPassword
            newUser.email = req.body.email
            newUser.username = req.body.username
            newUser.firstname = req.body.firstname
            newUser.lastname  = req.body.lastname
            newUser.status = 'Active'
            await newUser.save()

            //encrypt id (AES)
            const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET_KEY)
            const encryptedUserIdString = encryptedUserId.toString()
            console.log(newUser.id)
            // save to cookie encryptedUserId
            res.cookie('userId',encryptedUserIdString)             
            res.redirect('/')
        }

    } catch(err) {
        console.log(err)
        res.render('users/register.ejs', {message: err})
    }
})

module.exports = router