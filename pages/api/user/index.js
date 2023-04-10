import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '/lib/session'
import database from '/utils/database';

const userHandler = async (req, res) => {
	if (req.session.user) {
		const exists_user = await database.select('*').from('users').where({ email: req.session.user.email }).limit(1);
		if (exists_user.length === 1) {
			res.json({
				...exists_user[0],
				isLoggedIn: true,
			});
		} else {
			res.json({
				isLoggedIn: false,
			});
		}
	} else {
		res.json({
			isLoggedIn: false,
		});
	}
}

export default withIronSessionApiRoute(userHandler, sessionOptions)