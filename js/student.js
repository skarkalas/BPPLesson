$(document).ready
(
	function()
	{
		var studentname = null;
		var blue = createCircle('','blue',parseInt(0.065*$(window).height()));
		var black = createCircle('','black',parseInt(0.087*$(window).height()));
		var yellow = createCircle('','yellow',parseInt(0.054*$(window).height()));
		var green = createCircle('','green',parseInt(0.109*$(window).height()));
		var red = createCircle('','red',parseInt(0.164*$(window).height()));
		var orange = createCircle('','orange',parseInt(0.044*$(window).height()));

		blue.appendTo('div#wrapper');
		black.appendTo('div#wrapper');
		yellow.appendTo('div#wrapper');
		green.appendTo('div#wrapper');
		red.appendTo('div#wrapper');
		orange.appendTo('div#wrapper');

		blue.offset({top:parseInt(0.162*$(window).height()),left:parseInt(0.512*$(window).width())});
		black.offset({top:parseInt(0.102*$(window).height()),left:parseInt(0.733*$(window).width())});
		yellow.offset({top:parseInt(.284*$(window).height()),left:parseInt(0.175*$(window).width())});
		green.offset({top:parseInt(0.090*$(window).height()),left:parseInt(0.203*$(window).width())});
		red.offset({top:parseInt(0.263*$(window).height()),left:parseInt(0.308*$(window).width())});
		orange.offset({top:parseInt(0.259*$(window).height()),left:parseInt(0.640*$(window).width())});

		var dialog = $("#dialog");
		dialog.dialog
		(
			{
				bgiframe: true,
				autoOpen: true,
				height: 230,
				width: 500,
				title: "Student Details",
				show: "slow",
				hide: "fade",
				resizable: false,
				modal: true,
				closeOnEscape: true,
				buttons:
				{
        			Ok: function()
        			{
						var value = $('#studentname').val();
						var checkname = /^[a-z]+$/i;

						if(checkname.test(value) === true)
						{
							//register student name
							studentname = value;
							
							//log circles' data
							$('.circle').each
							(
								function()
								{
									logPosition($(this));
								}
							);
							
							$('p#errormsg').html('');
							$(this).dialog("close");
						}
						else
						{
							$('p#errormsg').html('Type only letters please!');
						}
					}
				}
			}
		);
		
		function createCircle(text, colour, size)
		{
			var id = colour
			colour += 'colour';
			var circle = $('<div class="circle ' + colour + '" id="' + id + '"><p>' + text + '</p></div>');
			circle.css('width', size);
			circle.css('height', size);
			circle.css('border-radius:', parseInt(size/2));
			circle.css('-moz-border-radius', parseInt(size/2));
			circle.css('-webkit-border-radius', parseInt(size/2));
			return circle;
		}
		
		//make all circles draggable
		$('div.circle').draggable
		(
			{
				containment: 'parent',
				drag: function()
				{
//					$('div.circle').each
//					(
//						function()
//						{
							logPosition($(this));
//						}
//					);
				}
			}
		);
		
		function logPosition(circle)
		{
			var service = "https://apex.oracle.com/pls/apex/karkalas/demoapp/logposition/";
			var parameters = {};
			parameters.student = studentname;
			parameters.ts = new Date().getTime();
			parameters.colour = circle.attr('id');
			parameters.diameter = parseInt(circle.css('width'));
			parameters.x = circle.offset().left;
			parameters.y = circle.offset().top;
			parameters.screenw = $(window).width();
			parameters.screenh = $(window).height();

			//update remoter db
			var jqxhr = $.ajax
			(
				{	url: service,
					type: 'POST',
					success: function(jqXHR, textStatus, xhr)
					{
						console.log(textStatus);
					},
					crossDomain: true,
					error: function(jqXHR, textStatus, errorThrown)
					{
						console.log(textStatus);
					},
					data: parameters
				}
			);
		}		
	}
);
