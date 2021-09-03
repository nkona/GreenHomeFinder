import React from 'react';
//import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
//import { Button } from 'rsuite';
//import { Slider, RangeSlider } from 'rsuite';


export default class Search extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. 
    // This component maintains the list of people.
    // this.state = {
    //   people: []
    // }
    this.state = {
			searchString: "",
			results: [],
		};

		this.performSearch = this.performSearch.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    this.performSearch();
  }

  performSearch() {
		var urlString = `http://localhost:8081/county/${this.state.searchString || "all"}`
	    fetch(urlString,
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
          <tr id={"row-" + i} >
              <th scope="row">{i}</th>
              <td> {resultObj.state_name}</td>
              <td>{resultObj.county_name}</td>
              <td>{resultObj.aqi_count}</td>
              <button 
                onClick={() => this.clicked(resultObj.state_name, resultObj.county_name, resultObj.max_aqi, resultObj.date)}
                className="btn btn-link"
              >
                Click to view
              </button>
          </tr>
        );
        
	      this.setState({
	        results: result_rows
        });
        
	    }, err => {
	      // Print the error if there is one.
	      console.log(err);
	    });
  }

  clicked = function(state, county, aqi, date) {		
    console.log(this.props.location);		
    this.props.location.state = {state_name: state, county_name: county, max_aqi: aqi, date:date};		
    console.log(this.props.location.state);		
    this.props.history.push({pathname:'/detail',state: {state_name: state, county_name: county, max_aqi: aqi, date:date}});
  };
  
  handleSearchStringChange = (e) => {
    this.setState({ searchString: e.target.value });
  };

  render() {    
    return (
      <div className="Search">
        <PageNavbar active="Search" />
        <div className="row">
          <div className="pl-4 pr-2" style={{width: 400 + 'px'}}>
            <input 
              type="text" 
              className="col form-control" 
              value={this.state.searchString}
              onChange={this.handleSearchStringChange}
            />
          </div>
          <div className="pl-2 pr-2">
            <button 
              onClick={this.performSearch} 
              type="button" 
              className="col btn btn-primary">
              Search
            </button>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">State</th>
              <th scope="col">County</th>
              <th scope="col">AQI Datapoints</th>
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