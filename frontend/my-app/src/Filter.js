import React from 'react';
//import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';


var price = [0, 2000];
var temp = [0, 100];
var tempMonth = "all";
var precip = [0, 20];
var precipMonth = "all";
var aqiParam = "PM2.5";
var aqi = [0, 4000];
var year = [1895, 2020];

export default class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //price: price,
			results: []
		};

		this.performFilter = this.performFilter.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    
    fetch("http://localhost:8081/Filter",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(api_results => {
      if (!api_results) return;

      let result_rows = api_results.map((resultObj, i) =>
      <tr id={"row-" + i}>
      <th scope="row">i</th>
        <td>{resultObj.state_name}</td>
        <td>{resultObj.county_name}</td>
        <td>{resultObj.price}</td>
        <td>{resultObj.aqi}</td>
        <td>{resultObj.temp}</td>
        <td>{resultObj.precip}</td>
    </tr>
      );
      
      this.setState({
        results: result_rows
      });
    }, err => {
      console.log(err);
    });
  }
	performFilter() {
    //console.log(this.state.movieName);
    var urlString = `http://localhost:8081/filter/${price[0] * 1000}/${price[1] * 1000}/${temp[0]}/${temp[1]}/${tempMonth}/${precip[0]}/${precip[1]}/${precipMonth}/${aqi[0]}/${aqi[1]}/${aqiParam}/${year[0]}/${year[1]}`;
    console.log(urlString);
		fetch(urlString, 
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(api_results => {
      if (!api_results) return;

      console.log("DONE");
      let result_rows = api_results.map((resultObj, i) =>
        <tr id={"row-" + i}>
          <th scope="row">{i + 1}</th>
            <td>{resultObj.state_name}</td>
            <td>{resultObj.county_name}</td>
            <td>{resultObj.price}</td>
            <td>{resultObj.aqi}</td>
            <td>{resultObj.temp}</td>
            <td>{resultObj.precip}</td>
        </tr>
      );   
      this.setState({
        results: result_rows
      });      
    }, err => {
      console.log(err);
    });
  }

  
  // performFilter() {
  //   console.log(price[1]);
  //   var urlString = `http://localhost:8081/filtercounties/${price[1]}`
  //   console.log(urlString);
	//     fetch(urlString,
	//     {
	//       method: 'GET' // The type of HTTP request.
	//     }).then(res => {
	//       // Convert the response data to a JSON.
	//       return res.json();
	//     }, err => {
	//       // Print the error if there is one.
	//       console.log(err);
	//     }).then(api_results => {
	//       if (!api_results) return;

  //       let result_rows = api_results.map((resultObj, i) =>
  //         <tr id={"row-" + i}>
  //           <th scope="row">1</th>
  //             <td>{resultObj.county_fips}</td>
  //             <td>{resultObj.home_value}</td>
  //             {/* <td>{resultObj.max_aqi}</td>
  //             <td>{resultObj.date}</td> */}
  //         </tr>
  //       );
        
	//       this.setState({
	//         results: result_rows
  //       });
        
	//     }, err => {
	//       // Print the error if there is one.
	//       console.log(err);
	//     });
  // }
  
  // handlePriceStringChange = (e) => {
  //   this.setState({ price: e.target.value });
  // };
  

  testPrint() {
    //print value of slider
    console.log("hellp");
    console.log(price);
    console.log(aqiParam);
  }


  render() {  
    return (
      <div className="Filter">
        <PageNavbar active="Filter" />
        <> 
        <Grid container justify = "center"><SliderYear /></Grid>   
        <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle id="dropdown-custom-1">Housing Price</Dropdown.Toggle>
    <Dropdown.Menu className="super-colors">
    <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Price
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body><SliderPrice /></Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
    </Dropdown.Menu>
  </Dropdown>{' '}

  <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle id="dropdown-custom-1">Temperature</Dropdown.Toggle>
    <Dropdown.Menu className="super-colors">
    <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Temperature
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body><SliderTemp /></Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Months
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body><ButtonMonthsTemp /></Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
    </Dropdown.Menu>
  </Dropdown>{' '}

  <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle id="dropdown-custom-1">Precipitation</Dropdown.Toggle>
    <Dropdown.Menu className="super-colors">
    <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Amount
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                  <Card.Body> 
                  <SliderRainAmt />
                   </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Months
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                    <ButtonMonthsRain />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
    </Dropdown.Menu>
  </Dropdown>{' '}

  <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle id="dropdown-custom-1">AQI</Dropdown.Toggle>
    <Dropdown.Menu className="super-colors">
    <Accordion>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Parameter
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body><ButtonAQI /></Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Air Quality
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body><SliderAQI /></Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
    </Dropdown.Menu>
  </Dropdown>{' '}
  <Button variant="dark" onClick={this.performFilter}>Apply Filters</Button>{' '}

</>
<table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">State</th>
              <th scope="col">County</th>
              <th scope="col">Avg Housing Price</th>
              <th scope="col">Avg AQI</th>
              <th scope="col">Avg Temperature</th>
              <th scope="col">Avg Precipitation</th>
            </tr>
          </thead>
          <tbody>
            {this.state.results}
          </tbody>
        </table>
      </div>
    );
  }
}

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `${value}`;
}

