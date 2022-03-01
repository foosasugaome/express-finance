// from lookup.js
// router.get('/', async (req, res) => {
//     try  {
//         let endpoint = `https://finnhub.io/api/v1/news?category=general&token=${process.env.API_TOKEN}&minId=10`
//         const respNews = await axios.get(endpoint)
//         res.render('news/news.ejs',{message: null, news: respNews.data})

//     } catch(err) {
//         res.render('news/news.ejs', {message: err})
//     }
// })
// router.get('/:id', async (req, res) => {
//     let categeory = req.params.id
//     try  {
//         let endpoint = `https://finnhub.io/api/v1/news?category=${category}&token=${process.env.API_TOKEN}&minId=10`
//         const respNews = await axios.get(endpoint)
//         res.render('news/news.ejs',{message: null, news: respNews.data})

//     } catch(err) {
//         res.render('news/news.ejs', {message: err})
//     }
// })

// -------------------------------