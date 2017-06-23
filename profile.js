function profile(req, res, next) {
	const db = require("./db");

	if (!req.session.usr)
		res.redirect(`/matcha`);
	
	else {
	
	/*User's profile and modification*/

	if (req.params.uname === req.session.usr.username) {
		res.render(`profile`, {
			pageTitle: "Your profile",
			profile: req.session.usr,
			sess: req.session,
			localCss: "/css/profile.css",
			localFont: "https://fonts.googleapis.com/css?family=Questrial",
			error: null
		});
	}

	else {
			db.select().table('users').where({username: req.params.uname}).first()
			.then(function(usrProfile) {
				if (usrProfile) {
					/*Other user's profile*/

					db.select().table('interaction').where({user: req.session.usr.id, visited: usrProfile.id}).first()
					.then(function(alreadyVisited) {
						if (!alreadyVisited) {
							db.insert([{
								sender: req.session.usr.id,
								receiver: usrProfile.id,
								type: "visited your profile",
								senderUname: req.session.usr.uname
							}]).into('notifications').then(function(){
								db.insert([{
									user: req.session.usr.id,
									visited: usrProfile.id
								}]).into('interaction').then(console.log);
							});
						}
					});							
					
					res.render(`profile`, {
						pageTitle: req.params.uname + "'s profile",
						profile: usrProfile,
						sess: req.session,
						localCss: "/css/profile.css",
						localFont: "https://fonts.googleapis.com/css?family=Questrial",
						error: null
					});
				}
				else {
					/*No profile found*/

					res.render(`profile`, {
						pageTitle: req.params.uname + "'s profile",
						profile: req.session,
						sess: req.session,
						localCss: "/css/profile.css",
						localFont: "https://fonts.googleapis.com/css?family=Questrial",
						error: 'No one is registered under this username'
					});
				}
			});
		}
	}
}

module.exports = profile;