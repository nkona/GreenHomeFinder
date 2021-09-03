


var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : "environmentaldatabase.crdek73dx3jf.us-east-1.rds.amazonaws.com",
  user     : "admin",
  password : "cis550project",
  port     : "1521",
  database: "EnvironmentalDatabase",
  multipleStatements: true,
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database');
});

function test(req, res) {
  var query = 'SELECT * FROM County LIMIT 12';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function searchByCounty(req, res) {
  var county_name = req.params.county;

  if (county_name && county_name != "all") {
    console.log("MADE IT HERE");
    var query = `
    SELECT c.state_name, c.county_name, date, COUNT(a.aqi) AS aqi_count FROM AirQuality a JOIN County c ON a.state_fips=c.state_fips AND a.county_fips=c.county_fips
    WHERE c.county_name LIKE '%${county_name}%' OR c.state_name LIKE '%${county_name}%'
    GROUP BY c.state_fips, c.county_fips;
    `
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  } else {
    var query = `
    SELECT c.state_name, c.county_name, date, COUNT(a.aqi) AS aqi_count FROM AirQuality a JOIN County c ON a.state_fips=c.state_fips AND a.county_fips=c.county_fips
    GROUP BY c.state_fips, c.county_fips;
    `
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
    });
  }
}

async function fetchAirQualityParameters(req, res) {
  res.json([
    {
      parameter: 'PM2.5'
    },
    {
      parameter: 'Ozone'
    }
  ]);
}

async function countyDetail(req, res) {
  const state_name = req.query.state;
  const county_name = req.query.county;
  const parameter = req.query.parameter;

  if (state_name && county_name && parameter) {
    var us_avg_query = `
    WITH Dates AS (
      SELECT DISTINCT date AS d
      FROM County c 
        JOIN AirQuality a 
        ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips
      WHERE state_name='${state_name}' 
        AND county_name='${county_name}' 
        AND parameter='${parameter}' 
      GROUP BY date
    )
    SELECT AVG(aqi) AS aqi, date FROM County c 
    JOIN AirQuality a ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips
    JOIN Dates ON Dates.d = date 
    WHERE parameter='${parameter}' GROUP BY date;
    `;

    var state_avg_query = `
    WITH Dates AS (
      SELECT DISTINCT date AS d
      FROM County c 
        JOIN AirQuality a 
        ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips
      WHERE state_name='${state_name}' 
        AND county_name='${county_name}' 
        AND parameter='${parameter}' 
      GROUP BY date
    )
    SELECT AVG(aqi) AS aqi, date AS date FROM County c 
    JOIN AirQuality a ON c.state_fips = a.state_fips 
      AND c.county_fips = a.county_fips
    JOIN Dates ON Dates.d = date 
    WHERE state_name='${state_name}' AND parameter='${parameter}' GROUP BY date;
    `;

    var county_avg_query = `
    WITH Dates AS (
      SELECT DISTINCT date AS d
      FROM County c 
        JOIN AirQuality a 
        ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips
      WHERE state_name='${state_name}' 
        AND county_name='${county_name}' 
        AND parameter='${parameter}' 
      GROUP BY date
    )
    SELECT AVG(aqi) AS aqi, date AS date FROM County c 
    JOIN AirQuality a ON c.state_fips = a.state_fips 
      AND c.county_fips = a.county_fips
    JOIN Dates ON Dates.d = date 
    WHERE state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}' GROUP BY date;
    `;

    var full_query = us_avg_query + state_avg_query + county_avg_query;

    connection.query(full_query, function(err, results) {
      if (err) console.log(err);
      else {
        res.json(results);
      }
    });
  } else {
    console.log("Invalid county/state name.");
  }
}

