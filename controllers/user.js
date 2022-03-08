const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
require('dotenv').config()
const axios = require('axios')

router.get('/', async(req,res) =>{
    if(res.locals.user) {
        try {

            const foundUser = await db.user.findOne({
                where: {id: res.locals.user.id}
            })            
            // console.log(foundUser.dataValues)
            res.render('users/details.ejs',{message: null, userDetails: foundUser.dataValues})    
        } catch(err) {
            console.log(err)
            res.render('users/details.ejs', {message : `Sorry, something went wrong. Please try again later.`, userDetails: null})
        }
    } else {
        res.render('./users/login.ejs', {message : 'Your session timed out.'})
    }
})
router.put('/', async(req, res) => {
    try {
        const [foundUser , created]= await db.user.findOrCreate({
            where: {id: res.locals.user.id}                        
        })
        if(created) {

        } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        foundUser.set({
            firstname : req.body.firstname,            
            password : hashedPassword,
            email : req.body.email,
            username : req.body.username,
            firstname : req.body.firstname,
            lastname  : req.body.lastname,
            status : 'Active'            
        })
        await foundUser.save()
        // console.log(foundUser)
        }        
        res.render('users/details.ejs',{message: `Account updated.`, userDetails: foundUser.dataValues})    
    } catch(err) {
        console.log(err)
        res.render('users/details.ejs', {message : `Sorry, something went wrong. Please try again later.`, userDetails: null})
    }
})

module.exports = router