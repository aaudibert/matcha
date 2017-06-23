function interact(req, res, next) {
	const db = require("./db");

	console.log(req.body.like);
	console.log(req.body.report);

}

function like (req, res, next) {
	const db = require('./db');

	console.log('testlike');
	db.select().table('interaction').where({user: req.session.usr.id, liked: usrProfile.id}).first()
		.then(function(alreadyLiked) {
			if (!alreadyLiked) {
				console.log('iflike');
				db.insert([{
					sender: req.session.usr.id,
					receiver: usrProfile.id,
					type: "liked your profile"
				}]).into('notifications').then(function(){
						db.select().table('interaction').where({user: req.params.id, liked: usrProfile.id}).first()
							.then(function(notifLike) {
								db.insert([{
									user: req.session.usr.id,
									liked: usrProfile.id,
								}]).into('interaction').then(console.log);
							});
				});
			}
			else {
				console.log('elselike');
				db.table('notifications').where({
					sender: req.session.usr.id,
					receiver: usrProfile.id,
					type: "liked your profile"
				}).del().then(function(){
						db.table('interaction').where({user: req.session.usr.id, liked: usrProfile.id}).first()
							.then(function(notifUnlike) {
								db.table('interaction').where([{
									user: req.session.usr.id,
									liked: usrProfile.id,
								}]).del.then(console.log);
							});
						});
			}
		});
}

module.exports = {
	interact,
	like
}