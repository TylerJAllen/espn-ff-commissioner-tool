import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.scss';

import HomePage from './components/HomePage';

function App() {
	return (
		<Router>
			<div className="App">
				<h2>ESPN Fantasy Football Commissioner Tool</h2>
			</div>
			<Route path="/" exact component={HomePage} />
		</Router>
	);
}

export default App;
