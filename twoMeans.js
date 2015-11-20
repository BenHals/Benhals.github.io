var yScale;
var xScale;
var winHeight;
var winWidth;
var pop1Mean;
var pop2Mean;
var population1 = null;
var population2 = null;
var populations = [[],[]];
var samples;
var sampleSize = 20;
var means; 
var sampleMeans = [];
var baseTransitionSpeed = 1000;
var TRANSITIONSPEED = baseTransitionSpeed;
var preCalculatedTMeans = [];
var totalMeans = [];
var currentTotMean = 0;
var totalMean;
var numSamples = 1000;
var s1Bottom = 0;
var s2Bottom = 0;
var s3Bottom = 0;
var index = 0;
var margin = 0;
var animationState = 0;

function twoMeans(){
	winWidth = window.innerWidth*0.8;
	winHeight = window.innerHeight*0.99;
	margin = winHeight/10;
	s1Bottom = winHeight/3;
	s2Bottom = winHeight/2;
	s3Bottom = winHeight-margin;
	var TOPMARGIN = 5;
	radius = 5;
	var dataGroup = ["female","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","male","male","female","female","female","female","female","female","female","male","female","female","female","female","female","male","female","female","female","male","female","male","female","female","male","female","female","male","female","female","female","female","female","male","female","male","female","female","female","female","female","female","female","male","male","male","female","female","male","male","male","male","female","female","female","male","male","female","female","female","female","female","male","female","female","female","male","female","female","female","female","male","female","male","female","female","female","male","female","male","female","female","female","male","female","female","female","male","female","male","male","male","male","female","female","male","female","male","female","female","female","female","female","female","female","male","male","male","female","female","male","female","female","female","female","male","male","male","male","female","female","female","male","male","male","male","male","female","female","female","male","male","female","female","female","male","male","male","male","female","male","female","female","male","female","male","female","female","female","male","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","male","female","male","female","female","female","female","male","female","female","female","female","male","female","male","female","female","male","male","male","male","female","female","female","female","male","male","male","female","female","female","male","male","female","male","female","male","male","male","female","male","male","female","female","female","male","male","female","female","female","male","female","female","female","male","female","male","female","female","male","male","female","male","female","female","male","male","female","female","male","female","female","female","female","male","female","female","female","male","male","male","male","female","female","female","male","female","male","male","male","male","female","female","female","female","female","male","female","female","male","male","female","male","female","female","female","male","female","male","female","male","female","male","male","female","female","male","female","female","female","female","male","male","female","male","female","female","female","male","female","female","female","female","male","female","male","female","male","male","male","female","female","female","male","female","female","female","male","male","female","female","male","female","female","female","male","female","female","female","male","male","female","female","female","female","female","male","male","male","male","male","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","female","female","male","male","male","male","female","male","male","male","female","male","female","female","female","male","female","female","female","male","male","female","male","female","female","female","female","female","female","male","male","male","male","male","female","male","female","male","female","female","male","female","male","female","male","male","male","female","female","female","female","female","male","female","male","female","female","female","male","female","female","female","female","male","female","female","male","female","male","male","male","male","male","female","female","female","male","male","female","male","female","male","female","female","female","male","male","male","male","female","male","male","female","male","male","female","female","male","male","female","female","male","female","female","female","female","female","male","female","male","male","female","female","female","male","male","male","female","male","male","male","male","male","female","male","female","male","female","male","male","female","male","female","male","male","female","male","male","female","female","female","male","male","female","male","male","male","female","female","male","male","female","male","male","female","female","female","male","female","female","male","female","female","female","male","female","male","male","male","female","female","male","female","male","male","male","male","female","male","female","female","female","female","male","male","male","female","female","female","male","female","female","male","male","female","male","female","female","male","male","female","female","male","female","female","female","female","male","female","male","female","female","male","male","female","female","female","female","female","male","female","female","female","male","female","male","female","male","male","female","female","male","female","male","female","female","male","female","male","male","female","female","male","female","female","female","male","female","female","male","male","female","female","male","male","female","female","male","male","female","female","female","male","female","male","female","female","female","male","female","male","male","female","female"];
	var data = [48,60,70,61,94,50,58,69,40,45,96,65,54,63,50,67,65,71,58,50,55,47,58,56,48,67,54,55,78,50,60,95,50,54,60,58,54,60,55,59,70,58,45,85,42,50,52,55,60,112,75,88,48,55,55,45,61,49,52,73,69,83,64,54,73,60,58,67,56,54,56,70,74,50,60,56,65,44,90,70,60,68,62,90,55,58,50,85,60,85,55,50,58,54,41,62,65,70,52,70,60,75,55,60,50,80,100,63,70,59,55,80,70,85,44,44,59,45,80,50,90,80,60,100,68,60,75,54,68,57,55,88,130,70,75,58,75,56,88,65,60,80,78,62,98,62,72,93,58,65,67,85,60,65,86,58,98,55,60,67,50,80,52,65,62,96,51,60,70,77,57,43,70,67,66,45,52,50,59,52,62,110,76,60,52,65,75,55,105,46,48,60,70,70,58,85,62,60,76,60,85,73,65,80,72,70,65,85,70,58,62,62,65,65,55,80,78,83,56,67,65,76,86,80,59,65,81,70,79,63,120,68,58,74,46,65,60,66,55,60,73,78,50,79,60,60,70,64,57,54,70,57,47,157,57,75,81,50,95,72,70,65,68,67,60,65,74,50,79,73,55,86,70,56,60,62,48,75,63,60,80,72,53,54,51,85,58,58,78,72,62,92,58,65,63,60,83,50,50,55,52,48,71,76,54,80,50,62,60,63,60,46,60,47,78,72,47,75,77,67,63,40,75,60,75,60,50,52,60,80,49,91,78,63,55,56,62,60,50,45,60,80,60,49,53,43,48,69,61,73,71,74,60,60,50,79,59,58,66,60,63,52,47,45,58,54,58,120,55,85,93,80,62,56,68,100,80,52,68,65,54,53,60,70,49,50,75,80,58,70,61,56,55,60,53,68,90,106,70,78,75,73,60,60,95,50,72,69,64,110,45,64,75,60,48,62,58,69,45,78,52,84,63,60,68,60,61,70,57,56,68,60,69,68,70,78,87,70,106,72,53,54,60,70,68,56,78,60,76,42,43,90,60,65,78,60,50,85,87,62,72,70,43,75,77,72,56,65,69,35,83,55,58,55,82,60,85,89,65,58,65,49,55,70,47,140,65,85,50,79,45,78,59,47,59,64,64,60,70,75,68,68,61,79,101,62,50,173,83,70,68,70,85,68,75,60,68,65,40,64,60,58,58,67,71,64,50,62,54,66,74,58,60,73,88,70,40,80,65,62,62,81,60,83,60,60,58,58,52,90,60,66,93,75,75,63,66,70,52,81,74,65,60,60,60,86,86,65,49,50,57,55,67,63,70,47,57,72,57,87,68,62,54,47,57,45,75,48,60,57,69,67,60,67,70,85,54,45,64,67,96,54,40,72,54,60,78,56,60,65,59,68,52,72,65,53,60,87,46,45,65,60,58,62,87,74,53,56,60,64,69,60,65,68,55,79,60,60,65,80,59];
	for(var i = 0; i < dataGroup.length;i++){
		var thisItem = new Object();
		if(population1 == null) population1 = dataGroup[i];
		if(population2 == null) population2 = dataGroup[i];
		var thisGroup = 0;
		if(dataGroup[i] == population2) thisGroup = 1;
		thisItem.group = thisGroup;
		thisItem.value = data[i];
		thisItem.xPerSample = {};
		thisItem.yPerSample = {};
		populations[thisGroup].push(thisItem)
	}
	xScale = d3.scale.linear().range([radius + TOPMARGIN,winWidth - radius - TOPMARGIN - 10]);
	xScale.domain([d3.min(data),d3.max(data)]);

	pop1Mean = heapYValues3(populations[0], xScale, radius, 0, 0, (s1Bottom-0)/2 - TOPMARGIN);
	pop2Mean = heapYValues3(populations[1], xScale, radius, 0, (s1Bottom-0)/2 + TOPMARGIN, s1Bottom);
	makeTwoSamples(populations, numSamples, sampleSize);

	statsDone = true;

	drawTwoMeans();
}

