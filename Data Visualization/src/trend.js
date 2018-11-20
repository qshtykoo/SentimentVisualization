// layout
var bubbleWidth = 400,
    bubbleHeight = 550;
var lineSvgWidth = window.innerWidth - bubbleWidth,
    lineSvgHeight = bubbleHeight;

var margin = {top:50, right:50, bottom:60, left:50};

var lineChartSize = {width: lineSvgWidth - margin.left - margin.right,
                height: lineSvgHeight - margin.top - margin.bottom};

var svg = d3.select("#hashtag_line")
            .attr('width', lineSvgWidth)
            .attr('height', lineSvgHeight);
var chart = svg.append("g")
            .attr("id", "lineChart")
            .attr("width", lineChartSize.width)
            .attr("height", lineChartSize.height)
            .attr("transform", "translate("+margin.left+","+margin.top+")");

//y axis title
chart.append("text")
    .attr("class", "title axis")
    .attr("x", 0)
    .attr("y", -10)
    .text("Hashtag")
    .attr("text-anchor", "middle");
chart.append("text")
    .attr("x", lineChartSize.width)
    .attr("y", -10)
    .attr("class", "title axis")
    .attr("id", "emojiAxisTitle")
    .text("emoji")
    .attr("text-anchor", "middle");

//label for bubble chart
d3.select("#emoji_bubble").append("text")
    .attr("x", bubbleWidth/2)
    .attr("class", "title")
    .attr("y", 40)
    .text("SELECTED")
    .attr('text-anchor', 'middle');
d3.select("#emoji_bubble").append("text")
    .attr("class", "title")
    .attr("x", bubbleWidth/2)
    .attr("y", bubbleHeight-20)
    .text("UNSELECTED")
    .attr('text-anchor', 'middle');

// tooltip for bubble chart
var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

function hashtagLineChart(hashtag){
    // data
    var hashtag_data = data["hashtag_time"][hashtag]

    // in case of resize
    lineSvgWidth =  window.innerWidth - bubbleWidth - 50;
    lineChartSize.width = lineSvgWidth - margin.left - margin.right;
    svg.attr('width', lineSvgWidth);
    chart.attr('width', lineChartSize.width);
    svg.select("#emojiAxisTitle").attr("x", lineChartSize.width);
        
    
    svg.selectAll(".axis.hashtag").remove();
    svg.selectAll(".line.hashtag").remove();
    svg.selectAll(".title.hashtag").remove();
    svg.selectAll(".x.axis").remove();
    // console.log(d3.extent(hashtag_data, function(d){return new Date(d.time);}));
    // axis
    var xScale = d3.time.scale()
                    .range([0, lineChartSize.width])
                    .domain(d3.extent(hashtag_data, function(d){return new Date(d.time);}));
    var xAxis = d3.svg.axis().scale(xScale)
                .orient("bottom");

    var hashtagScale = d3.scale.linear()
                    .range([lineChartSize.height, 0])
                    .domain([0, d3.max(hashtag_data, function(d){return d.count})]);
    var hashtagAxis = d3.svg.axis().scale(hashtagScale)
                .orient("left");
    
    var trendLine = d3.svg.line()
                    .interpolate("basis") //smooth the line
                    .x(function(d) {return xScale(d.time)})
                    .y(function(d) {return hashtagScale(d.count)});
    
    chart.append("path")
        .attr("class", "line hashtag")
        .attr("d", trendLine(hashtag_data))
        .style("stroke", "black");
    
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+lineChartSize.height+")")
        .call(xAxis);
    chart.append("g")
        .attr("class", "y axis hashtag")
        .call(hashtagAxis);


   
    // console.log("translate("+legendWidth*(i+1)+","+(chartSize.height+10)+')');
    chart.append("text")
        .text("Trend of #"+hashtag)
        .attr("class", "hashtag title")
        .attr("x", lineChartSize.width/2)
        .attr("y", -20)
        // .attr('text-anchor', 'middle')
        .style("font-size", "30px")
        .attr("text-anchor", "middle");
    
    
}

