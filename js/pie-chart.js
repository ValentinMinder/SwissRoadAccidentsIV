(function( $ ) {
    $.fn.pieChart = function(options) {
        var settings = $.extend({
            
			// Config settings
			chartSizePercent: 55,                        // The chart radius relative to the canvas width/height (in percent)
			sliceBorderWidth: 1,                         // Width (in pixels) of the border around each slice
			sliceBorderStyle: "#fff",                    // Colour of the border around each slice
			sliceGradientColour: "#ddd",                 // Colour to use for one end of the chart gradient
			chartStartAngle:    -.5 * Math.PI,              // Start the chart at 12 o'clock instead of 3 o'clock
			collapseAnimDuration: 700,					// The duration in ms of the collapse animation
			expandAnimDuration: 1000,					// The duration in ms of the expand animation
			sliceRadiusDelta:20,
			maxDepthLevel: 2,
			emptyRadius: 60,
			middleTextFont: "20px 'Trebuchet MS', Verdana, sans-serif",
			labelDistance: 50,
			labelFont: "12px 'Trebuchet MS', Verdana, sans-serif",
			textPadding: 3,
			rootName: "Suisse",
			
        }, options );
		
		// Declare some variables for the chart
	   chartData = [];               // Chart data (labels, values, and angles)
	   chartColours = [];            // Chart colours (pulled from the HTML table)
	   totalValue = 0;                // Total of all the values in the chart
	   currentChartRadius = settings.emptyRadius;
	   slicesCount = 0;
	   animationTime = 0;
	   lastTime = new Date().getTime();
	   isAnimationRunning = false;
	   
	   depthLevel = 0;
	   hierarchy = [];
	   hierarchyArray = ["region","cantons", ""];
	   currentYear = 1997;
	   
	   window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	   
		// Get the canvas element in the page
		canvas = document.getElementById('chart');

		// Exit if the browser isn't canvas-capable
		if ( typeof canvas.getContext === 'undefined' ) return;

		// Initialise some properties of the canvas and chart
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		centreX = canvasWidth / 2;
		centreY = canvasHeight / 2;
		chartRadius = Math.min( canvasWidth, canvasHeight ) / 2 * ( settings.chartSizePercent / 100 );

		// Grab the data from the table,
		// and assign click handlers to the table data cells
		
		$.getJSON("result.json", function(data) {

			statsData = data;
			
			updateChart(settings);
			requestAnimationFrame(function(timestamp) {
						animationTime = 0;
						lastTime = new Date().getTime();
						isAnimationRunning = true;
						expandAnimationStep(timestamp, settings);
			});
			$('#chart').click ({settings: settings}, handleChartClick );
		});

		var that = this;
		$(document).on("year-change", function(e, year) {
			
			console.log(year);
			currentYear = year;
			//TODO animation
			updateChart(settings); 
		});
    };
}( jQuery ));


function getCurrentRoot() {
	
	var root = statsData.year["_" + currentYear][hierarchyArray[0]];
	for(i = 0; i < depthLevel; i++)
	{
		if(hierarchyArray[i+1] != "")
			root = root[hierarchy[i]][hierarchyArray[i+1]];
		else
			root = root[hierarchy[i]];
	}
	
	return root;
}

function updateChart(settings) {
	
	//Find the current root for the data
	var root = getCurrentRoot();
	console.log(root);
	if(depthLevel < settings.maxDepthLevel)
		fillChart(root);
	else
		fillLastLevel(root);

	// Now compute and store the start and end angles of each slice in the chart data
	var currentPos = 0; // The current position of the slice in the pie (from 0 to 1)

	for ( var slice in chartData ) {
	  chartData[slice]['startAngle'] = 2 * Math.PI * currentPos;
	  chartData[slice]['endAngle'] = 2 * Math.PI * ( currentPos + ( chartData[slice]['value'] / totalValue ) );
	  currentPos += chartData[slice]['value'] / totalValue;
	}
}

function fillChart(obj) {
	
	slicesCount = Object.keys(obj).length;
	var colorSlice = 255 / slicesCount;
	totalValue = 0;

	var currentRow = -1;
	chartData = [];
	$.each(obj, function(key, dataValue) {

		currentRow++;
		chartData[currentRow] = [];
		chartData[currentRow]['key'] = key;
		chartData[currentRow]['label'] = key; //TODO traduction
		chartData[currentRow]['value'] = dataValue.total;
		totalValue += dataValue.total;
		
		//Colors (HSL)
		chartColours[currentRow] = [colorSlice * currentRow, "80%", "80%" ];
	   
	});
	
}

