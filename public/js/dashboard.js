$(document).ready(function() {

	var gauge_chart = c3.generate({
		bindto: '#gauge-chart',
	    data: {
	        columns: [
	            ['Percent Complete', 0]
	        ],
	        type: 'gauge',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    },
	    color: {
	        pattern: ['#C94756', '#FF9500', '#FFCC00', '#8BE89D'], // the three color levels for the percentage values.
	        threshold: {
	            values: [25, 50, 75, 100]
	        }
	    },
	    size: {
	        height: 180
	    }
	});

	function updateGauge(percent) {
		gauge_chart.load({
			columns: [['Percent Complete', percent]]
	    });
	}

	setTimeout(function() {
		updateGauge(20);
		setTimeout(function() {
			updateGauge(40);
			setTimeout(function() {
				updateGauge(60);
				setTimeout(function() {
					updateGauge(80);
					setTimeout(function() {
						updateGauge(100);
						markAsFinished();
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	}, 1000);

	var time_chart = c3.generate({
		bindto: '#linegram',
	    data: {
	        json: [
				{time: 100, freq: 345},
				{time: 200, freq: 125},
				{time: 300, freq: 355},
				{time: 400, freq: 445}
	        ],
	        keys: {
	        	x: 'time',
	        	value: ['freq'],
	        },
	        names: {
	        	freq: 'Frequency'
	        },
	        types: {
	            freq: 'area-spline'
	        }
	    },
        axis: {
        	x: {
        		label: {
        			text: 'Time Per Request (ms)',
        			position: 'outer-center'
        		}
        	}
        },
        legend: {
        	hide: true
        },
        tooltip: {
        	title: function(d) {console.log(d); return ""}
        },
	    color: {
	    	pattern: ['#8BE89D']
	    }
	});

	function updateLinegram(json) {
		time_chart.load({
			json: json,
	        keys: {
	        	x: 'time',
	        	value: ['freq'],
	        },
	        names: {
	        	freq: 'Frequency'
	        },
	        types: {
	            freq: 'area-spline'
	        }
		});
	}

	function updateNumericField(key, val) {
		$('.' + key + ' .numericvalue').text(val);
	}

	setTimeout(function() {
		updateLinegram([
			{time: 100, freq: 300},
			{time: 150, freq: 500},
			{time: 250, freq: 100},
			{time: 125, freq: 450}
		]);
		updateNumericField('num-reqpersec', '20.0');
		updateNumericField('num-reqtime', '232ms');
		updateNumericField('num-elapsedtime', '10:31');
		updateNumericField('num-errorrate', '2.4%');
	}, 2000);

	function markAsFinished() {
		$('.live-button').removeClass('live').text('DONE');
	}
});