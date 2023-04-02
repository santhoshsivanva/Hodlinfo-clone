const express = require('express');
const path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config()

const { PgDb, insert, select, truncate } = require('./config/db');

//Initialize
const port = process.env.PORTHTTP;
const app = express();

// middleware for PostgreSQL server
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
db = new PgDb();

//wazirX API
const connect = () => {
    fetch('https://api.wazirx.com/api/v2/tickers')
        .then(res => res.json())
        .then(data => {
            const records = Object.values(data).slice(0, 10);
            id = 1;
            records.forEach(record => {
                const { name, last, buy, sell, volume, base_unit } = record;
                bs = `${buy}/${sell}`
                insert(db.Client, id, name, last, bs, volume, base_unit);
                id += 1;
            })
        })
        .catch(err => console.error(err))
}

app.get("/", async function (req, res) {
    // connect();
    select(db.Client).then(function (rs) {
        res.render('home', { title: "QuadB", number: "5", responce: rs });
    }).catch(function (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    })
});



app.listen(port, (err) => {
    if (err) {
        console.log("Error in running server");
        return;
    }
    console.log('listening on port', port);
});
