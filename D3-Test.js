/*
var statsDone = false;
var radius = 5;
var yScale;
var xScale;
var winHeight;
var winWidth;
var popMean;
var population;
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
var animationState = 0; */

var windowHelpers = null;
var radius = 5;
var population = [];
var populationStatistic = null;
var samples = null;
var preCalculatedTStat = [];
var	transitionSpeed = 1000;
var index = 0;
var statsDone = false;
var animationState = 0;
var baseTransitionSpeed = 1000;
function oneMean(inputData, heading, statistic){
	windowHelper = setUpWindow(radius);
	population = [];
	var max = null;
	var min = null;
	for(var i = 0; i<inputData.length;i++){
		var value = +inputData[i][heading];
		if(max == null | value > max) max = value;
		if(min == null | value < min) min = value;
		population.push(new item(value, i));
	}

	xScale = d3.scale.linear().range([radius,windowHelper.innerWidth]);
	xScale.domain([min,max]);


	populationStatistic = 0;
	populationStatistic = getStatistic(statistic, population);
	heapYValues3(population, xScale, radius, 0, windowHelper.section1.top, windowHelper.section1.bottom);
	samples = makeSamples(population, numSamples, 20);
	for(var k = 0; k < numSamples;k++){
		var stat = getStatistic(statistic, samples[k])
		heapYValues3(samples[k], xScale,radius, k+1, windowHelper.section2.top, windowHelper.section2.bottom);
		preCalculatedTStat.push(new item(stat, i));
	}
	heapYValues3(preCalculatedTStat, xScale, radius, 0, windowHelper.section3.top,windowHelper.section3.bottom);

	statsDone = true;
	draw();


}
function makeSamples(population, numSamples, sampleSize){
var samples = [];
for(var i = 0; i<numSamples;i++){
	samples.push([]);
	var indexs = pickRand(sampleSize, population.length);
	for(var k = 0; k<sampleSize;k++){
		samples[i].push(population[indexs[k]]);
	}
}
return samples;
}