async function countAqiCategories(req, res) {
  const state_name = req.query.state;
  const county_name = req.query.county;
  const parameter = req.query.parameter;

  if (state_name && county_name && parameter) {
    var good_query = `
    SELECT COUNT(*) AS count FROM County c JOIN AirQuality a 
      ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips 
    WHERE 
      a.category="Good"
      AND state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}'; 
    `;

    var moderate_query = `
    SELECT COUNT(*) AS count FROM County c JOIN AirQuality a 
      ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips 
    WHERE 
      a.category="Moderate"
      AND state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}'; 
    `;

    var unhealthy_for_sensitive_query = `
    SELECT COUNT(*) AS count FROM County c JOIN AirQuality a 
      ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips 
    WHERE 
      a.category="Unhealthy for Sensitive Groups"
      AND state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}'; 
    `;

    var unhealthy_query = `
    SELECT COUNT(*) AS count FROM County c JOIN AirQuality a 
      ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips 
    WHERE 
      a.category="Unhealthy"
      AND state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}'; 
    `;

    var very_unhealthy_query = `
    SELECT COUNT(*) AS count FROM County c JOIN AirQuality a 
      ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips 
    WHERE 
      a.category="Very Unhealthy"
      AND state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}'; 
    `;

    var hazardous_query = `
    SELECT COUNT(*) AS count FROM County c JOIN AirQuality a 
      ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips 
    WHERE 
      a.category="Hazardous"
      AND state_name='${state_name}' AND county_name='${county_name}' AND parameter='${parameter}'; 
    `;

    const full_query = good_query + moderate_query + unhealthy_for_sensitive_query + unhealthy_query + very_unhealthy_query + hazardous_query;

    connection.query(full_query, function(err, results) {
      if (err) console.log(err);
      else {
        res.json([
          {
            name: 'Good',
            value: results[0][0].count,
          },
          {
            name: 'Moderate',
            value: results[1][0].count,
          },
          {
            name: 'Unhealthy for Sensitive Groups',
            value: results[2][0].count,
          },
          {
            name: 'Unhealthy',
            value: results[3][0].count,
          },
          {
            name: 'Very Unhealthy',
            value: results[4][0].count,
          },
          {
            name: 'Hazardous',
            value: results[5][0].count,
          }
        ]);
      }
    });
  } else {
    console.log("Invalid county/state name.");
  }
}

async function rainfallDetail(req, res) {

  const state_name = req.query.state;
  const county_name = req.query.county;

  console.log(state_name);
  console.log(county_name);

  if (state_name && county_name) {
    var us_avg_query_rainfall = `
    SELECT AVG(precipitation) AS precipitation, month AS date FROM County c 
    JOIN Weather w ON c.state_fips = w.state_fips AND c.county_fips = w.county_fips 
    WHERE year = 2019
    GROUP BY month; 
    `

    var state_avg_query_rainfall = `
    SELECT AVG(precipitation) AS precipitation, month AS date 
    FROM County c 
    JOIN Weather w ON c.state_fips = w.state_fips 
      AND c.county_fips = w.county_fips 
    WHERE state_name='${state_name}' AND year = 2019 GROUP BY month;
    `

    var county_avg_query_rainfall  = `
    SELECT AVG(precipitation) AS precipitation, month AS date 
    FROM County c 
    JOIN Weather w  ON c.state_fips = w.state_fips 
      AND c.county_fips = w.county_fips 
    WHERE state_name='${state_name}' AND county_name='${county_name}' AND year = 2019 GROUP BY month;
    `

    var full_query =us_avg_query_rainfall + state_avg_query_rainfall + county_avg_query_rainfall ;

    connection.query(full_query, function(err, results) {
      if (err) console.log(err);
      else {
        res.json(results);
      }
    });
  } else {
    console.log("Invalid county/state name.")
  }
}

async function homeValue(req, res) {

  const state_name = req.query.state;
  const county_name = req.query.county;

  console.log(state_name);
  console.log(county_name);

  if (state_name && county_name) {
    var us_avg_query_homevalue = `
    SELECT AVG(home_value) AS home_value, year AS date FROM County c 
    JOIN HomeValue h ON c.state_fips = h.state_fips AND c.county_fips = h.county_fips 
    GROUP BY year; 
    `

    var state_avg_query_homevalue = `
    SELECT AVG(home_value) AS home_value, year AS date 
    FROM County c 
    JOIN HomeValue h ON c.state_fips = h.state_fips 
      AND c.county_fips = h.county_fips 
    WHERE state_name='${state_name}'  GROUP BY year;
    `

    var county_avg_query_homevalue  = `
    SELECT AVG(home_value) AS home_value, year AS date 
    FROM County c 
    JOIN HomeValue h  ON c.state_fips = h.state_fips 
      AND c.county_fips = h.county_fips 
    WHERE state_name='${state_name}' AND county_name='${county_name}'  GROUP BY year;
    `

    var full_query =us_avg_query_homevalue + state_avg_query_homevalue+ county_avg_query_homevalue ;

    connection.query(full_query, function(err, results) {
      if (err) console.log(err);
      else {
        res.json(results);
      }
    });
  } else {
    console.log("Invalid county/state name.")
  }
}

