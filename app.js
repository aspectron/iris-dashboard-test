var fs = require('fs');
var zapp = require('iris-app');
//var BRT = require('../brt-polymer');
var ZPolymer = require('iris-polymer');
var zrpc = require('iris-rpc');
var i18n = require('iris-i18n');
var IRISIcons = require('iris-icons');
var util = require('util');
var path = require("path");
var _ = require('underscore');
var http = require("http");

function App() {
	var self = this;
	zapp.Application.apply(this, arguments);
	self.i18n = new i18n(self);
	self.httpCombiner = new zapp.HttpCombiner(self, {
		//prefix: 'combine:',
		//debug: true,
		skipCache: false,
		inlineScript: true,
		inlineCss: true,
		folders: [
			self.appFolder+'/http/',
			self.appFolder+'/http/scripts/'
		]
	});
	self.irisIcons = new IRISIcons(self, {httpCombiner: self.httpCombiner});
	self.zpolymer = new ZPolymer(self, {httpCombiner: self.httpCombiner});
	//self.BRT = new BRT(self, {httpCombiner: self.httpCombiner});


	self.on('init::express', function() {
		self.i18n.initHttp(self.app);
		//self.BRT.initHttp(self.app);
		self.httpCombiner.initHttp(self.app);
		self.app.locals._ = _;
		self.app.locals.path = path;

		self.app.get('/', function(req, res, next) {
			res.render('index', {
				config : self.config,
				isProductionMode : false
			})
		})
		self.app.use(self.express.static(path.join(self.appFolder, 'http')));
		self.zpolymer.initHttp(self.app);
		self.irisIcons.initHttp(self.app);

		self.app.use(function(err, req, res, next) {
			console.error((err instanceof Error) ? err.stack : err);
			res.status(500).render('error', {
				message: req._T ? req._T("Site under maintenance, please check back later.") : "Site under maintenance, please check back later."
			});
		});
	});
}



util.inherits(App, zapp.Application);
GLOBAL.irisApp = new App(__dirname);