function SliderPrice() {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 2000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    price = newValue;
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Average Price (in thousands) 
      </Typography>
      <Slider
        min={0}
        max={2000}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}

function SliderTemp() {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 100]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    temp = newValue;
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Average Temperature (Fahrenheit) 
      </Typography>
      <Slider
        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}

function SliderRainAmt() {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 20]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    precip = newValue;
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Average Monthly Precipitation (inches)
      </Typography>
      <Slider
        min={0}
        max={20}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}

function SliderAQI() {
  const classes = useStyles();
  const [value, setValue] = React.useState([0, 4000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    aqi = newValue;
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Average AQI (based on chosen parameter) 
      </Typography>
      <Slider
        min={0}
        max={4000}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </div>
  );
}

function SliderYear() {
  const classes = useStyles();
  const [value, setValue] = React.useState([1895, 2020]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    year = newValue;
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Year
      </Typography>
      <Slider
        min={1895}
        max={2020}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        valueLabelDisplay="on"
      />
    </div>
  );
}


function ButtonMonthsRain() {
  const [value, setValue] = React.useState('all');

  const handleChange = (event) => {
    setValue(event.target.value);
    precipMonth = event.target.value;
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Choose Months</FormLabel>
      <RadioGroup aria-label="monthR" name="monthR" value={value} onChange={handleChange}>
        <FormControlLabel value="Q1" control={<Radio />} label="Jan-Mar" />
        <FormControlLabel value="Q2" control={<Radio />} label="Apr-June" />
        <FormControlLabel value="Q3" control={<Radio />} label="July-Sept" />
        <FormControlLabel value="Q4" control={<Radio />} label="Oct-Dec" />
        <FormControlLabel value="all" control={<Radio />} label="All" />
      </RadioGroup>
    </FormControl>
  );
}

function ButtonMonthsTemp() {
  const [value, setValue] = React.useState('all');

  const handleChange = (event) => {
    setValue(event.target.value);
    tempMonth = event.target.value;
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Choose Months</FormLabel>
      <RadioGroup aria-label="monthT" name="monthT" value={value} onChange={handleChange}>
        <FormControlLabel value="Q1" control={<Radio />} label="Jan-Mar" />
        <FormControlLabel value="Q2" control={<Radio />} label="Apr-June" />
        <FormControlLabel value="Q3" control={<Radio />} label="July-Sept" />
        <FormControlLabel value="Q4" control={<Radio />} label="Oct-Dec" />
        <FormControlLabel value="all" control={<Radio />} label="All" />
      </RadioGroup>
    </FormControl>
  );
}

function ButtonAQI() {
  const [value, setValue] = React.useState('PM2.5');

  const handleChange = (event) => {
    setValue(event.target.value);
    aqiParam = event.target.value;
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Choose Parameter</FormLabel>
      <RadioGroup aria-label="aqi" name="aqi" value={value} onChange={handleChange}>
        <FormControlLabel value="PM2.5" control={<Radio />} label="PM2.5" />
        <FormControlLabel value="Ozone" control={<Radio />} label="Ozone" />
        <FormControlLabel value="SO2" control={<Radio />} label="SO2" />
        <FormControlLabel value="PM10" control={<Radio />} label="PM10" />
        <FormControlLabel value="NO2" control={<Radio />} label="NO2" />
        <FormControlLabel value="CO" control={<Radio />} label="CO" />
      </RadioGroup>
    </FormControl>
  );
}
