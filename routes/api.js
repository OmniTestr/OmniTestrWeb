var express = require('express');
var router = express.Router();

/*
 * Handle Parameters
 */
router.handleResourceId = function(req, res, next, resource_id) {
	// getRequests(req, res, true, false, function(err, requests) {
	// 	if (err) next(err);
	// 	else {
	// 		// Lookup the id in this list of requests
	// 		for(var i = 0; i < requests.length; i++) {
	// 			if(requests[i]._id == request_id) {
	// 				req.request = requests[i];
	// 				req.next_request_id = (i < requests.length - 1 ? requests[i+1]._id : undefined);
	// 				req.prev_request_id = (i > 0 ? requests[i-1]._id : undefined);
	// 				next();
	// 			}
	// 		}
	// 		if (req.request == undefined)
	// 			next();
	// 	}
	// });
	next();
}

router.crawlDomain = function(req, res) {
	var domain = req.body.domain;
	var response = {};

	console.log('Should parse: ' + domain);

	for (var o in res.storeddata)
		delete res.storeddata[o];
	res.storeddata.isrunning = true;
	res.storeddata.domain = domain;
	res.storeddata.starttime = new Date();
	// TODO

	// Insert sample testing data
	res.storeddata.totalStatusCode = {
		'404':200,
		'200':213,
		'300':214,
		'100':214
	};
	res.storeddata.resourceTable = {   
		'google.com/ahrep': {
			error: 0.134124,
			time: 132.122141
		},
		'google.com/kfljkdskafdjsal': {
			error: 0.134124,
			time: 132.122141
		},
		'google.com/egwef': {
			error: 0.42,
			time: 121
		}
	}
	res.storeddata.frequencyBin = [
		{
			time: -1,
			count: {
				'404':200,
				'200':213,
				'312':12
			}
		},
		{
			time: -2,
			count: {
				'404':130,
				'200':93,
				'123':90
			}
		}
	]
	res.storeddata.reqPerTime = {
		'5':23,
		'10':42,
		'15':42
	}

	// Format/Sort the resource table
	var resources = [];
	for (var resource in res.storeddata.resourceTable) {
		resources.push({
			resource: resource,
			error: res.storeddata.resourceTable[resource].error,
			time: res.storeddata.resourceTable[resource].time
		});
	}
	resources.sort(function(a, b) {
		return (a.error < b.error ? 1 : -1);
	});
	res.storeddata.resourceTable = resources;

	// Sort the freq table
	res.storeddata.frequencyBin.sort(function(a, b) {
		return (a.time < b.time ? -1 : 1);
	});

	// Calculate the overall statistics

	// Requests per second
	var nrequests = 0;
	for(var time in res.storeddata.reqPerTime) {
		nrequests += res.storeddata.reqPerTime[time];
	}
	var totaltime = (new Date().getTime() - new Date(res.storeddata.starttime).getTime() + 1);
	res.storeddata.reqpersec = nrequests/totaltime;

	// Avg. Req. Time + error rate
	var totalreqtime = 0;
	var totalerrorrate = 0;
	var n = 0;
	for(var i = 0; i < res.storeddata.resourceTable.length; i++) {
		var resource = res.storeddata.resourceTable[i];
		totalreqtime += resource.time;
		totalerrorrate += resource.error;
		n++;
	}
	res.storeddata.avgreqtime = totalreqtime/n;
	res.storeddata.errorrate = totalerrorrate/n;

	response.redirect = '/dashboard';
	res.send(JSON.stringify(response));
}

/*
 * POST Requests
 */
router.logout = function(req, res) {
	req.logout();
	req.flash('loginFlash', { text: 'You have been logged out.', class: 'success'});
	res.end(JSON.stringify({redirect: '/login'}));
}

module.exports = router;

