
import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import {
    AreaChart, Area
} from 'recharts';

import {
    BarChart, Bar, Cell, Legend, PieChart, Pie
} from 'recharts';

class Detail extends React.Component {

    state = {
        selected_aqi_param: "",
        aqi_params: [],
        aqi: [],
        rainfall_county: [],
        rainfall_state: [],
        rainfall_usa: [],
        rainfall_sum: [],
        home_sum: [],
    };

    fetchAqiParams = () => {
        var urlString = `http://localhost:8081/aqi-params`
        fetch(urlString,
            {
              method: 'GET'
            }).then(res => {
              return res.json();
            }, err => {
              console.log(err);
            }).then(api_results => {
              if (!api_results) return;
                this.setState({
                    aqi_params: api_results.map((param) => {
                        return(
                        <button 
                            key={param.parameter}
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => this.fetchAqiData(param.parameter)}
                        >
                            {param.parameter}
                        </button>
                        );
                    })
                });
                this.fetchAqiData(api_results[0].parameter);
            }, err => {
              console.log(err);
            });
    }

    fetchAqiData = (param) => {
        this.setState({
            selected_aqi_param: param,
        });

		var graphUrlString = `http://localhost:8081/detail?state=${this.props.location.state.state_name}&county=${this.props.location.state.county_name}&parameter=${param}`
        
        fetch(graphUrlString,
	    {
	      method: 'GET'
	    }).then(res => {
	      return res.json();
	    }, err => {
	      console.log(err);
	    }).then(api_results => {
	      if (!api_results) return;
            this.setState({
                aqi: api_results[0].map((k, i) => {
                    return {
                        usa: k.aqi,
                        state: api_results[1][i].aqi,
                        county: api_results[2][i].aqi,
                        date: k.date,
                    }
                })
            });
	    }, err => {
	      console.log(err);
        });
        
        var categoriesUrlString = `http://localhost:8081/aqi-count?state=${this.props.location.state.state_name}&county=${this.props.location.state.county_name}&parameter=${param}`
        
        fetch(categoriesUrlString,
	    {
	      method: 'GET'
	    }).then(res => {
	      return res.json();
	    }, err => {
	      console.log(err);
	    }).then(api_results => {
          if (!api_results) return;
          console.log(api_results);
            this.setState({
                aqi_count: api_results.reverse(),
            });
	    }, err => {
	      console.log(err);
	    });
    }

    fetchRainfallData = () => {
        var urlString2 = `http://localhost:8081/rainfall?state=${this.props.location.state.state_name}&county=${this.props.location.state.county_name}`
        fetch(urlString2,
            {
                method: 'GET' // The type of HTTP request.
            }).then(res => {
            // Convert the response data to a JSON.
            return res.json();
        }, err => {
            // Print the error if there is one.
            console.log(err);
        }).then(api_results2 => {
            if (!api_results2) return;

            console.log(api_results2);
            let temp=[].concat.apply([], api_results2);
            console.log(temp);

            this.setState({
                rainfall_county: api_results2[2].map((result) => {
                    return { name:"County" , precipitation1: result.precipitation, date: result.date };
                }),
                rainfall_state: api_results2[1].map((result) => {
                    return { name:"state" , precipitation2: result.precipitation, date: result.date };
                }),
                rainfall_usa: api_results2[0].map((result) => {
                    return {  name:"US" ,precipitation3: result.precipitation, date: result.date };
                })
            });

            let final_sum = [];
            let months = {"1":"January","2":"February", "3":"March", "4":"April", "5":"May", "6":"June",
                "7":"July", "8":"August", "9":"September", "10":"October", "11":"November", "12":"December"};
            for(let i = 0; i <12; i ++) {
                final_sum.push({date:months[""+(i+1)], county: this.state.rainfall_county[i].precipitation1,state: this.state.rainfall_state[i].precipitation2,us: this.state.rainfall_usa[i].precipitation3, })
            }
            this.setState({
                rainfall_sum:final_sum
            });
        }, err => {
            console.log(err);
        });


    };

    fetchHomeData = () => {
        var urlString3 = `http://localhost:8081/homevalue?state=${this.props.location.state.state_name}&county=${this.props.location.state.county_name}`
        fetch(urlString3,
            {
                method: 'GET'
            }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(api_results3 => {
            if (!api_results3) return;

            let final_arr = [];
            console.log(api_results3[0]);
            for(let i = 0;  i < api_results3[0].length; i ++) {
                final_arr.push({date:api_results3[0][i].date , county: api_results3[0][i].home_value,   state: api_results3[1][i].home_value, us: api_results3[2][i].home_value})
            }
            console.log(final_arr);

            this.setState({
                home_sum: final_arr
            });

        }, err => {
            // Print the error if there is one.
            console.log(err);
        });
    }

    componentDidMount() {
        this.fetchAqiParams();
        this.fetchHomeData();
        this.fetchRainfallData();
    }

    render() {
        const style = {
            top: 0,
            left: 350,
            lineHeight: '24px',
        };

        return (
            <div>
                <div className="jumbotron">
                    <h1>{this.props.location.state.state_name}</h1>
                    <h3>{this.props.location.state.county_name}</h3>
                </div>
                <div className="container mt-5">
                    <h4>{this.state.selected_aqi_param} Air Quality Index</h4>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        {this.state.aqi_params}
                    </div>
                    <LineChart className="mb-5" width={1000} height={400} data={this.state.aqi}>
                        <Line type="monotone" dataKey="county" stroke="#8884d8" dot={false} />
                        <Line type="monotone" dataKey="state" stroke="#F39C12" dot={false} />
                        <Line type="monotone" dataKey="usa" stroke="#2ECC71" dot={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                    
                    <h4>Days with AQI {this.state.selected_aqi_param} Rating</h4>
                    <PieChart className="mb-5" width={1000} height={600}>
                        <Pie dataKey="value" startAngle={180} endAngle={0} data={this.state.aqi_count} cx={500} cy={400} outerRadius={300} fill="#8884d8" label />
                        <Tooltip />
                    </PieChart>

                    <h4>Total Rainfall</h4>
                    <AreaChart
                        className="mb-5"
                        width={1000}
                        height={400}
                        data={this.state.rainfall_sum}
                        margin={{
                            top: 10, right: 30, left: 0, bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="county" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="state" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        <Area type="monotone" dataKey="us" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>

                    <h4>Housing Market</h4>
                    <BarChart
                        className="mb-5"
                        width={1000}
                        height={300}
                        data={this.state.home_sum}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="county" fill="#8884d8" />
                        <Bar dataKey="state" fill="#82ca9d" />
                        <Bar dataKey="us" fill="#82caFF" />
                    </BarChart>
                </div>
            </div>
        );
    }
}

export default Detail;