$(document).ready(function() {
	$('form#domain-form').submit(function(event) {
		var domain = $('input.domain').val();
		console.log(domain);
		console.log("domain is:" + domain);
		$.ajax({
			method: "POST",
			contentType: "application/x-www-form-urlencoded",
			data: {
				domain: domain
			},
			dataType: 'json',
			url: '/api/crawl',
			success: function(response, textStatus, jqXHR) {
				// if (err) console.log(err);
				console.log("yay");
				if (response.redirect) {
					// response.redirect contains the string URL to redirect to
					window.location.href = response.redirect;
				}
			}
		});

		event.preventDefault();
	});
});
