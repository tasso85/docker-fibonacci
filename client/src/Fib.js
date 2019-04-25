import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
	state = {
		seen_indexes: [],
		values: {},
		index: ''
	};
	
	componentDidMount() {
		this.fetchValues();
		this.fetchIndexes();
	}
	
	async fetchValues() {
		const values = await axios.get('/api/values/current');
		this.setState({ values: values.data });
	}
	
	async fetchIndexes() {
		const indexes = await axios.get('/api/values/all');
		this.setState({ seen_indexes: indexes.data });
	}
	
	renderSeenIndexes() {
		return this.state.seen_indexes.map(({ number }) => number).join(', ');
	}
	
	renderValues() {
		const entries = [];
		
		for(let key in this.state.values) {
			entries.push(
				<div key={key}>
					Value for {key} is {this.state.values[key]}
				</div>
			);
		}
		
		return entries;
	}
	
	handleSubmit = async (event) => {
		event.preventDefault();
		await axios.post('/api/values', {value: this.state.index});
		this.setState({ index: '' });
	}
	
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>Enter your index:</label>
					&nbsp;
					<input
						value={this.state.index}
						onChange={event => this.setState({ index: event.target.value })}
					/>
					&nbsp;
					<button>Submit</button>
				</form>
				
				<h3>Indexes seen</h3>
				{ this.renderSeenIndexes() }
				
				<h3>Calculated values</h3>
				{ this.renderValues() }
			</div>
		);
	}
}

export default Fib;