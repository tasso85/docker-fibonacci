const keys = require('./keys');

// Express app setup
const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(parser.json());

// Postgres client setup
const { Pool } = require('pg');
const pg = new Pool({
	user: keys.pg.user,
	host: keys.pg.host,
	database: keys.pg.database,
	password: keys.pg.password,
	port: keys.pg.port
});
pg.on('error', () => console.log('Lost PG connection'));

pg.query('DROP TABLE IF EXISTS fibonacci').catch((err) => console.log(err));
pg.query('CREATE TABLE IF NOT EXISTS fibonacci ( number INT )').catch((err) => console.log(err));

// Redis client setup
const redis = require('redis');
const client = redis.createClient({
	host: keys.redis.host,
	port: keys.redis.port,
	retry_strategy: () => 1000
});
const pub = client.duplicate();
client.del('values');

// Express Routing
app.get('/', (req, res) => {
	res.send('Hi');
});

app.get('/values/all', async (req, res) => {
	const values = await pg.query('SELECT * from fibonacci');
	res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
	client.hgetall('values', (err, values) => {
		res.send(values);
	});
});

app.post('/values', async (req, res) => {
	const index = req.body.value;
	
	if(parseInt(index) > 40) {
		return res.status(422).send('index too high');
	}
	
	client.hset('values', index, 0);
	pub.publish('insert', index);
	pg.query('INSERT INTO fibonacci (number) VALUES ($1)', [index]);
	
	res.send({working: true});
});

app.listen(5000, (err) => console.log('Listening on port 5000'));