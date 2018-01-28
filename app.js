const express = require('express')
const app = express()

var config = require('./config.json');

const pg = require('pg');
var conString = "pg://" + config.username + ":" + config.password + "@postgresql-test.cx31dnxxuh63.us-east-2.rds.amazonaws.com:5432/" + config.dbname;
var client = new pg.Client(conString);
client.connect();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3000, function () {
  console.log('Its alive! Waterhackathon app running!');
})

