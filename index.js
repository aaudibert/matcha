const express = require("express");
const path = require('path');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db');
const KnexSessionStore = require('connect-session-knex')(session);
const store = new KnexSessionStore({
	knex: db,
	createtable: true,
});

app.use(session({
	secret: 'kekkeronisecret',
	resave: false,
	saveUninitialized: true,
	store: store,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");
app.set("views", path.resolve(__dirname + "/views"));

/*Home page*/

const sign_in = require('./sign_in');
app.post('/sign_in', sign_in);

app.get("/matcha", function(req, res, next) {
	if (!req.session.usr) {
		res.render(`home`, {
			pageTitle: "Welcome to matcha!",
			sess: req.session,
			localCss: "/css/home.css",
			localFont: "https://fonts.googleapis.com/css?family=Questrial",
		});
	}
	else {
		res.redirect(`/matches`);
	}
});

/*Logout*/

app.get('/logout', function(req, res, next) {
	req.session.usr = null;
	res.redirect(`/matcha`);
});

/*Sign up page*/

const sign_up = require('./sign_up');
app.post('/sign_up', sign_up.sign_up);
app.get("/sign_up", sign_up.gsign_up);

/*Profile page and interactions*/

const profile = require('./profile')
app.get("/profile/:uname", profile);

const interact = require('./interact')
app.post("/interact", interact.interact);
app.post("/interact/like/:id", interact.like);

/*Matches page*/

const matches = require('./matches')
app.get("/matches", matches);

/*Messages and notifications page*/

const notif = require('./notif')
app.get(`/notifications`, notif)

/*Default redirection*/

app.get('*', function(req, res, next) {
	res.redirect(`/matcha`);
});

/**/

app.get("/conversation/:id", function(req, res, next) {
	db.select().table('conversations').where('id', '=', req.params.id).first()
		.then(function(conversation) {
			db.select().table('messages').where('conv_id', '=', req.params.id)
				.then(function(msgs){
					res.render(`conv`, {
						pageTitle: conversation.title,
						conv: conversation,
						msgs: msgs
					});
				});
		});
});

app.listen(8080, function (){
	console.log('server started');
});
