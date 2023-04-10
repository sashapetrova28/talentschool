import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';
import saveFile from "/utils/saveFile";
import formidable from "formidable";

import database from '/utils/database';

const usersHandler = async (req, res) => {
	if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
		res.status(403).json({ errorMessage: 'Forbidden' });
		return;
	}
	const { method } = req;
	switch (method) {
		case 'GET':
			const users = await database.select('*').from('users');
			res.status(200).json(users);
			break;
		case 'POST':
			const { body: { email, name, surname, password, age, status } } = req;
			const exists_user = await database.select('email').from('users').where({ email: email }).limit(1);
			if (exists_user.length > 0) {
				res.status(409).json({ errorMessage: 'User exists' });
				break;
			}
			const new_user = await database('users')
				.returning('id')
				.insert({
					email: email,
					name: name,
					surname: surname,
					password: password,
					age: age,
					status: status
				});
			res.status(200).json({
				id: new_user[0].id,
				email: email,
				name: name,
				surname: surname,
				password: password,
				age: age,
				status: status
			})
			break;
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(usersHandler, sessionOptions)