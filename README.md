# GreenHomeFinder

Our project’s goal is to help people who are looking to relocate decide which counties they may want to move to by providing them with a general idea of the climate and air quality of each US county in addition to typical home values. The app allows users to search for specific counties they are interested in and provide them with graphic representations of data from our housing, weather, and air quality datasets. 

Additionally, users can filter for counties based on user specified parameters on price, weather, and air quality in order to narrow down potential regions of interest by their needs and desires. They can also create their own adjusted cost of living that applies cost penalties to counties outside their weather and air quality preferences. 

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