function emojiLineChart(hashtag, emojis){

    var legendWidth = lineChartSize.width / (emojis.length+1);
    
    // data
    var hashtag_data = data["hashtag_time"][hashtag];
    var emoji_dataset = d3.select("#emoji_dataset")
                        .on("change", function(){emojiLineChart(hashtag, emojis);})
                        .property("value");

    //color 
    var color = d3.scale.category10();

    var svg = d3.select("#hashtag_line");
    svg.selectAll('.line.emoji').remove();
    svg.selectAll(".axis.emoji").remove();
    svg.selectAll('.legend.emoji').remove();

    var chart = d3.select("#lineChart");

    // clear existing chart
    // clear(svg);
    
    // svg.selectAll(".legend").remove();
    // svg.selectAll(".axis").remove();
    // console.log(svg.selectAll('.line'));
    // console.log(d3.extent(hashtag_data, function(d){return new Date(d.time);}));
    // axis
    var yMax = 0;
    emojis.forEach(function(emoji){
        var emoji_data = data["hashtag_emoji_time"][hashtag][emoji]
        if (emoji_dataset == "count"){
            yMax = d3.max([yMax, d3.max(emoji_data, function(d){return d["count"];})])
        }
        else{
            yMax = d3.max([yMax, d3.max(emoji_data, function(d){return d["proportion"];})])
        }
        
    })
    var xScale = d3.time.scale()
                .range([0, lineChartSize.width])
                .domain(d3.extent(hashtag_data, function(d){return new Date(d.time);}));

    var emojiScale = d3.scale.linear()
                    .range([lineChartSize.height, 0])
                    .domain([0, yMax]);             
    var emojiAxis = d3.svg.axis().scale(emojiScale)
                .orient("right");
    
    var trendLine = d3.svg.line()
                    .interpolate("basis") //smooth the line
                    .x(function(d) {return xScale(d.time)});
    if (emoji_dataset == "count"){
        trendLine.y(function(d) {return emojiScale(d.count);});
    }
    else{
        trendLine.y(function(d) {return emojiScale(d.proportion);});
    }
    emojis.forEach(function(emoji, i){
        var emoji_data = data["hashtag_emoji_time"][hashtag][emoji]
        chart.append("path")
            .attr("class", "line emoji")
            .attr("d", trendLine(emoji_data))
            .style("stroke", color(i));
        //legend
        var legend = chart.append('g')
                        .attr("class", "legend emoji")
                        .attr("transform", "translate("+legendWidth*(i+1)+","+(lineChartSize.height+40)+')');
        // console.log("translate("+legendWidth*(i+1)+","+(chartSize.height+10)+')');
        legend.append("text")
            .text(emoji)
            // .attr('text-anchor', 'middle')
            .style("font-size", "20px")
            .attr("x", 0)
            .attr("y", 20/2.75);
        legend.append("rect")
            .attr("fill", color(i))
            .attr("x", -20)
            .attr("y", -6)
            .attr("width", 12)
            .attr("height", 12)
            .attr("stroke", "gray");
            // .attr("class", "legend")
    });

    // chart.append("path")
    //     .attr("class", "line")
    //     .attr("d", trendLine(emoji_data));
    // axis for emoji
    chart.append("g")
        .attr("class", "y axis emoji")
        .attr("transform", "translate("+lineChartSize.width+",0)")
        .call(emojiAxis);


}

