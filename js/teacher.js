$(document).ready
(
	function()
	{
		var isRecording = false;
		var students = [];
		var student1 = '';
		var student2 = '';
		var st1_stats = {blue:0,black:0,yellow:0,green:0,red:0,orange:0};
		var st2_stats = {blue:0,black:0,yellow:0,green:0,red:0,orange:0};
		
		var playBtn = $("input[type=checkbox]").switchButton
		(
			{
				on_label: 'play',
				off_label: 'stop',
				checked: false,
				width: 50,
				height: 20
			}
		);
		
		playBtn.change
		(
			function()
			{
				function changeRecordingStatus(status)
				{
					if(status === true)
					{
						if(isRecording === false)
						{
							if(student1 !== '')
							{
								getStudentActivity(student1);				
							}

							if(student2 !== '')
							{
								getStudentActivity(student2);				
							}
						
							isRecording = true;
						}
					}
					else
					{
						isRecording = false;
					}
				}

				changeRecordingStatus($(this).is(":checked"));			
			}
		);

		function createCanvas(component)
		{
			var top = component.offset().top;
			var left = component.offset().left;
			
			function createCircle(text, colour, size)
			{
				var id = colour;
				colour += 'colour';
				var circle = $('<div class="circle ' + colour + '" id="' + component.attr('id') + id + '"><p>' + text + '</p></div>');
				circle.css('width', size);
				circle.css('height', size);
				circle.css('border-radius:', parseInt(size/2));
				circle.css('-moz-border-radius', parseInt(size/2));
				circle.css('-webkit-border-radius', parseInt(size/2));
				return circle;
			}
			
			var blue = createCircle('','blue',parseInt(0.065*component.height()));
			var black = createCircle('','black',parseInt(0.087*component.height()));
			var yellow = createCircle('','yellow',parseInt(0.054*component.height()));
			var green = createCircle('','green',parseInt(0.109*component.height()));
			var red = createCircle('','red',parseInt(0.164*component.height()));
			var orange = createCircle('','orange',parseInt(0.044*component.height()));

			blue.appendTo(component);
			black.appendTo(component);
			yellow.appendTo(component);
			green.appendTo(component);
			red.appendTo(component);
			orange.appendTo(component);

			blue.offset({top:parseInt(0.162*component.height())+top,left:parseInt(0.512*component.width())+left});
			black.offset({top:parseInt(0.102*component.height())+top,left:parseInt(0.733*component.width())+left});
			yellow.offset({top:parseInt(.284*component.height())+top,left:parseInt(0.175*component.width())+left});
			green.offset({top:parseInt(0.090*component.height())+top,left:parseInt(0.203*component.width())+left});
			red.offset({top:parseInt(0.263*component.height())+top,left:parseInt(0.308*component.width())+left});
			orange.offset({top:parseInt(0.259*component.height())+top,left:parseInt(0.640*component.width())+left});			
		}
		
		createCanvas($('#wrapper1'));
		createCanvas($('#wrapper2'));
		createChart('wrapper3', prepareChartData(st1_stats));
		createChart('wrapper4', prepareChartData(st2_stats));
		getStudents();
		
		function redrawCanvas(data)
		{
			var component = null;

			if(data.length !== 0)
			{
				if(data[0].student === student1)
				{
					component = $('#wrapper1');
				}
				else
				{
					component = $('#wrapper2');
				}				
			}
			else
			{
				return;
			}

			var item = null;
			var colour = '';
			var circle = null;
			var top = component.offset().top;
			var left = component.offset().left;
			var x = 0;
			var y = 0;
			
			for(var i in data)
			{
				item = data[i];
				colour = item.colour;
				circle = $('#' + component.attr('id') + colour);
				x = item.x / item.screenw;
				y = item.y / item.screenh;
				
				var startTop = circle.offset().top;
				var endTop = parseInt(y*component.height())+top;
				var diffTop = endTop - startTop;
				var diffTop = diffTop > 0 ? '+=' + Math.abs(diffTop) + 'px' : '-=' + Math.abs(diffTop) + 'px';
			
				var startLeft = circle.offset().left;
				var endLeft = parseInt(x*component.width())+left;
				var diffLeft = endLeft - startLeft;
				var diffLeft = diffLeft > 0 ? '+=' + Math.abs(diffLeft) + 'px' : '-=' + Math.abs(diffLeft) + 'px';

				circle.animate({top:diffTop,left:diffLeft}, 300);
				
				//update user stats
				if(data[0].student === student1)
				{
					st1_stats[colour]++;
				}
				else
				{
					st2_stats[colour]++;
				}
			}

			if(data[0].student === student1)
			{
				updateChart('wrapper3', prepareChartData(st1_stats));
			}
			else
			{
				updateChart('wrapper4', prepareChartData(st2_stats));
			}			
		}

		function getStudents()
		{
			var service = "https://apex.oracle.com/pls/apex/karkalas/demoapp/getusers/";

			var jqxhr = $.ajax
			(
				{
					url: service,
					type: 'GET',
					success: function(jqXHR, textStatus, xhr)
					{
						console.log(textStatus);

						var items = xhr.responseJSON.items;

						for(var i in items)
						{
							if(students.indexOf(items[i].student) === -1)
							{
								students.push(items[i].student);
							}
						}
						
						if(students.length < 2)
						{
							setTimeout(getStudents, 1000);
						}

						if(student1 === '' && typeof students[0] !== 'undefined')
						{
							student1 = students[0];
							$('<span>' + student1 + '</span>').appendTo($('#wrapper1'));

							if(isRecording === true)
							{
								setTimeout(function(){ getStudentActivity(student1) }, 200);
							}
						}

						if(student2 === '' && typeof students[1] !== 'undefined')
						{
							student2 = students[1];
							$('<span>' + student2 + '</span>').appendTo($('#wrapper2'));

							if(isRecording === true)
							{
								setTimeout(function(){ getStudentActivity(student2) }, 200);
							}
						}
					},
					crossDomain: true,
					error: function(jqXHR, textStatus, errorThrown)
					{
						console.log(textStatus);
					}
				}
			);
		}
			
		function getStudentActivity(student)
		{
			var service = "https://apex.oracle.com/pls/apex/karkalas/demoapp/getpositions/";
			var parameters = {};
			parameters.student = student;

			var jqxhr = $.ajax
			(
				{
					url: service,
					type: 'GET',
					success: function(jqXHR, textStatus, xhr)
					{
						console.log('recording for ' + student + ':', textStatus);
						redrawCanvas(xhr.responseJSON.items);
						deletePastData(xhr.responseJSON.items);
						
						if(isRecording === true)
						{
							setTimeout(function(){ getStudentActivity(student) }, 200);
						}
					},
					crossDomain: true,
					error: function(jqXHR, textStatus, errorThrown)
					{
						console.log(textStatus);
					},
					headers: parameters
				}
			);
		}
		
		function deletePastData(data)
		{
			if(data.length === 0)
			{
				return;
			}
			
			var max = 0;
			var item = null;
			
			for(var i in data)
			{
				item = data[i];
				ts = parseInt(item.ts);
				
				if(ts > max)
				{
					max = ts;
				}
			}
			
			var service = "https://apex.oracle.com/pls/apex/karkalas/demoapp/emptylog/";
			var parameters = {};
			parameters.ts = max;

			var jqxhr = $.ajax
			(
				{
					url: service,
					type: 'DELETE',
					success: function(jqXHR, textStatus, xhr)
					{
						console.log(textStatus);
					},
					crossDomain: true,
					error: function(jqXHR, textStatus, errorThrown)
					{
						console.log(textStatus);
					},
					headers: parameters
				}
			);	
		}
		
		function prepareChartData(data)
		{
			var values = [];
			
			for(var i in data)
			{
				values.push({label:i,value:data[i]});
			}
					
			return [ 
				{
					key: "User Stats",
					values: values
				}
			];					
		}		
				
		//function that creates histogram
		function createChart(container, data)
		{
			nv.addGraph
			(
				function()
				{  
					chart = nv.models.discreteBarChart()
					.x(function(d) { return d.label })
					.y(function(d) { return d.value })
					.staggerLabels(false)
					.tooltips(false)
					.showValues(false)
					.transitionDuration(250)
					.color(['#0000FF', '#000000', '#FFFF00', '#008000', '#FF0000', '#FFA500']);
					;

					var div = $('#' + container);
					var svg = $('#' + container + ' svg');
					svg.height(parseInt(div.height()) - 20);

					d3.select('#' + container + ' svg')
					.datum(data)
					.call(chart);

					nv.utils.windowResize(chart.update);

					return chart;
				}
			);
		}
		
		//function that updates histogram
		function updateChart(container, data)
		{
			d3.select('#' + container + ' svg')
			.datum(data)
			.call(chart);			
		}
		
		$('#demo').click
		(
			function()
			{
				window.open('demo.html', 'Student Demo', 'fullscreen=yes');
				return false;
			}
		);
	}
);
