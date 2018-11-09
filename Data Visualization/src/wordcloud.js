var targeted_data = goodwords;
	
<!-- word cloud begins -->
//var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10},{"text":"electricity","size":15},{"text":"movement","size":10},{"text":"relation","size":5},{"text":"things","size":10},{"text":"force","size":5},{"text":"ad","size":5},{"text":"energy","size":85},{"text":"living","size":5},{"text":"nonliving","size":5},{"text":"laws","size":15},{"text":"speed","size":45},{"text":"velocity","size":30},{"text":"define","size":5},{"text":"constraints","size":5},{"text":"universe","size":10},{"text":"physics","size":120},{"text":"describing","size":5},{"text":"matter","size":90},{"text":"physics-the","size":5},{"text":"world","size":10},{"text":"works","size":10},{"text":"science","size":70},{"text":"interactions","size":30},{"text":"studies","size":5},{"text":"properties","size":45},{"text":"nature","size":40},{"text":"branch","size":30},{"text":"concerned","size":25},{"text":"source","size":40},{"text":"google","size":10},{"text":"defintions","size":5},{"text":"two","size":15},{"text":"grouped","size":15},{"text":"traditional","size":15},{"text":"fields","size":15},{"text":"acoustics","size":15},{"text":"optics","size":15},{"text":"mechanics","size":20},{"text":"thermodynamics","size":15},{"text":"electromagnetism","size":15},{"text":"modern","size":15},{"text":"extensions","size":15},{"text":"thefreedictionary","size":15},{"text":"interaction","size":15},{"text":"org","size":25},{"text":"answers","size":5},{"text":"natural","size":15},{"text":"objects","size":5},{"text":"treats","size":10},{"text":"acting","size":5},{"text":"department","size":5},{"text":"gravitation","size":5},{"text":"heat","size":10},{"text":"light","size":10},{"text":"magnetism","size":10},{"text":"modify","size":5},{"text":"general","size":10},{"text":"bodies","size":5},{"text":"philosophy","size":5},{"text":"brainyquote","size":5},{"text":"words","size":5},{"text":"ph","size":5},{"text":"html","size":5},{"text":"lrl","size":5},{"text":"zgzmeylfwuy","size":5},{"text":"subject","size":5},{"text":"distinguished","size":5},{"text":"chemistry","size":5},{"text":"biology","size":5},{"text":"includes","size":5},{"text":"radiation","size":5},{"text":"sound","size":5},{"text":"structure","size":5},{"text":"atoms","size":5},{"text":"including","size":10},{"text":"atomic","size":10},{"text":"nuclear","size":10},{"text":"cryogenics","size":10},{"text":"solid-state","size":10},{"text":"particle","size":10},{"text":"plasma","size":10},{"text":"deals","size":5},{"text":"merriam-webster","size":5},{"text":"dictionary","size":10},{"text":"analysis","size":5},{"text":"conducted","size":5},{"text":"order","size":5},{"text":"understand","size":5},{"text":"behaves","size":5},{"text":"en","size":5},{"text":"wikipedia","size":5},{"text":"wiki","size":5},{"text":"physics-","size":5},{"text":"physical","size":5},{"text":"behaviour","size":5},{"text":"collinsdictionary","size":5},{"text":"english","size":5},{"text":"time","size":35},{"text":"distance","size":35},{"text":"wheels","size":5},{"text":"revelations","size":5},{"text":"minute","size":5},{"text":"acceleration","size":20},{"text":"torque","size":5},{"text":"wheel","size":5},{"text":"rotations","size":5},{"text":"resistance","size":5},{"text":"momentum","size":5},{"text":"measure","size":10},{"text":"direction","size":10},{"text":"car","size":5},{"text":"add","size":5},{"text":"traveled","size":5},{"text":"weight","size":5},{"text":"electrical","size":5},{"text":"power","size":5}];
var frequency_list = goodwords[0]; //initial data to display 

var color = d3.scale.linear()
		.domain([0,1,2,3,4,5,6,10,15,20,100])
		.range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

//initialize canvas 1
var canvas1 = d3.select("#canvas1").append("svg")
				.attr("width", 1000)
				.attr("height", 400)
				.append("g")
				.attr("transform", "translate(450,250)");
