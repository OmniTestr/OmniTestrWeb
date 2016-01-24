$(document).ready(function() {

	var socket = io('http://localhost:3000');
	socket.on('news', function (data) {

		updateNumericField('num-reqpersec', data.reqpersec.toFixed(1));
		updateNumericField('num-reqtime', data.avgreqtime.toFixed(0) + 'ms');
		updateNumericField('num-elapsedtime', getTimeSince(new Date(data.starttime)));
		updateNumericField('num-errorrate', data.errorrate.toFixed(1) + '%');

		// Insert resources into table
		$(".table").find('tbody').html("");
		for (var i = 0; i < data.resourceTable.length; i++) {
			var resource = data.resourceTable[i];
			$(".table").find('tbody').append('<tr><td><a href="//' + resource.resource + '">' + resource.resource + '</a></td><td>' + resource.time.toFixed(0) + 'ms</td><td>' + resource.error.toFixed(1) + '%</td></tr>');
		}

		// Update timegram chart
		var json = [];
		for (var time in data.reqPerTime) {
			var count = data.reqPerTime[time];
			json.push({
				time: parseInt(time),
				freq: count
			});
		}
		updateLinegram(json);

		// Update status code pie chart
		var cols = [];
		for(var code in data.totalStatusCode) {
			cols.push([code, data.totalStatusCode[code]]);
		}
		updatePieChart(cols);

		// Update gauge TODO
		updateGauge(50);

		// Update bar chart
		var time = [];
		var rows = [];
		var code_data = {};
		// find all times and codes
		for(var i = 0; i < data.frequencyBin.length; i++) {
			time.unshift(data.frequencyBin[i].time);
			for(var code in data.frequencyBin[i].count) {
				if(code_data[code] == undefined) code_data[code] = [];
				// code_data[code].push(data.frequencyBin[i].count[code])
			}
		}
		// console.log(code_data)
		for(var i = 0; i < data.frequencyBin.length; i++) {
			for(var code in data.frequencyBin[i].count) {
				code_data[code].unshift(data.frequencyBin[i].count[code])
			}
			for(var code in code_data) {
				if(code_data[code].length != i + 1)
					code_data[code].unshift(0);
			}
		}
		time.unshift('x');
		rows.push(time);
		for(var code in code_data) {
			code_data[code].unshift(code);
			rows.push(code_data[code]);
		}
		updateBarChart(rows, Object.keys(code_data));

	});

	function getTimeSince(date) {
		var ms = (new Date().getTime() - date.getTime());
		var min = ms/1000/60 << 0;
		var sec = Math.floor(ms/1000 % 60);
		if (sec < 10)
			sec = '0' + sec;
		if (min < 10)
			min = '0' + min;
		return min + ':' + sec;
	}

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
	    transition: {
	    	duration: 0
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

	// setTimeout(function() {
	// 	updateGauge(20);
	// 	setTimeout(function() {
	// 		updateGauge(40);
	// 		setTimeout(function() {
	// 			updateGauge(60);
	// 			setTimeout(function() {
	// 				updateGauge(80);
	// 				setTimeout(function() {
	// 					updateGauge(100);
	// 					markAsFinished();
	// 				}, 1000);
	// 			}, 1000);
	// 		}, 1000);
	// 	}, 1000);
	// }, 1000);

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
		console.log(json);
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

	// setTimeout(function() {
	// 	updateLinegram([
	// 		{time: 100, freq: 300},
	// 		{time: 150, freq: 500},
	// 		{time: 250, freq: 100},
	// 		{time: 125, freq: 450}
	// 	]);
	// 	updateNumericField('num-reqpersec', '20.0');
	// 	updateNumericField('num-reqtime', '232ms');
	// 	updateNumericField('num-elapsedtime', '10:31');
	// 	updateNumericField('num-errorrate', '2.4%');
	// }, 2000);

	function markAsFinished() {
		$('.live-button').removeClass('live').text('DONE');
	}

	var statusCodeColors = [
		'#C2FF6B',
		'#8BE89D',
		'#64A97B',//'#ACE6F6',
		'#C94756',
		'#A21738'
	];

	function statusCodeColorer(color, d) {
		var code = (d.id ? d.id : d);
		if (code && code.length > 0) {
			var i = parseInt(code[0]) - 1;
			if (i < statusCodeColors.length)
				return statusCodeColors[i];
		}
		return '#F6F6F6'; // Catch errors
	}

	var pie_chart = c3.generate({
		bindto: '#pie-chart',
	    data: {
	        columns: [
	        	['404', 30],
	        	['301', 40],
	        	['200', 10],
	        	['100', 10],
	        	['501', 10],
	        ],
	    	color: statusCodeColorer,
	        type : 'donut',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    },
	    transition: {
	        duration: 0
	    },
	    donut: {
	        // title: "Status Code Ratio"
	        // expand: false
	    }
	});

	// pie_chart.internal.loadConfig({
	//     transition: {
	//         duration: 10
	//     }
	// });

	function updatePieChart(cols) {
		// TODO
		// pie_chart.unload();
		pie_chart.load({
			columns: cols,
			unload: true
		});
	}

	// setTimeout(function() {
	// 	updatePieChart([
	// 		['404', 34],
	// 		['200', 62],
	// 		['301', 4]
	// 	]);
	// }, 1500);

	var bar_chart = c3.generate({
		bindto: '#bar-chart',
		data: {
			x: 'x',
			type: 'bar',
			columns: [
				// ['x', 0, -5, -10, -15, -20],
				// ['101', 10, 26, 22, 22, 06],
				// ['200', 8, 21, 32, 12, 16],
				// ['301', 10, 26, 22, 22, 06],
				// ['404', 2, 4, 6, 2, 3],
				// ['501', 10, 26, 22, 22, 06],
			],
			groups: [
				// ['101', '200', '301', '404', '501']
			],
	        color: statusCodeColorer
		},
	    transition: {
	        duration: 0
	    }
	});

	function updateBarChart(cols, codes) {
		console.log(cols);
		console.log(codes);
		bar_chart.load({
			columns: cols,
	        unload: true
		});
		bar_chart.internal.loadConfig({
			data: {
				groups: [
					codes
				]
			}
		});
	}

});