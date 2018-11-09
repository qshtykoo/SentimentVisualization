var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>positiveRatio: </strong><span class='details'>" + format(d.positiveRatio) +"</span>";
            });
	
var color = d3.scaleThreshold()
    .domain([0, 3, 20, 30, 40, 50, 70, 90, 150])
    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

    
var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 960 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom;

var countryFeature;
var datacentreFeature;
var projection = d3.geo.azimuthal()
                       .scale(300)
  .origin([-71.03,42.37])
 					   .mode('orthographic')
					   .translate([400, 300]);
					//640 400
var circle = d3.geo.greatCircle().origin(projection.origin());

// TODO fix d3.geo.azimuthal to be consistent with scale
var scale = {  orthographic: 380,  stereographic: 380,  gnomonic: 380,  
	           equidistant: 380 / Math.PI * 2,  equalarea: 380 / Math.SQRT2};

var path = d3.geo.path().projection(projection);

var svg = d3.select("#chart").append('svg:svg')
                            .attr('width', width)    
							.attr('height', height)
              .on('mousedown', mousedown);

var countries = svg.append('g')
                   .attr('width', 800)
                   .attr('height', 600)
                   .attr('id', 'countries');

var datacentres = svg.append('g')
                    .attr('width', 800)
                    .attr('height', 600)
                    .attr('id', 'datacentres');

svg.call(tip);

d3.json('DATA/datacentres.json', function(json) {
  datacentreFeature = datacentres.selectAll('g')
      .data(json.features)
      .enter()
      .append('g')
      .append('svg:circle')
         .attr('class', function(d) { return assignClass(d.properties.kgCO2e); })
         .attr('r', function(d) { return 10; })
         //return size(ballSize(d.properties.kgCO2e))
         .attr("fill", function(d) { return color((10 * Math.exp((1 - d.properties.kgCO2e), 2))); });
   datacentreFeature = datacentres.selectAll('g');

});

d3.select(window).on('mousemove', mousemove)
                 .on('mouseup', mouseup);

d3.select('select').on('change', 
function() {  
	projection.mode(this.value).scale(scale[this.value]);  
	refresh(750);
});

var m0, o0;

function mousedown() {  
	m0 = [d3.event.pageX, d3.event.pageY];  
	o0 = projection.origin();  
	d3.event.preventDefault();
}

function mousemove() {  
	if (m0) {    
		var m1 = [d3.event.pageX, d3.event.pageY], 
			o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];    
			projection.origin(o1);    
			circle.origin(o1)    
			refresh();  
	}
}

function mouseup() {  
	if (m0) {    
		mousemove();    
		m0 = null;  
	}
}

function refresh(duration) {  
	(duration ? 
		countryFeature.transition().duration(duration) 
		: countryFeature)
      .attr('d', clip);
 
  (duration ? 
		datacentreFeature.transition().duration(duration) 
    : datacentreFeature)
      .attr('transform', function (d) { return "translate(" + clip(d) + ")"; });
   
}

function clip(d) {  
	return path(circle.clip(d));
}

function ballSize (datum) {
  return (datum.kgCO2e > 1) ? 10 : (10 * Math.exp((1 - datum.kgCO2e), 2));
}  

function assignClass (datum) {
  return (datum.kgCO2e > 0.2) ? "f" : "m"; 
}

queue()
    .defer(d3.json, "DATA/world_countries.json")
    .defer(d3.tsv, "DATA/world_sentiments_combined.tsv") //both .tsv and .csv files work -- d3.csv
    .await(ready);

function ready(error, data, positiveRatio) {

  
  countryFeature = countries.selectAll('path')
    .data(data.features)
      .enter().append('svg:path')
                .attr('d', clip);
  
  countryFeature.append("svg:title").text(function(d) { return d.properties.name; }).attr('text-anchor', 'middle');
  
  var positiveRatioById = {};

  //positiveRatio.forEach(function(d) { positiveRatioById[d.id] = +d.positiveRatio; });
  positiveRatio.forEach(function(d) { positiveRatioById[d.id] = parseInt(d.positiveRatio); });
  data.features.forEach(function(d) { d.positiveRatio = positiveRatioById[d.id] });

	countryFeature
      .style("fill", function(d) { return color(positiveRatioById[d.id]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}