//initialize canvas 2
var canvas2 = d3.select("#canvas2").append("svg")
				.attr("width", 1000)
				.attr("height", 200);
//initialize cloud layout for words
var layout_1 = d3.layout.cloud().size([1000, 400]);

function drawCloud(frequency_list){
	layout_1
		.words(frequency_list)
		.rotate(0)
		.fontSize(function(d) { return d.size; })
		.on("end", draw)
		.start();}
//initialize display of word cloud
drawCloud(frequency_list);

<!-- dropbox selector begins -->
d3.select('#option')
	.on('change', function() {	
	//var data = eval(d3.select(this).property('value'));
	var sect = document.getElementById("option");
	var section = sect.options[sect.selectedIndex].value;
	if(section == "negative") targeted_data = badwords;
	if(section == "positive") targeted_data = goodwords;
	drawCloud(targeted_data[0]);
	resetTimeLabel();
	startTransition();
	})
<!-- dropbox selector ends -->

function draw(words) {
	//var data_1 = words.slice(0, words.length - 55);
	//var data_2 = words.slice(words.length - 55, words.length);
	 canvas1.selectAll("text").remove(); //remove the text(content) of svg
	 
	 canvas1.selectAll("text")
			.data(words)
			.enter().append("text")
			.attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
			.style("font-size", function(d) { return d.size + "px";})
			.style("fill", function(d, i) { return color(i); })
			.text(function(d) { return d.text; })
}
<!-- word cloud ends -->

<!-- horizontal line construction begins -->
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
	width = 960 - margin.right,
	height = 100 - margin.top - margin.bottom;

// change me (in Building Blocks) to see how the path description changes
var line_height = 340*2+250;
var line_data = [  
  {'x': 1, 'y': line_height}, 
  {'x': 1000, 'y': line_height},
];

var x_scale = d3.scale.linear().domain([0,width]).range([0, 960]);
var y_scale = d3.scale.linear().domain([0,width]).range([300, 0]);
 
var line = d3.svg.line()
			 .x(function(d) { return x_scale(d['x']); })
			 .y(function(d) { return y_scale(d['y']); });
			 
//canvas2.selectAll('text').remove();
var path = canvas2.append('path').attr('d', line(line_data));
<!-- horizontal line construction ends -->


<!-- time frame label begins -->
// Add the time frame label; the value is set on transition.
var label = canvas2.append("text")
	.attr("class", "time label")
	.attr("text-anchor", "end")
	.attr("y", 180)
	.attr("x", width)
	.text(1);
// Add an overlay for the year label.
var box = label.node().getBBox();

var overlay = canvas2.append("rect")
	.attr("class", "overlay")
	.attr("x", box.x)
	.attr("y", box.y)
	.attr("width", box.width)
	.attr("height", box.height)
	.on("mouseover", enableInteraction);

function resetTimeLabel(){
	label.text(1);
}
<!-- time frame label ends -->

startTransition();
// Start a transition that interpolates the data based on time_frame.
function startTransition(){
	canvas1.transition()
	  .duration(10000)
	  .ease("linear")
	  .tween("time_frame", tweenYear) 
	  .each("end", enableInteraction);
}
// After the transition finishes, you can mouseover to change the time_frame.
function enableInteraction() {
	var timeScale = d3.scale.linear()
		.domain([1, 12])
		.range([box.x + 10, box.x + box.width - 10])
		.clamp(true);

	// Cancel the current transition, if any.
	canvas1.transition().duration(0);

	overlay
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.on("mousemove", mousemove)
		.on("touchmove", mousemove);

	function mouseover() {
	  label.classed("active", true);
	}

	function mouseout() {
	  label.classed("active", false);
	}

	function mousemove() {
	  displayTime(timeScale.invert(d3.mouse(this)[0]));
	}
}

// Updates the display to show the specified time_frame
function displayTime(time_frame) {
	label.text(Math.floor(time_frame));
	//drawCloud(total_data[ Math.round(time_frame -1)]);
	drawCloud(targeted_data[ Math.floor(time_frame -1)]);
}


// For the interpolated data, the words and time_frame label are redrawn.
function tweenYear() {
	var time_frame = d3.interpolateNumber(1, 12); // here it is a float
	return function(t) { displayTime(time_frame(t)); };
}