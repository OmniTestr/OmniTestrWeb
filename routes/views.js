var express = require('express');
var router = express.Router();

router.index = function(req, res, next) {
  res.redirect('/dashboard');
};

router.renderLogin = function(req, res) {
	res.render('login.jade', {
		title: 'Login', 
		messages: req.flash('loginFlash'), 
		links: [
			{ text: "Login", href: "/login", icon: "sign-in", active: true },
			{ text: "Register", href: "/register", icon: "user-plus" }
		],
		hideLogout: true
	});
}

router.renderDashboard = function(req, res) {
	if (res.storeddata && res.storeddata.domain) {
		res.render('dashboard.jade', {
			title: "Dashboard",
			links: [
				{ text: "Dashboard", href: "/dashboard", icon: "tachometer", active: true },
				{ text: "Configuration", href: "/configure", icon: "cog" },
				{ text: "Logout", href: "/logout", icon: "sign-out" }
			],
			live: res.storeddata.isrunning,
			messages: req.flash('dashboardFlash')
		});
	}
	else
		res.redirect('/configure');
}

router.renderConfigure = function(req, res) {
	console.log(res.storeddata);
	res.render('configure.jade', {
		title: "Configuration",
		links: [
			{ text: "Dashboard", href: "/dashboard", icon: "tachometer" },
			{ text: "Configuration", href: "/configure", icon: "cog", active: true },
			{ text: "Logout", href: "/logout", icon: "sign-out" }
		],
		domain: (res.storeddata ? res.storeddata.domain : null),
		messages: req.flash('configureFlash')
	});
}

router.renderResource = function(req, res) {
	res.render('resource.jade', {
		title: "Resource",
		links: [
			{ text: "Dashboard", href: "/dashboard", icon: "tachometer" },
			{ text: "Configuration", href: "/configure", icon: "cog" },
			{ text: "Logout", href: "/logout", icon: "sign-out" }
		],
		live: true,
		messages: req.flash('resourceFlash')
	});
}

module.exports = router;

