// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://redpers.nl/wp-json/wp/v2'

// Directus link
const apiDirectus = 'https://fdnd-agency.directus.app/items/redpers_shares'

// https://github.com/ju5tu5/the-web-is-for-everyone-interactive-functionality

//Methode: post
//Params --> aangevraagde slug
//Gebruik een form voor de post data

// Haal alle variabelen op die je wil maken.
const apiPosts = apiUrl + '/posts'
const apiUsers = apiUrl + '/users'
const apiCategories = apiUrl + '/categories'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

// Maak een GET route voor de index (home)
app.get('/', function (_request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson(apiPosts).then((apiData) => {
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    response.render('home.ejs', {articles: apiData,messages:messages})
  })
})

const messages=[]
// Maak een POST route voor de index (home)
app.post('/', function (request, response) {
  messages.push(request.body.messages)
  console.log(JSON.stringify(messages))
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})







// import express from 'express'
// import fetchJson from './helpers/fetch-json.js'

// // It's an array of objects containing slug and like#, eg. [{ slug: 'a', likes: 42}]
// let likes = []
// const redpers_url = 'https://redpers.nl/wp-json/wp/v2/posts'
// const directus_url = 'https://fdnd-agency.directus.app/items/redpers_shares'

// const app = express()
// app.set('view engine', 'ejs')
// @@ -12,37 +12,47 @@ app.use(express.static('public'))
// app.use(express.urlencoded({ extended: true }))

// app.get('/', (request, response) => {
//   fetchJson('https://redpers.nl/wp-json/wp/v2/posts').then((data) => {
//     fetchJson('https://fdnd-agency.directus.app/items/redpers_shares').then((share_data) => {
//       response.render('index', { articles: data, shares: share_data.data })
//   fetchJson(redpers_url).then((data) => {
//     fetchJson(directus_url).then((shares) => {
//       // Map de data array uit wordpress, map is een soort 'loop' structuur voor arrays
//       data.map((article) =>
//         // Gebruik de Object.assign() functie om het aantal shares toe te voegen op het article
//         // NB: Object.assign past het 'article' object
//         Object.assign(article, {
//           // Zoek in shares naar article.slug, koppel het aantal shares of 0 als het niet bestaat
//           shares: shares.data.find(({ slug }) => slug == article.slug)?.shares || 0,
//         })
//       )
//       response.render('index', { articles: data })
//     })
//   })
// })

// app.post('/article/:slug', (request, response) => {
//   // Zoek in de array de likes voor het huidige artikel
//   let huidig = likes.find((like) => {
//     return like.slug == request.params.slug
//   })
// // Failsafe voor als iemand /article intypt zonder slug...
// app.get('/article', (request, response) => {
//   response.redirect(301, '/')
// })

//   // Als het huidige artikel nog niet bestaat maken we likes aan
//   if (huidig == undefined) {
//     likes.push({
//       slug: request.params.slug,
//       likes: 1,
// app.post('/article/:slug', (request, response) => {
//   fetchJson(`${directus_url}?filter[slug][_eq]=${request.params.slug}`).then(({ data }) => {
//     // Doe een PATCH op directus, stuur de id mee als die er is.
//     fetchJson(`${directus_url}/${data[0]?.id ? data[0].id : ''}`, {
//       method: data[0]?.id ? 'PATCH' : 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         slug: request.params.slug,
//         shares: data.length > 0 ? data[0].shares + 1 : 1,
//       }),
//     }).then((result) => {
//       console.log(result)
//     })
//     // Als het al wel bestaat tellen we er een like bij op
//   } else {
//     huidig.likes++
//   }
//   })
//   response.redirect(301, `/article/${request.params.slug}`)
// })

// app.get('/article/:slug', (request, response) => {
//   fetchJson(`https://redpers.nl/wp-json/wp/v2/posts/?slug=${request.params.slug}`).then((data) => {
//     // Zoek naar de likes voor deze slug en voeg ze toe aan de opgehaalde API data
//     let current_likes = likes.find((like) => like.slug == request.params.slug)
//     data[0].likes = current_likes?.likes || 0
//   fetchJson(`${redpers_url}?slug=${request.params.slug}`).then((data) => {
//     // fetch de #shares
//     response.render('article', { article: data[0] })
//   })
// })





app.get('/artikel/:slug', function (request, response) {
  // --> dit zijn routes (home, article, category)
 
  // Hier haal je de url op en maak je er een Json file van ipv een link. Waarna het wordt vernoemd naar apiData
  fetchJson(apiPosts + '?slug=' + request.params.slug).then((apiData) => {
 
      // Deze info wordt daarna
      // meegegeven aan de toegewezen EJS
      response.render('article.ejs', {article: apiData[0]
        // .data is belangrijk om er bij te schrijven
        // alle id's zijn een soort van mappen, en door .data te schrijven ga je eigenlijk een map 'dieper'
    })
      // console.log(apiData)
  })
})

// Stap 4 | Het maken van categorieeen in routes
const categoryRoutes = [
  'binnenland',
  'buitenland',
  'column',
  'economie',
  'kunst & media',
  'podcast',
  'politiek',
  'wetenschap'
]
//  https://redpers.nl/wp-json/wp/v2/posts?filter=[articleSection]=%22binnenland%22
categoryRoutes.forEach(category => {
  app.get("/" + category, function (request, response) {
      fetchJson(apiCategories + "?filter=" + category).then((categoryApi) => {

        // Kijken of alle goede dat is binnengekomen
        // console.log(categoryApi)

        response.render('category.ejs')
    });
  });
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 1000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})