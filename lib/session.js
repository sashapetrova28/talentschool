export const sessionOptions = {
	password: 'secret-passwordsecret-passwordsecret-passwordsecret-passwordsecret-passwordsecret-password',
	cookieName: 'user-cookies',
	// secure: true,
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
	},
}
