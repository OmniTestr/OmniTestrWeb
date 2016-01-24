
$(function() {
	$('#logout').click(function() {
		$.ajax({
			method: "POST",
			url: "/api/logout",
			dataType: "json",
			success: function(resp) {
				if (resp.redirect)
					window.location.href = resp.redirect;
			}
		});
	});
});