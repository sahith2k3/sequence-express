const express = require('express');
const path = require('path')
const fs = require('fs');


const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

var users = 6;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  const boardData = JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
  res.render('index', { boardData, users });
});

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})


