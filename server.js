import express from 'express';
import { Liquid } from 'liquidjs';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views');

const userId = 6;

async function fetchStekjes() {
  const stekjesResponse = await fetch('https://fdnd-agency.directus.app/items/bib_stekjes');
  const stekjesResponseJSON = await stekjesResponse.json();
  return stekjesResponseJSON.data;
}

async function fetchPlaatjes() {
  const plaatjesResponse = await fetch('https://fdnd-agency.directus.app/items/bib_afbeeldingen?filter={%20%22type%22:%20{%20%22_eq%22:%20%22stekjes%22%20}}');
  const plaatjesResponseJSON = await plaatjesResponse.json();
  return plaatjesResponseJSON.data;
}

app.get('/', async (req, res) => {
  const stekjes = await fetchStekjes();
  const plaatjes = await fetchPlaatjes();
  res.render('index.liquid', { stekjes, plaatjes });
});

app.get('/stekjes', async (req, res) => {
  const stekjes = await fetchStekjes();
  const plaatjes = await fetchPlaatjes();
  res.render('stekjes.liquid', { stekjes, plaatjes });
});

app.get('/stekjes/:id', async function (request, response) {
  const stekjeId = request.params.id;
  const stekjeResponse = await fetch(`https://fdnd-agency.directus.app/items/bib_stekjes/${stekjeId}`);
  const stekjeData = await stekjeResponse.json();
  
  response.render('stekjes.liquid', { stekje: stekjeData.data });
  });

app.post('/stekjes/:id', async (req, res) => {
  const stekjeId = req.params.id;
  const userStekje = await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes?filter={"bib_stekjes_id":${stekjeId},"bib_users_id":${userId}}`);
  const userStekjeJSON = await userStekje.json();

  if (userStekjeJSON.data.length) {
    await fetch(`https://fdnd-agency.directus.app/items/bib_users_stekjes/${userStekjeJSON.data[0].id}`, { method: 'DELETE' });
  } else {
    await fetch('https://fdnd-agency.directus.app/items/bib_users_stekjes', {
      method: 'POST',
      body: JSON.stringify({ bib_stekjes_id: stekjeId, bib_users_id: userId }),
      headers: { 'Content-Type': 'application/json' },
    });
  }
  res.redirect(303, '/');
});

app.get('/404', (req, res) => {
  res.render('404.liquid');
});

app.use((req, res) => {
  res.status(404).render('404.liquid');
});

app.set('port', process.env.PORT || 4444);
app.listen(app.get('port'), () => {
  console.log(`App running on http://localhost:${app.get('port')}`);
});