function bubbleChart(hashtag){
    var width = bubbleWidth;
    var height = bubbleHeight;

    var unselectedCenter = {x: width/2, y: height*3/4};
    var selectedCenter = {x: width/2, y:height*1/5};

    var svg = d3.select("#emoji_bubble")
                .attr("width", width)
                .attr("height", height);
    var bubbles = null;
    var node = null;

    var selectedEmojis = [];

    var damper = 0.102;

    // clear
    
    svg.selectAll('.node').remove();

    function charge(d) {
        return -Math.pow(sizeScale(d.count), 2.0)/12;
    }

    function clickEmoji(d){
        var exist = selectedEmojis.includes(d.emoji);
        if (exist == true){
            var index = selectedEmojis.indexOf(d.emoji);
            selectedEmojis.splice(index,1);
        }
        else
        {
            // console.log(selectedEmojis);
            // console.log("click: "+selectedEmojis.length);
            if (selectedEmojis.length == 10){  //full
                selectedEmojis.shift();
            }
            selectedEmojis.push(d.emoji);
        }
        // force.nodes(emoji_data)  // ????????
        //     .on("tick", moveToCenter);
        force.start();
        // console.log(selectedEmojis);
        emojiLineChart(hashtag, selectedEmojis);
    }

    // try to change these parameters later
    var force = d3.layout.force()
        .charge(charge)
        .size([width, height])
        .gravity(0.1);
        // .friction(0.8);

    var sizeScale = d3.scale.pow()
        .exponent(0.5)
        .range([15, 50]);

    function createNodes(rawData) {
        var myNodes = rawData.map(function(d){
            return d;
            // to be finished
        });

        return myNodes;
    }

    function moveToCenter(e){
        bubbles.each(function(d){
            if (selectedEmojis.includes(d.emoji)){
                d.x = d.x + (selectedCenter.x - d.x)*damper*e.alpha;
                d.y = d.y + (selectedCenter.y - d.y)*damper*e.alpha;
            }
            else{
                d.x = d.x + (unselectedCenter.x - d.x)*damper*e.alpha;
                d.y = d.y + (unselectedCenter.y - d.y)*damper*e.alpha;

            }
            
        })
            .attr("transform", function(d){
                return "translate("+d.x+","+d.y+")";
            });
    }

    var emoji_data = data["hashtag_emoji_count"][hashtag];

    var maxCount = d3.max(emoji_data, function(d){return d.count;});

    sizeScale.domain([0, maxCount]);

    force.nodes(emoji_data)  // ????????
        .on("tick", moveToCenter);

    // bubbles = svg.selectAll(".bubble")
    //     .data(emoji_data)
    //     .enter().append('circle')
    //         .attr("cx", function(d){return d.x;})
    //         .attr("cy", function(d){return d.y;})
    //         .attr("class", "node")
    //         .attr("r", function(d) {return sizeScale(d.count);})
    //         .call(force.drag);
    
    bubbles = svg.selectAll(".bubble")
        .data(emoji_data)
        .enter().append('g')
            // .attr("transform", "translate("+d.x+","+d.y+")")
            // .attr("cx", function(d){return d.x;})
            // .attr("cy", function(d){return d.y;})
            .attr("class", "node")
            // .attr("r", function(d) {return sizeScale(d.count);})
            .call(force.drag);

    bubbles.append("text")
        .text(function(d){return d.emoji;})
        .attr("y", function(d){return sizeScale(d.count)/2.75})
        .attr("text-anchor", "middle")
        .attr("font-size", function(d){return sizeScale(d.count)+"px";})
        .on("click", clickEmoji)
        .on("mouseover",function(d){
            // console.log(div);
            div.transition()
                .delay(900)
                .duration(500)
                .style("opacity", .9);
            div.text("count: "+d.count)
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
            // console.log((d3.event.pageX) + "px");
        })
        .on("mouseout",function(d){
            div.style("opacity", 0);
        });

    force.start();



    emojiLineChart(hashtag, selectedEmojis);

}

function changeHashtag(){
    var hashtag = d3.select("#hashtag_selector").property("value");
    hashtagLineChart(hashtag);
    bubbleChart(hashtag);
}

var hashtags = data["hashtags"];

var select = d3.select("#hashtag_selector")
                .on("change", changeHashtag);
var options = select.selectAll("option")
            .data(hashtags).enter()
            .append("option")
                .attr("value", function(d){return d.hashtag;})
                .text(function(d){return d.hashtag;});
// changeHashtag();
hashtagLineChart("VideoMTV2017");
bubbleChart("VideoMTV2017");
// emojiLineChart("SHINee", ["😭", "🙏", "😢"]);