function fillLastLevel(obj) {
	
	slicesCount = Object.keys(obj).length - 1; // Remove the total
	var colorSlice = 255 / slicesCount;
	totalValue = obj["total"];

	var currentRow = -1;
	chartData = [];
	$.each(obj, function(key, value) {

		if(key != "total")
		{
			currentRow++;
			chartData[currentRow] = [];
			chartData[currentRow]['key'] = key;
			chartData[currentRow]['label'] = key; //TODO traduction
			chartData[currentRow]['value'] = value;
			
			//Colors (HSL)
			chartColours[currentRow] = [colorSlice * currentRow, "80%", "80%" ];
		}
	});
	
}

function isCurrentLevelEmpty(settings)
{
	if(depthLevel == 0 || depthLevel == settings.maxDepthLevel)
		return false;
	
	var root = getCurrentRoot();
		
	return Object.keys(root).length < 2;
}


/**
   * Process mouse clicks in the chart area.
   *
   * If a slice was clicked, display detail about it
   * If the user clicked inside the empty radius, return to the previous level
   *
   * @param Event The click event
   */

  function handleChartClick ( clickEvent ) {
	  
	// If an animation is running, we ignore any click event
	if(!isAnimationRunning)
	{
		var settings = clickEvent.data.settings;

		// Get the mouse cursor position at the time of the click, relative to the canvas
		var mouseX = clickEvent.pageX - this.offsetLeft;
		var mouseY = clickEvent.pageY - this.offsetTop;

		// Was the click inside the pie chart?
		var xFromCentre = mouseX - centreX;
		var yFromCentre = mouseY - centreY;
		var distanceFromCentre = Math.sqrt( Math.pow( Math.abs( xFromCentre ), 2 ) + Math.pow( Math.abs( yFromCentre ), 2 ) );
		
		if(distanceFromCentre <= settings.emptyRadius)
		{
			if(depthLevel > 0)
			  {			  
				  do
				  {
						depthLevel--;
						hierarchy.pop();
				  }
				  while(isCurrentLevelEmpty(settings)) //Jump to a previous non-empty level
				  
				  requestAnimationFrame(function(timestamp) {
						animationTime = 0;
						isAnimationRunning = true;
						lastTime = new Date().getTime();
						collapseAnimationStep(timestamp, settings);
					});
			  }
		}
		else if ( distanceFromCentre <= chartRadius ) {

		  // Find the slice that was clicked by comparing angles relative to the chart centre.

		  var clickAngle = Math.atan2( yFromCentre, xFromCentre ) - settings.chartStartAngle;
		  if ( clickAngle < 0 ) clickAngle = 2 * Math.PI + clickAngle;
					  
		  for ( var slice in chartData ) {
			if ( clickAngle >= chartData[slice]['startAngle'] && clickAngle <= chartData[slice]['endAngle'] ) {
			  
			  console.log(chartData[slice]['key']);
			  
			  if(depthLevel < settings.maxDepthLevel)
			  {
					depthLevel++;
					hierarchy.push(chartData[slice]['key']);
				  
					while(isCurrentLevelEmpty(settings)) //Ignore any empty (less than 2 elements in array) intermediate level
					{
						var root = getCurrentRoot();
						depthLevel++;
						hierarchy.push(Object.keys(root)[0]);
					}

					requestAnimationFrame(function(timestamp) {
						animationTime = 0;
						isAnimationRunning = true;
						lastTime = new Date().getTime();
						collapseAnimationStep(timestamp, settings);
					});
			  }
			  
			  return;
			}
		  }
		}
	}
  }
  
  /*
  * 
  * timeRatio : the ratio of time for the current animation ([0, 1])
  * min : min border
  * max : max border
  * Return the result of the function for now a sin
  */
  function animationFunction(timeRatio, min, max)
  {
	  if(min <= max)
	  {
		var x = timeRatio * max + min * (1 - timeRatio);
		//console.log(x);
		//console.log(Math.sin(x));
		return Math.sin(x);
	  }
	  return NaN;
  }
  
  function collapseAnimationStep(timestamp, settings)
  {	
		// Decrease the chart radius
		currentChartRadius = (chartRadius + settings.sliceRadiusDelta * slicesCount) * animationFunction(animationTime / settings.collapseAnimDuration, Math.PI/2.0, Math.PI);

		if(animationTime >= settings.collapseAnimDuration) {

		updateChart(settings);

		requestAnimationFrame(function(timestamp) {
						animationTime = 0;
						lastTime = new Date().getTime();
						expandAnimationStep(timestamp, settings);
		});

		return;
		}

		// Draw the frame
		drawChart(settings); 

		var now = new Date().getTime();
		animationTime += now - lastTime;
		lastTime = now;
		requestAnimationFrame(function(timestamp) {
					collapseAnimationStep(timestamp, settings);
				});  
  }
  
  function expandAnimationStep(timestamp, settings) 
  {
	  
		// Increase the chart radius
		currentChartRadius = (chartRadius + settings.sliceRadiusDelta * slicesCount) * animationFunction(animationTime / settings.expandAnimDuration, 0, Math.PI/2.0);
		
		if(animationTime >= settings.expandAnimDuration) {
			isAnimationRunning = false;
		  return;
		}

		// Draw the frame
		drawChart(settings);

		var now = new Date().getTime();
		animationTime += now - lastTime;
		lastTime = now;
		requestAnimationFrame(function(timestamp) {
							expandAnimationStep(timestamp, settings);
					});
  }
  
  
  /**
   * Draw the chart.
   *
   * Loop through each slice of the pie, and draw it.
   */

  function drawChart(settings) {

    // Get a drawing context
    var context = canvas.getContext('2d');
        
    // Clear the canvas, ready for the new frame
    context.clearRect ( 0, 0, canvasWidth, canvasHeight );

    for ( var slice in chartData ) {
		drawSlice( context, slice, settings);
    }
	
	//Draw Chart Center
	context.beginPath();
	context.arc(centreX, centreY, settings.emptyRadius, 0, 2 * Math.PI, false);
	context.fillStyle = 'white';
	context.fill();
	
	context.fillStyle = 'rgb(0,0,0)';
	context.textAlign = "center";
	if(depthLevel > 0)
		context.fillText( hierarchy[depthLevel-1], centreX, centreY);
	else
		context.fillText( settings.rootName, centreX, centreY); 
	context.font = settings.middleTextFont;

  }
  
  /**
   * Draw an individual slice in the chart.
   *
   * @param Context A canvas context to draw on  
   * @param Number The index of the slice to draw
   */

  function drawSlice ( context, slice, settings) {

    // Compute the adjusted start and end angles for the slice
    var startAngle = chartData[slice]['startAngle']  + settings.chartStartAngle;
    var endAngle = chartData[slice]['endAngle']  + settings.chartStartAngle;

    // Set up the gradient fill for the slice
    var sliceGradient = context.createLinearGradient( 0, 0, canvasWidth*.75, canvasHeight*.75 );
    sliceGradient.addColorStop( 0, settings.sliceGradientColour );
    sliceGradient.addColorStop( 1, 'hsl(' + chartColours[slice].join(',') + ')' );

	var currentSliceRadius = currentChartRadius - slice * settings.sliceRadiusDelta;
	
	if(currentSliceRadius > chartRadius)
		currentSliceRadius = chartRadius;
	else if(currentSliceRadius < 0)
		currentSliceRadius = 0;
	
    // Draw the slice
    context.beginPath();
    context.moveTo( centreX, centreY );
    context.arc( centreX, centreY, currentSliceRadius, startAngle, endAngle, false );
    context.lineTo( centreX, centreY );
    context.closePath();
    context.fillStyle = sliceGradient;
    context.fill();
	
	// Style the slice border appropriately

	context.lineWidth = settings.sliceBorderWidth;
	context.strokeStyle = settings.sliceBorderStyle;

    // Draw the slice border
    context.stroke();
	
	// Draw the slice label
	var midAngle = (startAngle + endAngle) / 2;
	var textLocationX = centreX + Math.cos(midAngle) * ( chartRadius + settings.labelDistance);
	var textLocationY = centreY + Math.sin(midAngle) * ( chartRadius + settings.labelDistance);
	
	context.font = settings.labelFont;
	var textWidth = context.measureText(chartData[slice]['label']).width;
	var textHeight = 10; //MeasureText doesn't return the height ._.

	// Draw the line attached to the label
	context.beginPath();
    context.moveTo( centreX + Math.cos(midAngle) * currentSliceRadius, centreY + Math.sin(midAngle) * currentSliceRadius );
	context.lineTo( textLocationX, textLocationY );
	context.strokeStyle = "rgb(0, 0, 0)";
	context.stroke();
	
	//Draw a white rectangle around the text
	context.fillStyle = "rgb(255, 255, 255)";
	context.fillRect(textLocationX - textWidth/2 - settings.textPadding, textLocationY - textHeight - settings.textPadding, textWidth + 2 * settings.textPadding, textHeight + 2 * settings.textPadding);
	
	//Draw the text
	context.textAlign = "center";
	context.fillStyle = "rgb(0, 0, 0)"
	context.font = settings.labelFont;
	context.fillText( chartData[slice]['label'], textLocationX, textLocationY );

  }