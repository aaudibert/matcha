function sign_up(req, res, next) {
	const db = require("./db");
	
	var fname = req.body.fname.trim();
	var lname = req.body.lname.trim();
	var uname = req.body.uname.trim();
	var mail = req.body.mail.trim();
	var password = req.body.password.trim();
	var rpassword = req.body.rpassword.trim();

	//global error handling

	// const validation = {
	// 	fname: function (value) {
	// 	  	var re = new RegExp('^[A-Z]{1}[a-z]+([-][A-Z]{1}[a-z])$');
		
	// 	    if (re.test(value) === false) {
	// 	      return 'Your First Name can only contain alphabetic characters or "-" and should be in the following format: "1st First Name"-"2nd First Name"-"3rd First Name"...';
	// 	    }
		
	// 	    if (value.length > 30) {
	// 	      return 'Sorry your First Name is too long, please shorten it or enter one of your nicknames'
	// 	    }
	// 	},

	// 	lname: function (value) {
	// 	  	var re = new RegExp('^[A-Z]{1}[a-z]+([-][A-Z]{1}[a-z])$');
		    
	// 	    if (re.test(value) === false) {
	// 	      return 'Your Last Name can only contain alphabetic characters or "-" and should be in the following format: "1st Last Name"-"2nd Last Name"-"3rd Last Name"...';
	// 	    }
	// 	    if (value.length > 50) {
	// 	      return 'Sorry your Last Name is too long, please shorten it if possible'
	// 	    }
	// 	},

	// 	password: function (value) {
	// 	    if (value.length < 8) {
	// 	      return 'Your password is too short and should be at least 8 characters long'
	// 	    }
	// 	},

	// 	rpassword: function (value) {
	// 	   if (value !== password)
	//     	return "The passwords you entered didn't match";
	// 	}
	// };

	const errors = [];

	// for (var key in validation) {
	//   const error = validation[key](req.body[key])

	//   if (error) {
	//     errors.push({
	//       field: key,
	//       error: error,
	//     });
	//   }
	// }

	// username error handling

	db.select().table('users').where('username', '=', uname)
		.then(function(dbUname){
			if (dbUname.length !== 0) {
			    errors.push({
			      field: 'uname_t',
			      error: 'This username was already taken',
			    });
			}
		});

	//mail error handling

	db.select().table('users').where('mail', '=', mail)
		.then(function(dbMail){
			if (dbMail.length !== 0) {
			    errors.push({
			      field: 'mail_t',
			      error: 'This e-mail adress was already taken',
			    });
			}
		});

	if (errors.length > 0) {
		res.json({
			errors: errors,
		});
		console.log(errors);
	}
	else {
		console.log('ok');
		db.insert([{
			username: uname,
			mail: mail,
			last_name: lname,
			first_name: fname,
			password: password
		}]).into('users').then(console.log);
		res.redirect(`matcha`);
	}


}

function getGenders() {
	return new Promise(function(resolve, reject){
		const db = require("./db");
		
		db('users').distinct('gender').select()
		.then(function(dbGenders){
			resolve(dbGenders);
		}, function(err){
			reject(err);
		});

	})
}

function gsign_up(req, res, next) {
	if (req.session.usr)
		res.redirect(`matches`);
	else {
		getGenders().then(function(genders){
			res.render(`sign_up`, {
				pageTitle: "Welcome to matcha!",
				sess: req.session,
				gender: genders,
				localCss: "/css/sign_up.css",
				localFont: "https://fonts.googleapis.com/css?family=Questrial",
			});
		}, function(err){
			res.render(`sign_up`, {
				pageTitle: "Welcome to matcha!",
				sess: req.session,
				gender: [{gender: 'man', gender: 'woman'}],
				localCss: "/css/sign_up.css",
				localFont: "https://fonts.googleapis.com/css?family=Questrial",
			});
		})
	}
}

module.exports = {
	sign_up,
	gsign_up
}

 // var Promise = require('bluebird');
 // function yo ( db){
 //  return new Promise(function (resolve, reject) {
 //  		resolve(tets);


 //  		reject(dhhd);
 //  });
 //  }

 // yo(tets).then(function(res){

 //  }, function(err){

 //  })



 // function yo2 (db) {
 //  return new Promise(function (resolve, reject) {
 //  		resolve(tets2);


 //  		reject(dhhd);
 //  });
 //  }
 
 // yo(chqt).then(function(res){

 // 	return yo2(res);

 //  }).then(function(uio){

 //  }, function (err){

//lodash, neo4j, parse server, k-nn