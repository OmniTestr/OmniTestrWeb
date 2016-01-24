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

/*
 * POST Requests
 */
router.logout = function(req, res) {
	req.logout();
	req.flash('loginFlash', { text: 'You have been logged out.', class: 'success'});
	res.end(JSON.stringify({redirect: '/login'}));
}

module.exports = router;

