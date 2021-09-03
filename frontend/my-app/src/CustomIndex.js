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
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';

var tempIdeal = 60;
var tempCost = 0;
var precipIdeal = 3;
var precipCost = 0;
var aqiCost = 0;
var year = [2015, 2020];

export default class CustomIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	results: []
    };
    this.computeAdjusted = this.computeAdjusted.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/compute",
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
  
  computeAdjusted() {
    var urlString = `http://localhost:8081/compute/${year[0]}/${year[1]}/${tempIdeal}/${tempCost}/${precipIdeal}/${precipCost}/${aqiCost}`;
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
	            <td>{resultObj.total_cost}</td>
	            <td>{resultObj.home_price}</td>
	            <td>{resultObj.aqi_cost}</td>
	            <td>{resultObj.temp_cost}</td>
	            <td>{resultObj.rain_cost}</td>
	        </tr>
	      );   
	      this.setState({
	        results: result_rows
	      });      
	    }, err => {
	      console.log(err);
	    }
	  );
  }

  render() {    
	  return (
		      <div className="CustomIndex">
		        <PageNavbar active="Custom Index" />
		        <> 
		        <Grid container justify = "center"><SliderYear /></Grid>   

		  <Dropdown as={ButtonGroup}>
		    <Dropdown.Toggle id="dropdown-custom-1">Temperature</Dropdown.Toggle>
		    <Dropdown.Menu className="super-colors">
		    <Accordion>
		    			<Card>
		    			  <Accordion.Toggle as={Card.Header} eventKey="0">
		    			  	Ideal Temperature
		    			  </Accordion.Toggle>
		    			  <Accordion.Collapse eventKey="0">
		    				<Card.Body><SliderTempIdeal /></Card.Body>
		    			  </Accordion.Collapse>
		    			</Card>
		                <Card>
		                  <Accordion.Toggle as={Card.Header} eventKey="0">
		                    Differential Cost
		                  </Accordion.Toggle>
		                  <Accordion.Collapse eventKey="0">
		                    <Card.Body><SliderTempCost /></Card.Body>
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
						    Ideal Precipitation
						  </Accordion.Toggle>
						  <Accordion.Collapse eventKey="0">
						    <Card.Body><SliderRainIdeal /></Card.Body>
						  </Accordion.Collapse>
			  			</Card>
		                <Card>
		                  <Accordion.Toggle as={Card.Header} eventKey="0">
		                    Differential Cost
		                  </Accordion.Toggle>
		                  <Accordion.Collapse eventKey="0">
		                    <Card.Body> <SliderRainCost /> </Card.Body>
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
            			Increment Cost
            		</Accordion.Toggle>
            		<Accordion.Collapse eventKey="0">
            			<Card.Body>
            				<SliderAQI />
            			</Card.Body>
            		</Accordion.Collapse>
            	</Card>
		              </Accordion>
		    </Dropdown.Menu>
		  </Dropdown>{' '}
		  <Button variant="dark" onClick={this.computeAdjusted}>Apply Settings</Button>{' '}

	</>
	  <table class="table">
		<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">State</th>
		        <th scope="col">County</th>
		        <th scope="col">Adjusted Total Cost</th>
		        <th scope="col">Avg Housing Price</th>
		        <th scope="col">Avg AQI Cost</th>
		        <th scope="col">Avg Temperature Cost</th>
		        <th scope="col">Avg Precipitation Cost</th>
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
	  input: {
		width: 50,
	  },
	});

	function valuetext(value) {
	  return `${value}`;
	}

	function SliderTempIdeal() {
		  const classes = useStyles();
		  const [value, setValue] = React.useState(60);

		  const handleChange = (event, newValue) => {
		    setValue(newValue);
		    tempIdeal = newValue;
		  };
		  
		  const handleInput = (event) => {
			    setValue(event.target.value === '' ? '' : Number(event.target.value));
			    tempIdeal = event.target.value === '' ? '' : Number(event.target.value);
		  };
		  
		  const handleBlur = () => {
			  if (value < 0) {
			      setValue(0);
			      tempIdeal = 0;
			  } else if (value > 100) {
			      setValue(100);
			      tempIdeal = 100;
			  }
		  };

		  return (
		    <div className={classes.root}>
		      <Typography id="input-slider" gutterBottom>
		      	Average Temperature (Fahrenheit)
		      </Typography>
		      <Slider
		        min={0}
		        max={100}
		        value={value}
		        onChange={handleChange}
		        valueLabelDisplay="auto"
		        aria-labelledby="input-slider"
		        getAriaValueText={valuetext}
		      />
		      <Input
	            className={classes.input}
	            value={value}
	            margin="dense"
	            onChange={handleInput}
	            onBlur={handleBlur}
	            inputProps={{
	              step: 1,
	              min: 0,
	              max: 100,
	              type: 'number',
	              'aria-labelledby': 'input-slider',
	            }}
	          />
		    </div>
		  );
		}
	
	function SliderTempCost() {
	  const classes = useStyles();
	  const [value, setValue] = React.useState(0);

	  const handleChange = (event, newValue) => {
	    setValue(newValue);
	    tempCost = newValue;
	  };
	  
	  const handleInput = (event) => {
		    setValue(event.target.value === '' ? '' : Number(event.target.value));
		    tempCost = event.target.value === '' ? '' : Number(event.target.value);
	  };
	  
	  const handleBlur = () => {
		  if (value < 0) {
		      setValue(0);
		      tempCost = 0;
		  } else if (value > 9999) {
		      setValue(9999);
		      tempCost = 9999;
		  }
	  };

	  return (
	    <div className={classes.root}>
	      <Typography id="input-slider" gutterBottom>
	      	Cost Per Degree Away
	      </Typography>
	      <Slider
	        min={0}
	        max={9999}
	        value={value}
	        onChange={handleChange}
	        valueLabelDisplay="auto"
	        aria-labelledby="input-slider"
	        getAriaValueText={valuetext}
	      />
	      <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInput}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 9999,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
	    </div>
	  );
	}

	function SliderRainIdeal() {
		  const classes = useStyles();
		  const [value, setValue] = React.useState(3);

		  const handleChange = (event, newValue) => {
		    setValue(newValue);
		    precipIdeal = newValue;
		  };
		  
		  const handleInput = (event) => {
			    setValue(event.target.value === '' ? '' : Number(event.target.value));
			    precipIdeal = event.target.value === '' ? '' : Number(event.target.value);
		  };
		  
		  const handleBlur = () => {
			  if (value < 0) {
			      setValue(0);
			      precipIdeal = 0;
			  } else if (value > 20) {
			      setValue(20);
			      precipIdeal = 20;
			  }
		  };

		  return (
		    <div className={classes.root}>
		      <Typography id="input-slider" gutterBottom>
		      	Average Monthly Precipitation
		      </Typography>
		      <Slider
		        min={0}
		        max={20}
		        value={value}
		        onChange={handleChange}
		        valueLabelDisplay="auto"
		        aria-labelledby="input-slider"
		        getAriaValueText={valuetext}
		      />
		      <Input
	            className={classes.input}
	            value={value}
	            margin="dense"
	            onChange={handleInput}
	            onBlur={handleBlur}
	            inputProps={{
	              step: 1,
	              min: 0,
	              max: 20,
	              type: 'number',
	              'aria-labelledby': 'input-slider',
	            }}
	          />
		    </div>
		  );
		}
	
	function SliderRainCost() {
	  const classes = useStyles();
	  const [value, setValue] = React.useState(0);

	  const handleChange = (event, newValue) => {
	    setValue(newValue);
	    precipCost = newValue;
	  };
	  
	  const handleInput = (event) => {
		setValue(event.target.value === '' ? '' : Number(event.target.value));
		precipCost = event.target.value === '' ? '' : Number(event.target.value);
	  };
	  
	  const handleBlur = () => {
		if (value < 0) {
		  setValue(0);
		  precipCost = 0;
		} else if (value > 9999) {
          setValue(9999);
          precipCost = 9999;
   	    }
	  };

	  return (
	    <div className={classes.root}>
	      <Typography id="input-slider" gutterBottom>
	        Cost Per Inch Difference
	      </Typography>
	      <Slider
	        min={0}
	        max={9999}
	        value={value}
	        onChange={handleChange}
	        valueLabelDisplay="auto"
	        aria-labelledby="input-slider"
	        getAriaValueText={valuetext}
	      />
	      <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInput}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 9999,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
	    </div>
	  );
	}

	function SliderAQI() {
	  const classes = useStyles();
	  const [value, setValue] = React.useState(0);

	  const handleChange = (event, newValue) => {
	    setValue(newValue);
	    aqiCost = newValue;
	  };
	  
	  const handleInput = (event) => {
		setValue(event.target.value === '' ? '' : Number(event.target.value));
		aqiCost = event.target.value === '' ? '' : Number(event.target.value);
	  };
	  
	  const handleBlur = () => {
		if (value < 0) {
	      setValue(0);
	      aqiCost = 0;
	    } else if (value > 9999) {
		  setValue(9999);
		  aqiCost = 9999;
		}
	  };

	  return (
	    <div className={classes.root}>
	      <Typography id="input-slider" gutterBottom>
	        Cost Per AQI Increment 
	      </Typography>
	      <Slider
	        min={0}
	        max={9999}
	        value={value}
	        onChange={handleChange}
	        valueLabelDisplay="auto"
	        aria-labelledby="input-slider"
	        getAriaValueText={valuetext}
	      />
	      <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInput}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 9999,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
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
	        min={2015}
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