function notif(req, res, next) {
	db = require('./db.js');

	if (!req.session.usr)
		res.redirect(`matcha`);
	else {
		db.select().table('notifications').where({receiver: req.session.usr.id})
			.then(function(usrNotifs) {
				res.render(`notifications`, {
					pageTitle: "Your notifications",
					sess: req.session,
					localCss: "/css/notifs.css",
					localFont: "https://fonts.googleapis.com/css?family=Questrial",
					notifs: usrNotifs
				});
			});
	}
}

module.exports = notif;