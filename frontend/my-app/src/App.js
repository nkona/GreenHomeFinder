import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Search from './Search';
import Filter from './Filter';
import CustomIndex from './CustomIndex';
import Detail from "./Detail";

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
          <Route
							exact
							path="/"
							component={Dashboard}
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							component={Dashboard}
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/search"
							component={Search}
							render={() => (
								<Search />
							)}
						/>
						
						<Route
							exact
							path="/detail"
							component={Detail}
							render={() => (
								<Detail />
							)}
						/>
						<Route
							exact
							path="/filter"
							component={Filter}
							render={() => (
								<Filter />
							)}
						/>
            <Route
							exact
							path="/customindex"
							render={() => (
								<CustomIndex />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}

