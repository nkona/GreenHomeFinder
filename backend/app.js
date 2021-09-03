//var createError = require('http-errors');
const cors = require('cors');
const bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var routes = require("./routes.js");


var app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/test', routes.test);
app.get('/county/:county', routes.searchByCounty);
app.get('/filter/:priceLow/:priceHigh/:tempLow/:tempHigh/:tempMonth/:precipLow/:precipHigh/:precipMonth/:aqiLow/:aqiHigh/:aqiParam/:yearLow/:yearHigh', routes.filterCounties);
app.get('/compute/:yearLow/:yearHigh/:tempIdeal/:tempCost/:precipIdeal/:precipCost/:aqiCost', routes.computeAdjusted);

app.get('/aqi-params', routes.airQualityParams);
app.get('/aqi-count', routes.countAqiCategories);
app.get('/detail', routes.countyDetail);
app.get('/rainfall', routes.rainfallDetail);
app.get('/homevalue', routes.homeValue);

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});

module.exports = app;
