# CIS550FinalProject
CIS 550 Final Project

### Backend
1. `cd` into `/backend`
2. (first time) Run `npm install`
2. Run `node app.js`

You can also use *nodemon* to automatically restart the server when you make changes.
Install nodemon with `npm install -g nodemon`, and then run `nodemon app.js` to start the server.

Backend is available at `http://localhost:8081/`

### Frontend
1. `cd` into `/frontend/my-app`
2. (first time) Run `npm install`
3. Run `npm start`

Frontend is available at `http://localhost:3000/`

### Dependency Lists
The node modules used by our project can be found in the package.json files located directly within 
the backend and frontend/my-app folders.

### Other Files
The weather data processor rmd file contains the code that was used to clean and reshape the temperature
and precipitation data, and very similar steps were followed for the home value data. The AQI and fips
data was well-constructed so that minimal pre-preprocessing was needed.

The database ddl statements txt file has the entity resolution code that we used to transmute these data
records into a set of connected relationships. Foreign keys were added afterwards linking each other
table's fips columns to the county listing's fips data.
