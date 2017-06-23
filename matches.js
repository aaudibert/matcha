function matches(req, res, next) {
	const db = require("./db");

	if (!req.session.usr)
		res.redirect(`matcha`);
	
	else {
		db.select().table('users').whereNot({username: req.session.usr.username}).limit(10)
		.then(function(resProfile) {
			if (resProfile) {
				res.render(`matches`, {
					pageTitle: "Here are your proposed matches",
					profile: resProfile,
					sess: req.session,
					localCss: "/css/matches.css",
					localFont: "https://fonts.googleapis.com/css?family=Questrial",
					error: null
				});
			}
			else {
				res.render(`profile`, {
					pageTitle: "Your profile",
					profile: req.session,
					sess: req.session,					
					localCss: "/css/matches.css",
					localFont: "https://fonts.googleapis.com/css?family=Questrial",
					error: "We haven't found a match for you yet"
				});
			}
		});
	}
}

module.exports = matches;