function draw(){
	if(!statsDone) return;
	var TRANSITIONSPEED = transitionSpeed;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(xScale)
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (windowHelper.section1.bottom + radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (windowHelper.section2.bottom + radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (windowHelper.section3.bottom + radius) + ")").call(xAxis);
	var circle = svg.selectAll("circle").data(population);
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

	svg.append("line").attr("x1", xScale(populationStatistic)).attr("y1", windowHelper.section1.bottom+20).attr("x2", xScale(populationStatistic)).attr("y2", windowHelper.section1.bottom-20).style("stroke-width", 2).style("stroke", "black");

	var meanLines = svg.select(".sampleLines").selectAll("line").data(preCalculatedTStat)
		.enter().append("line").attr("y1", windowHelper.section1.bottom+20).attr("y2", windowHelper.section1.bottom-20).attr("x1", function(d){return xScale(d.value)}).attr("x2", function(d){return xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

	var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(preCalculatedTStat)
		.enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0] - (windowHelper.section3.bottom- windowHelper.section2.bottom);
		    })
		    .attr("r", function(d) { return radius; })
		    .attr("fill-opacity", 0)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",0);
}
function startAnim(repititions, goSlow){
	if(repititions >999) resetLines();
	if(animationState == 0){
		transitionSpeed = baseTransitionSpeed-repititions*20;
		animationState = 1;
		if(index > numSamples){
			index = index % numSamples;
			resetLines();
		}
		var start = index;
		var end = start + repititions;
		if(repititions > 100) transitionSpeed = 0;
		var jumps = 1;
		if(repititions > 20) jumps = 10;
		down(start, end, goSlow, jumps);
	}
}
function down(indexUpTo, goUpTo, goSlow, jumps){
	var svg = d3.select(".svg");
	if(animationState != 1){
		return;
	}
	if(indexUpTo < goUpTo){
		if(indexUpTo >= numSamples){
			animationState = 0;
			return
		}
		var circle = svg.selectAll("circle");
		var sample = samples[indexUpTo];
		var delay = 1;
		if(goSlow) delay = 1000;
		circle = circle.filter(function(d,i){return sample.indexOf(d) >= 0;});
		if(goSlow){
			circle = circle.transition().duration(delay).style("fill", "#FF7148").attr("fill-opacity", 1)
							.transition().duration(delay);
		}else{
			circle = circle.style("fill", "#FF7148").attr("fill-opacity", 1);
		}
		if(transitionSpeed <= 100){
			circle = circle.attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
			.transition().duration(delay)
			.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
			.each('end', function(d, i){ if(d == sample[0]){down(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
		}else{
			circle = circle.transition().duration(transitionSpeed).attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
			.transition().duration(delay)
			.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
			.each('end', function(d, i){ if(d == sample[0]){down(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
		}

		var sampMean = preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);

		var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
			return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
		});
		if(goSlow){
			meanLines = meanLines.transition().delay(delay).duration(delay).style("opacity",1)
			.transition().duration(transitionSpeed).attr("y1", windowHelper.section2.bottom+10).attr("y2", windowHelper.section2.bottom-10).style("stroke", "steelblue")
			.transition().duration(transitionSpeed).style("opacity",0.2).style("stroke", "steelblue");
		}else{
			meanLines = meanLines.attr("y1", windowHelper.section2.bottom+10).attr("y2", windowHelper.section2.bottom-10).style("stroke", "steelblue").style("opacity",1).transition().duration(transitionSpeed).style("opacity",0.2);
		}

		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
			return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
		});
		if(transitionSpeed <= 100){
			meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5");
		}else{
			if(goSlow){
				meanCircles = meanCircles.transition().delay(delay*2 + transitionSpeed).attr("fill-opacity",(transitionSpeed * 0.001)).attr("stroke-opacity",(transitionSpeed * 0.001))
				.transition().duration(transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]});
			}else{
				meanCircles = meanCircles.attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").transition().delay(transitionSpeed).duration(transitionSpeed).attr("cy", function(d){return d.yPerSample[0]});
			}
		}
		index += jumps;


	}else{
		animationState = 0;

	}
}
/*
function up(indexUpTo, goUpTo, goSlow, jumps){
	var svg = d3.select(".svg");
	var newIdex = indexUpTo + jumps;
	var delay = 0;
	if(animationState != 1){
		return;
	}
	if(goSlow) delay = 1000;
	var circle = svg.selectAll("circle");
	var sample = samples[indexUpTo];
	var sampMean = preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);

	circle.filter(function(d,i){
		return sample.indexOf(d) >= 0;
	})
	.transition().duration(delay).delay(delay)
	.attr("cy", function(d, i){
    	return d.yPerSample[0];
	}).style("fill", "#C7D0D5").attr("fill-opacity",0.5).each('end', function(d, i){ if(d == sample[0]){down(newIdex, goUpTo, goSlow, jumps)}});

	var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
		return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
	});
	meanLines.transition().duration(transitionSpeed).style("opacity",0.2).style("stroke", "steelblue");
} */

function resetLines(){
	var svg = d3.select(".svg");
	var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", windowHelper.section1.bottom+20).attr("y2", windowHelper.section1.bottom-20).attr("x1", function(d){return xScale(d.value)}).attr("x2", function(d){return xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

	var meanCircles = svg.select(".meanOfSamples").selectAll("circle")
	    .attr("cx", function(d, i) { 
	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0] - (windowHelper.section3.bottom- windowHelper.section2.bottom);
	    })
	    .attr("fill-opacity", 0)
	    .attr("stroke-opacity",0); 


}

function pickRand(numToPick, numFrom){
var indexs = [];
while(indexs.length < numToPick){
	var randomNumber = Math.ceil(Math.random()*numFrom) - 1;
	var found = false;
	for(var i =0;i<indexs.length;i++){
		if(indexs[i] == randomNumber){
			found = true;
			break;
		}
	}
	if(!found){
		indexs.push(randomNumber);
	}
}
return indexs;
}

function findMean(numbers){
var total = 0;
for(var i = 0;i<numbers.length;i++){
	total += numbers[i];
}
return total/numbers.length;
}
function findMeanItems(numbers){
var total = 0;
for(var i = 0;i<numbers.length;i++){
	total += numbers[i].value;
}
return total/numbers.length;
}



function stop(){
animationState = 0;
}

function destroyOne(){
	d3.select(".svg").selectAll("*").remove();
	d3.select(".svg").append("svg").attr("class","sampleLines");
	d3.select(".svg").append("svg").attr("class","meanOfSamples");
	resetDataOne();
	loadMain();
}

function resetDataOne(){
	animationState = 0;
	windowHelpers = null;
	radius = 5;
	population = [];
	populationStatistic = null;
	samples = null;
	preCalculatedTStat = [];		
	transitionSpeed = 1000;
	index = 0;
	statsDone = false;

	baseTransitionSpeed = 1000;
}