function filterCounties(req, res) {
  var priceLow = req.params.priceLow;
  var priceHigh = req.params.priceHigh;
  var tempLow = req.params.tempLow;
  var tempHigh = req.params.tempHigh;
  var tempMonth = req.params.tempMonth;
  var precipLow = req.params.precipLow;
  var precipHigh = req.params.precipHigh;
  var precipMonth = req.params.precipMonth;
  var aqiLow = req.params.aqiLow;
  var aqiHigh = req.params.aqiHigh;
  var aqiParam = req.params.aqiParam;
  var yearLow = req.params.yearLow;
  var yearHigh = req.params.yearHigh;

//   var price = [0, 2000];
// var temp = [-40, 100];
// var tempMonth = "all";
// var precip = [0, 60];
// var precipMonth = "all";
// var aqiParam = "PM2.5";
// var aqi = [0, 4000];
// var year = [1895, 2020];
  console.log(priceLow + "here" + priceHigh);

  // filter air quality
  var queryAQIParam = `
  SELECT county_fips, state_fips, aqi
  FROM AirQuality
  WHERE parameter = '` + aqiParam + `'
  `;

//  var queryAQIRange = "";
//  if (aqiLow != 0 || aqiHigh != 4000) {
   var queryAQIRange = `
    SELECT county_fips, state_fips, AVG(aqi) AS aqi
    FROM aqiFilter1
    GROUP BY county_fips, state_fips
    HAVING AVG(aqi) >= ` + aqiLow + ` AND AVG(aqi) <= ` + aqiHigh + `
    `;
//  }

  //filter weather temperature by month and year
  var queryTempSeason = "";
  var start;
  var end;
  if (tempMonth != "all") {
    if (tempMonth == "Q1") {
      start = 1;
      end = 3;
    } else if (tempMonth == "Q2") {
      start = 4;
      end = 6;
    } else if (tempMonth == "Q3") {
      start = 7;
      end = 9;
    } else {
      start = 10;
      end = 12;
    }
    queryTempSeason = `
    SELECT county_fips, state_fips, temperature
    FROM Weather
    WHERE month >= ` + start + ` AND month <= ` + end + ` AND year >= ` + yearLow + ` AND year <= ` + yearHigh + `
    `;
  } else {
    queryTempSeason = `
    SELECT county_fips, state_fips, temperature
    FROM Weather
    WHERE year >= ` + yearLow + ` AND year <= ` + yearHigh + `
    `;
  }

  //filter weather temperature by value (after filtering by date)
//  var queryTempRange = "";
 // if (tempLow != -40 || tempHigh != 100) {
   var queryTempRange = `
    SELECT county_fips, state_fips, AVG(temperature) AS temperature
    FROM tempFilter1
    GROUP BY county_fips, state_fips
    HAVING AVG(temperature) >= ` + tempLow + ` AND AVG(temperature) <= ` + tempHigh + `
    `;
//

    //filter weather precipitation by month and year
    var queryPrecipSeason = "";
    var start;
    var end;
    if (precipMonth != "all") {
      if (precipMonth == "Q1") {
        start = 1;
        end = 3;
      } else if (precipMonth == "Q2") {
        start = 4;
        end = 6;
      } else if (precipMonth == "Q3") {
        start = 7;
        end = 9;
      } else {
        start = 10;
        end = 12;
      }
      queryPrecipSeason = `
      SELECT county_fips, state_fips, precipitation
      FROM Weather
      WHERE month >= ` + start + ` AND month <= ` + end + ` AND year >= ` + yearLow + ` AND year <= ` + yearHigh + `
      `;
    } else {
      queryPrecipSeason = `
      SELECT county_fips, state_fips, precipitation
      FROM Weather
      WHERE year >= ` + yearLow + ` AND year <= ` + yearHigh + `
      `;
    }

      //filter weather precip by value (after filtering by date)
 // var queryPrecipRange = "";
  //if (precipLow != 0 || precipHigh != 60) {
   var queryPrecipRange = `
    SELECT county_fips, state_fips, AVG(precipitation) AS precipitation
    FROM precipFilter1
    GROUP BY county_fips, state_fips
    HAVING AVG(precipitation) >= ` + precipLow + ` AND AVG(precipitation) <= ` + precipHigh + `
    `;
 // }

    //filter housing by year
 // var queryHouseYear = "";
  //if (yearLow != 1895 || yearHigh != 2020) {
  var queryHouseYear = `
    SELECT county_fips, state_fips, home_value
    FROM HomeValue
    WHERE year >= ` + yearLow + ` AND year <= ` + yearHigh + `
    `;
 // }
  //filter housing by price
 // var queryHouseRange = "";
 // if (priceLow != 0 || priceHigh != 2000000) {
   var queryHouseRange = `
    SELECT county_fips, state_fips, AVG(home_value) AS home_value
    FROM houseFilter1
    GROUP BY county_fips, state_fips
    HAVING AVG(home_value) >= ` + priceLow + ` AND AVG(home_value) <= ` + priceHigh + `
    `;
 // }


  //match county
  var queryMatchCounty = `
  SELECT state_name, county_name, AVG(home_value) AS price, AVG(aqi) AS aqi, AVG(temperature) AS temp, AVG(precipitation) AS precip
  FROM County c JOIN aqiFilter2 a ON c.state_fips = a.state_fips AND c.county_fips = a.county_fips
  JOIN tempFilter2 t ON c.state_fips = t.state_fips AND c.county_fips = t.county_fips
  JOIN precipFilter2 p ON c.state_fips = p.state_fips AND c.county_fips = p.county_fips
  JOIN houseFilter2 h ON c.state_fips = h.state_fips AND c.county_fips = h.county_fips
  GROUP BY c.county_fips, c.state_fips
  ORDER BY state_name
  `;

  var query = `
  WITH aqiFilter1 AS (
    ` + queryAQIParam + `
  ), aqiFilter2 AS (
    ` + queryAQIRange + `
  ), tempFilter1 AS (
    ` + queryTempSeason + `
  ), tempFilter2 AS (
    ` + queryTempRange + `
  ), precipFilter1 AS (
    ` + queryPrecipSeason + `
  ), precipFilter2 AS (
    ` + queryPrecipRange + `
  ), houseFilter1 AS (
    ` + queryHouseYear + `
  ), houseFilter2 AS (
    ` + queryHouseRange + `
  )` + queryMatchCounty;

console.log(query);
    connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
        res.json(rows);
      }
  });
}

