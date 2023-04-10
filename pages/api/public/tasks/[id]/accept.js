import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const mainTaskHandler = async (req, res) => {
	const { method } = req;
	const { id } = req.query
	switch (method) {
		case 'POST':
			const user = await database.select('*').from('users').where({email: req.session.user.email}).limit(1);
			await database('accepted_tasks').insert({task_id: id, user_id: user[0].id, status: 'waiting'});
			res.status(200).json('accepted');
			break;
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(mainTaskHandler, sessionOptions)