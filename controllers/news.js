const { default: axios } = require('axios');
const express = require('express')
const router = express.Router()
require('dotenv').config()
const finnhub = require('finnhub');
require('dotenv').config()
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_TOKEN
const finnhubClient = new finnhub.DefaultApi()


router.get('/', async (req, res) => {
    try  {
        let endpoint = `https://finnhub.io/api/v1/news?category=general&token=${process.env.API_TOKEN}&minId=10`
        const respNews = await axios.get(endpoint)
        res.render('news/news.ejs',{message: null, news: respNews.data})

    } catch(err) {
        res.render('news/news.ejs', {message: err})
    }
})
// router.get('/', async (req, res) => {
//     let categeory = req.query
//     try  {
//         let endpoint = `https://finnhub.io/api/v1/news?category=${category}&token=${process.env.API_TOKEN}`
//         const respNews = await axios.get(endpoint)
//         console.log(endpoint)
//         res.render('news/news.ejs',{message: null, news: respNews.data})
//         console.log(category)

//     } catch(err) {
//         res.send(err)
//         res.render('news/news.ejs', {message: err})
//     }
// })


module.exports = router