function computeAdjusted(req, res) {
	var yearLow = req.params.yearLow;
	var yearHigh = req.params.yearHigh;
	var tempIdeal = req.params.tempIdeal;
	var tempCost = req.params.tempCost;
	var precipIdeal = req.params.precipIdeal;
	var precipCost = req.params.precipCost;
	var aqiCost = req.params.aqiCost;

	// consolidate aqi data
	var queryAQI = `
	SELECT state_fips, county_fips, AVG(aqi) AS aqi 
	FROM AirQuality 
	WHERE year(date) >= ` + yearLow + ` AND year(date) <= ` + yearHigh + ` 
	GROUP BY state_fips, county_fips
	`;

	//  consolidate weather data
	var queryWeather = `
	SELECT state_fips, county_fips, AVG(temperature) AS temp, AVG(precipitation) AS rain 
    FROM Weather 
    WHERE year >= ` + yearLow + ` AND year <= ` + yearHigh + ` 
    GROUP BY state_fips, county_fips 
	`;

	//  consolidate home value data
	var queryPrice = `
	SELECT state_fips, county_fips, AVG(home_value) AS price 
    FROM HomeValue 
    WHERE year >= ` + yearLow + ` AND year <= ` + yearHigh + ` 
    GROUP BY state_fips, county_fips 
	`;
	
	//  calculate adjusted costs
	var queryCosts = `
	SELECT a.state_fips, a.county_fips, a.aqi * ` + aqiCost + ` AS aqi_cost, ABS(w.temp - ` + tempIdeal + `) * `+ tempCost +
	       ` AS temp_cost, ABS(w.rain - ` + precipIdeal + `) * ` + precipCost + ` AS rain_cost, p.price AS base_cost
    FROM atemp a INNER JOIN wtemp w ON a.state_fips = w.state_fips AND a.county_fips = w.county_fips 
                 INNER JOIN ptemp p ON a.state_fips = p.state_fips AND a.county_fips = p.county_fips 
    GROUP BY a.state_fips, a.county_fips 
	`;

	//match county
	var queryMatchCounty = `
	SELECT c.state_name AS state_name, c.county_name AS county_name, (t.aqi_cost + t.temp_cost + t.rain_cost + t.base_cost) 
	       AS total_cost, t.aqi_cost AS aqi_cost, t.temp_cost AS temp_cost, t.rain_cost AS rain_cost,t.base_cost AS home_price 
    FROM ctemp t INNER JOIN County c ON t.state_fips = c.state_fips AND t.county_fips = c.county_fips 
    ORDER BY (t.aqi_cost + t.temp_cost + t.rain_cost + t.base_cost);
	`;

	var query = `
	  WITH atemp AS (
	    ` + queryAQI + `
	  ), wtemp AS (
	    ` + queryWeather + `
	  ), ptemp AS (
	    ` + queryPrice + `
	  ), ctemp AS (
	    ` + queryCosts + `
	  )` + queryMatchCounty;

	console.log(query);

	connection.query(query, function(err, rows, fields) {
	  if (err) console.log(err);
	  else {
	    res.json(rows);
	  }
	});
}

module.exports = {
  test: test,
  searchByCounty: searchByCounty,
  filterCounties: filterCounties,
  computeAdjusted: computeAdjusted,
  countyDetail: countyDetail,
  rainfallDetail: rainfallDetail,
  homeValue: homeValue,
  airQualityParams: fetchAirQualityParameters,
  countAqiCategories: countAqiCategories,
  filterCounties: filterCounties,
}
