import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
	<Router>
		<div className="App">
			<p>
				<Link to="/">Home</Link>
				&nbsp; | &nbsp;
				<Link to="/other">Other page</Link>
			</p>
			
			<Route exact path="/" component={Fib} />
			<Route path="/other" component={OtherPage} />
		</div>
	</Router>
  );
}

export default App;
