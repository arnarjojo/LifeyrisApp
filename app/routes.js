// app/routes.js
module.exports = function(app, passport) {

	var User = require('./models/user');
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//Get data for the current user to fill in tables
	app.get('/dashboard', isLoggedIn, function(req, res) {
		User.findOne({ 'email': req.user.email }, function(err, user){
			res.render('dashboard.ejs', { message: req.flash('dashboardMessage'), data: user});
		});
	});

	//Post data that user changed in dashboard
	app.post('/dashboard', isLoggedIn, function(req, res) {
		User.findOne({ 'email': req.user.email }, function(err, user){
			if(err) throw err;

			user.data.starfslokAldur      = req.body.starfslokAldur;
			user.data.innistaedurLok      = req.body.innistaedurLok;
			user.data.manadarlegFjarthorf = req.body.manadarlegFjarthorf;
			user.data.raunavoxtunfram     = req.body.raunavoxtunfram;
			user.data.skatturfram         = req.body.skatturfram;
			user.data.personuafslattur    = req.body.personuafslattur;
			user.save(function(err, updatedUser){
				if(err) throw err;

				res.render('dashboard.ejs', { message: req.flash('dashboardMessage'), data: updatedUser });	
			})
		});
	});

	//Get sameign
	app.get('/sameign', isLoggedIn, function(req, res) {
		User.findOne({ 'email': req.user.email }, function(err, user){
			res.render('sameign.ejs', { message: req.flash('dashboardMessage'), data: user});
		});
	});

	//Get sereign
	app.get('/sereign', isLoggedIn, function(req, res) {
		User.findOne({ 'email': req.user.email }, function(err, user){
			res.render('sereign.ejs', { message: req.flash('dashboardMessage'), data: user});
		});
	});

	app.get('/sereignAdd', isLoggedIn, function(req, res) {
		User.findOne({ 'email': req.user.email }, function(err, user){
			if(err) throw err;
			
			res.render('components/sereignAdd.ejs', { message: req.flash('dashboardMessage'), data: user});
		});
	});

	app.post('/sereignAdd', isLoggedIn, function (req, res) { 
		User.findOne({ 'email': req.user.email }, function(err, user){
			if(err) throw err;
			var newSereign = {
				name            : req.body.name,
				eignNu          : req.body.eignNu,
				innleggMan      : req.body.innleggMan,
				utgreidslahefst : req.body.utgreidslahefst,
				utgreidslutimi  : req.body.utgreidslutimi
			};
			user.sereign.push(newSereign);
			user.save(function(err, updatedUser){
				if(err) throw err;
			
				res.render('sereign.ejs', {message: req.flash('dashboardMessage'), data: user});
			});
		});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
