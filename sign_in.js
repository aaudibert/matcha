function sign_in(req, res, next) {
	const db = require("./db");
	
	var uname = req.body.uname.trim();
	var pass = req.body.password.trim();

	const errors = [];

	//credentials verifications

	db.select().table('users').where({
		username: uname,
		password: pass
		}).first().then(function(dbLog){
			if (dbLog) {
				req.session.usr = dbLog;
				res.redirect('matcha');
			}
			else {
			    errors.push({
			      field: 'uname',
			      error: "This username doesn't exist or you entered an invalid username/password combination",
			    });
			    console.log(errors);
				res.redirect('matcha');
			}
		});

	if (errors.length > 0) {
		res.json({
		    errors: errors,
		});
	  res.status(500).send({ error: "error" });
	}
	else {
		console.log('noerr');
	}
}

module.exports = sign_in;