import knex from 'knex';

const database = knex({
	client: 'pg',
	connection: {
		host: '213.189.221.182',
		port: 5432,
		user: 'camp',
		password: 'Ph5nuX0HHDPorRGP',
		database: 'camp'
	}
});

export default database;