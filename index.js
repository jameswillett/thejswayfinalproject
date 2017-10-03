
const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'James',
  host: 'localhost',
  database: 'socialnews'
})

app.use(express.static('public'));

app.post("/deletelink", jsonParser, (request, response) => {
  pool.query('delete from links where id=$1',[request.body.index])
  response.json(request.body.index);
})

app.get("/getlinks", (request,response) => {
  pool.query('select * from links', (err, links) => {
    if (err){
      console.log(err)
    }

    response.json(links.rows);
  })
})

app.post("/addlinks", jsonParser, (request,response) => {

  pool.query('insert into links (author, title, url) values ($1, $2, $3)',[request.body.author, request.body.title, request.body.url], (err, links) => {

    if (err){
      console.log(err)
    }
    response.json({});
  })

})

app.post("/favorite", jsonParser, (request, response) => {
  pool.query('select favorite from links where id=$1',[request.body.index], (err, link) => {
    const { favorite } = link.rows[0];
    pool.query('update links set favorite=$1 where id=$2',[!favorite, request.body.index], (err, updatedLink) => {
      response.json({favorite: !favorite});
    })
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