function makeTwoSamples(populations, numSamples, sampleSize){
var group1Samples = [];
var group2Samples = [];
var means = []
samples = [[],[]];
for(var i = 0; i<numSamples;i++){
	var cut = Math.ceil(Math.random()*sampleSize) - 1;
	samples[0].push([]);
	samples[1].push([]);
	var groupIndexs = [[],[]];
	groupIndexs[0] = pickRand(cut, populations[0].length);
	groupIndexs[1] = pickRand(sampleSize - cut, populations[1].length);
	for(var j = 0; j < 2;j++){
		for(var k = 0; k<groupIndexs[j].length;k++){
			samples[j][i].push(populations[j][groupIndexs[j][k]]);
		}
	}
	var mean = [findMeanItems(samples[0][i]), findMeanItems(samples[1][i])];
	preCalculatedTMeans.push(mean);
}
return samples;
}



function drawTwoMeans(){
	if(!statsDone) return;
	var TRANSITIONSPEED = 1000;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(xScale)
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (s1Bottom + radius) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (s2Bottom + radius) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (s3Bottom + radius) + ")").call(xAxis);
	svg.append("svg").attr("id","pop1");
	svg.append("svg").attr("id","pop2");
	 var circle = svg.select("#pop1").selectAll("circle")
	    .data(populations[0]);
	   circle.enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0];
	    })
	    .attr("r", function(d) { return radius; })
	    .attr("fill-opacity", 0.5)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1); 
	svg.select("#pop1").append("line").attr("x1", pop1Mean).attr("y1", (s1Bottom/2)+20).attr("x2", pop1Mean).attr("y2", s1Bottom/2-20).style("stroke-width", 2).style("stroke", "black");

	var circle2 = svg.select("#pop2").selectAll("circle")
	    .data(populations[1]);
	   circle2.enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0];
	    })
	    .attr("r", function(d) { return radius; })
	    .attr("fill-opacity", 0.5)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1); 
	svg.select("#pop2").append("line").attr("x1", pop2Mean).attr("y1", s1Bottom+20).attr("x2", pop2Mean).attr("y2", s1Bottom-20).style("stroke-width", 2).style("stroke", "black");

	svg.select("#pop2").append("line").attr("x1", pop2Mean).attr("y1", (s1Bottom/4)*3).attr("x2", pop1Mean).attr("y2", (s1Bottom/4)*3).style("stroke-width", 2).style("stroke", "red");
			//down(1, 10);

}

function destroyTwo(){
	d3.select(".svg").selectAll("*").remove();
	d3.select(".svg").append("svg").attr("class","sampleLines");
	d3.select(".svg").append("svg").attr("class","meanOfSamples");
	resetDataTwo();
	loadMain();
}

function resetDataTwo(){
	yScale = null;
	xScale = null;
	winHeight = null;
	winWidth = null;
	pop1Mean = null;
	pop2Mean = null;
	population1 = null;
	population2 = null;
	populations = [[],[]];
	samples = null;
	sampleSize = 20;
	means = null; 
	sampleMeans = [];
	baseTransitionSpeed = 1000;
	TRANSITIONSPEED = baseTransitionSpeed;
	preCalculatedTMeans = [];
	totalMeans = [];
	currentTotMean = 0;
	totalMean = null;
	numSamples = 1000;
	s1Bottom = 0;
	s2Bottom = 0;
	s3Bottom = 0;
	index = 0;
	margin = 0;
	animationState = 0;
}