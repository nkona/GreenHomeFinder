import React from 'react';
//import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. 
    // This component maintains the list of people.
    // this.state = {
    //   people: []
    // }
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/map",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    })
  }

  render() {    
    return (
      <div className="Dashboard">
        <PageNavbar active="Dashboard" />
        <div className="container people-container">
          <br></br>
          <div className="jumbotron less-headspace">
          </div>
        </div>
      </div>
    );
  }
}