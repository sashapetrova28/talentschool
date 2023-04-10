import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '/lib/session';

import database from '/utils/database';

const dayHandler = async (req, res) => {
	const { method } = req;
	const { day_id } = req.query
	const exists_day = await database.select('*').from('days').where({ id: day_id }).limit(1);
	if (exists_day.length <= 0) {
		res.status(410).json({ errorMessage: 'Day not exists' });
		return;
	}
	switch (method) {
		case 'GET':
			res.status(200).json(exists_day[0]);
			break;
		case 'PUT':
			res.status(403).json({ errorMessage: 'Forbidden' });
			break;
		case 'DELETE':
			if (!req.session || !req.session.user || req.session.user.status !== 'admin') {
				res.status(403).json({ errorMessage: 'Forbidden' });
				break;
			}
			const deleted_day = await database('days').returning('id').del().where({ id: day_id });
			res.status(200).json({
				id: deleted_day[0].id
			})
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

export default withIronSessionApiRoute(dayHandler, sessionOptions)