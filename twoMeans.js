var yScale;
var xScale;
var xScale2;
var winHeight;
var winWidth;
var pop1Mean;
var pop2Mean;
var population1 = null;
var population2 = null;
var populations = [[],[]];
var samples = [];
var sampleSize = 10;
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


var windowHelpers = null;
var radius = 5;
var populations = {};
var populationStatistic = null;
var samples = null;
var preCalculatedTStat = [];
var	transitionSpeed = 1000;
var index = 1;
var statsDone = false;
var animationState = 0;
var baseTransitionSpeed = 1000;
var groups = [];
var groupStats = {};


function twoMeans(inputData, headingGroup, headingContinuous, statistic){
	windowHelper = setUpWindow(radius);
	populations = {};
	var max = null;
	var min = null;
	//var dataGroup = ["female","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","male","male","female","female","female","female","female","female","female","male","female","female","female","female","female","male","female","female","female","male","female","male","female","female","male","female","female","male","female","female","female","female","female","male","female","male","female","female","female","female","female","female","female","male","male","male","female","female","male","male","male","male","female","female","female","male","male","female","female","female","female","female","male","female","female","female","male","female","female","female","female","male","female","male","female","female","female","male","female","male","female","female","female","male","female","female","female","male","female","male","male","male","male","female","female","male","female","male","female","female","female","female","female","female","female","male","male","male","female","female","male","female","female","female","female","male","male","male","male","female","female","female","male","male","male","male","male","female","female","female","male","male","female","female","female","male","male","male","male","female","male","female","female","male","female","male","female","female","female","male","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","male","female","male","female","female","female","female","male","female","female","female","female","male","female","male","female","female","male","male","male","male","female","female","female","female","male","male","male","female","female","female","male","male","female","male","female","male","male","male","female","male","male","female","female","female","male","male","female","female","female","male","female","female","female","male","female","male","female","female","male","male","female","male","female","female","male","male","female","female","male","female","female","female","female","male","female","female","female","male","male","male","male","female","female","female","male","female","male","male","male","male","female","female","female","female","female","male","female","female","male","male","female","male","female","female","female","male","female","male","female","male","female","male","male","female","female","male","female","female","female","female","male","male","female","male","female","female","female","male","female","female","female","female","male","female","male","female","male","male","male","female","female","female","male","female","female","female","male","male","female","female","male","female","female","female","male","female","female","female","male","male","female","female","female","female","female","male","male","male","male","male","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","female","female","male","male","male","male","female","male","male","male","female","male","female","female","female","male","female","female","female","male","male","female","male","female","female","female","female","female","female","male","male","male","male","male","female","male","female","male","female","female","male","female","male","female","male","male","male","female","female","female","female","female","male","female","male","female","female","female","male","female","female","female","female","male","female","female","male","female","male","male","male","male","male","female","female","female","male","male","female","male","female","male","female","female","female","male","male","male","male","female","male","male","female","male","male","female","female","male","male","female","female","male","female","female","female","female","female","male","female","male","male","female","female","female","male","male","male","female","male","male","male","male","male","female","male","female","male","female","male","male","female","male","female","male","male","female","male","male","female","female","female","male","male","female","male","male","male","female","female","male","male","female","male","male","female","female","female","male","female","female","male","female","female","female","male","female","male","male","male","female","female","male","female","male","male","male","male","female","male","female","female","female","female","male","male","male","female","female","female","male","female","female","male","male","female","male","female","female","male","male","female","female","male","female","female","female","female","male","female","male","female","female","male","male","female","female","female","female","female","male","female","female","female","male","female","male","female","male","male","female","female","male","female","male","female","female","male","female","male","male","female","female","male","female","female","female","male","female","female","male","male","female","female","male","male","female","female","male","male","female","female","female","male","female","male","female","female","female","male","female","male","male","female","female"];
	//var data = [48,60,70,61,94,50,58,69,40,45,96,65,54,63,50,67,65,71,58,50,55,47,58,56,48,67,54,55,78,50,60,95,50,54,60,58,54,60,55,59,70,58,45,85,42,50,52,55,60,112,75,88,48,55,55,45,61,49,52,73,69,83,64,54,73,60,58,67,56,54,56,70,74,50,60,56,65,44,90,70,60,68,62,90,55,58,50,85,60,85,55,50,58,54,41,62,65,70,52,70,60,75,55,60,50,80,100,63,70,59,55,80,70,85,44,44,59,45,80,50,90,80,60,100,68,60,75,54,68,57,55,88,130,70,75,58,75,56,88,65,60,80,78,62,98,62,72,93,58,65,67,85,60,65,86,58,98,55,60,67,50,80,52,65,62,96,51,60,70,77,57,43,70,67,66,45,52,50,59,52,62,110,76,60,52,65,75,55,105,46,48,60,70,70,58,85,62,60,76,60,85,73,65,80,72,70,65,85,70,58,62,62,65,65,55,80,78,83,56,67,65,76,86,80,59,65,81,70,79,63,120,68,58,74,46,65,60,66,55,60,73,78,50,79,60,60,70,64,57,54,70,57,47,157,57,75,81,50,95,72,70,65,68,67,60,65,74,50,79,73,55,86,70,56,60,62,48,75,63,60,80,72,53,54,51,85,58,58,78,72,62,92,58,65,63,60,83,50,50,55,52,48,71,76,54,80,50,62,60,63,60,46,60,47,78,72,47,75,77,67,63,40,75,60,75,60,50,52,60,80,49,91,78,63,55,56,62,60,50,45,60,80,60,49,53,43,48,69,61,73,71,74,60,60,50,79,59,58,66,60,63,52,47,45,58,54,58,120,55,85,93,80,62,56,68,100,80,52,68,65,54,53,60,70,49,50,75,80,58,70,61,56,55,60,53,68,90,106,70,78,75,73,60,60,95,50,72,69,64,110,45,64,75,60,48,62,58,69,45,78,52,84,63,60,68,60,61,70,57,56,68,60,69,68,70,78,87,70,106,72,53,54,60,70,68,56,78,60,76,42,43,90,60,65,78,60,50,85,87,62,72,70,43,75,77,72,56,65,69,35,83,55,58,55,82,60,85,89,65,58,65,49,55,70,47,140,65,85,50,79,45,78,59,47,59,64,64,60,70,75,68,68,61,79,101,62,50,173,83,70,68,70,85,68,75,60,68,65,40,64,60,58,58,67,71,64,50,62,54,66,74,58,60,73,88,70,40,80,65,62,62,81,60,83,60,60,58,58,52,90,60,66,93,75,75,63,66,70,52,81,74,65,60,60,60,86,86,65,49,50,57,55,67,63,70,47,57,72,57,87,68,62,54,47,57,45,75,48,60,57,69,67,60,67,70,85,54,45,64,67,96,54,40,72,54,60,78,56,60,65,59,68,52,72,65,53,60,87,46,45,65,60,58,62,87,74,53,56,60,64,69,60,65,68,55,79,60,60,65,80,59];
	for(var i = 0; i < inputData.length;i++){
		var thisItem = new Object();
		var inputItem = inputData[i];
		if(!(inputItem[headingGroup] in populations)) {
			populations[inputItem[headingGroup]] = [];
			 groups.push(inputItem[headingGroup]);
		}
		thisItem.group = inputItem[headingGroup];
		thisItem.value = +inputItem[headingContinuous];
		if(max == null | thisItem.value > max) max = thisItem.value;
		if(min == null | thisItem.value < min) min = thisItem.value;
		thisItem.xPerSample = {};
		thisItem.yPerSample = {};
		thisItem.id = i;
		populations[thisItem.group].push(thisItem)
	}
	xScale = d3.scale.linear().range([radius,windowHelper.innerWidth]);
	xScale.domain([min,max]);
	var s = [];
	for(var j =0; j <groups.length;j++){
		var top = (windowHelper.section1.top +(windowHelper.section1.height/groups.length) * j);
		var bottom = (windowHelper.section1.top +(windowHelper.section1.height/groups.length) * (j + 1));
		heapYValues3(populations[groups[j]], xScale, radius, 0, top,bottom);
		var stat = getStatistic(statistic,populations[groups[j]]);
		groupStats[groups[j]] = stat;
		s.push(stat);
	}
	if(groups.length == 2){
		var newItem = new item(s[1]-s[0], i);
		newItem.s0 = s[0];
		newItem.s1 = s[1];
		preCalculatedTStat.push(newItem);
		var range = makeTwoSamples(populations, numSamples, sampleSize,statistic);
	
	//heapYValues3(populations[0], xScale, radius, 0, 0, (s1Bottom-0)/2 - TOPMARGIN);
	//heapYValues3(populations[1], xScale, radius, 0, (s1Bottom-0)/2 + TOPMARGIN, s1Bottom);
	//makeTwoSamples(populations, numSamples, sampleSize);

		xScale2 = d3.scale.linear().range([radius,windowHelper.innerWidth]);
		xScale2.domain(range);
		for(var j =0;j<2;j++){
			var top = (windowHelper.section2.top +(windowHelper.section2.height/2) * j);
			var bottom = (windowHelper.section2.top +(windowHelper.section2.height/2) * (j + 1));
			for(var k = 0;k<numSamples;k++){
				heapYValues3(samples[j][k], xScale, radius,k+1,top,bottom);
			}
		}
		heapYValues3(preCalculatedTStat,xScale2,radius,0,windowHelper.section3.top,windowHelper.section3.bottom);
	}
	statsDone = true;

	drawTwoMeans();
}
function makeTwoSamples(populations, numSamples, sampleSize, statistic){
	var group1Samples = [];
	var group2Samples = [];
	samples = [[],[]];
	var largestDiff = null;
	var smallestDiff = null;
	for(var i = 0; i<numSamples;i++){
		var cut = Math.ceil(Math.random()*(sampleSize-1));
		samples[0].push([]);
		samples[1].push([]);
		var groupIndexs = [[],[]];
		groupIndexs[0] = pickRand(cut, populations[groups[0]].length);
		groupIndexs[1] = pickRand(sampleSize - cut, populations[groups[1]].length);
		var stats = [];
		for(var j = 0; j < 2;j++){
			for(var k = 0; k<groupIndexs[j].length;k++){
				samples[j][i].push(populations[groups[j]][groupIndexs[j][k]]);
			}
			var s = getStatistic(statistic, samples[j][i]);
			if(isNaN(s)){
				var lookAt = samples[j][i];
				var lookAt2 = getStatistic(statistic, samples[j][i]);
				alert("no");
			}
			stats.push(s);
		}
		var diff = stats[1] - stats[0];
		if(largestDiff == null | diff > largestDiff) largestDiff = diff;
		if(smallestDiff == null | diff < smallestDiff) smallestDiff = diff;
		if(isNaN(diff)){

		alert("wat");
	}
		var newItem = new item(diff, i);
		newItem.s0 = stats[0];
		newItem.s1 = stats[1];
		preCalculatedTStat.push(newItem);
	}
	return [smallestDiff, largestDiff];
}
function drawTwoMeans(){
	if(!statsDone) return;
	var TRANSITIONSPEED = 1000;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(xScale)
	var xAxis2 = d3.svg.axis();
	xAxis2.scale(xScale2);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (windowHelper.section1.bottom + radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (windowHelper.section2.bottom + radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (windowHelper.section3.bottom + radius) + ")").call(xAxis2);
	for(var i = 0;i<groups.length;i++){
		var pos = (windowHelper.section1.top +(windowHelper.section1.height/groups.length) * (i + 1));
		svg.append("svg").attr("id","pop"+i);
		svg.select("#pop"+i).selectAll("circle").data(populations[groups[i]]).enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1);
		svg.select("#pop"+i).append("line").attr("x1", xScale(groupStats[groups[i]])).attr("x2", xScale(groupStats[groups[i]])).attr("y1", pos+20).attr("y2", pos-20).style("stroke-width", 2).style("stroke", "black");
	} 
	if(groups.length > 2) return;
	var middle = windowHelper.section1.top +(windowHelper.section1.height/2) + radius*2;
	svg.append("line").attr("x1", xScale(preCalculatedTStat[0].s0)).attr("x2", xScale(preCalculatedTStat[0].s1)).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "red");
	svg.append("line").attr("x1", xScale2(preCalculatedTStat[0].value)).attr("x2", xScale2(preCalculatedTStat[0].value)).attr("y1", windowHelper.section3.top).attr("y2", windowHelper.section3.bottom).style("stroke-width", 2).style("stroke", "red");

	var middle = windowHelper.section2.top +(windowHelper.section2.height/2) + radius * 2;
	svg.append("svg").attr("class","sampleDiffs");
	svg.append("svg").attr("class","sampleLines2");
	var samplesLines = svg.select(".sampleLines").selectAll("line").data(preCalculatedTStat).enter();
		samplesLines.append("line").attr("x1", function(d){return xScale(d.s0);}).attr("x2", function(d){return xScale(d.s0);}).attr("y1", middle - radius * 3).attr("y2", middle + radius * 1).style("stroke-width", 2).style("stroke", "black").style("opacity",0);
	svg.select(".sampleLines2").selectAll("line").data(preCalculatedTStat).enter().append("line").attr("x1", function(d){return xScale(d.s1);}).attr("x2", function(d){return xScale(d.s1);}).attr("y1", windowHelper.section2.bottom + radius * 2).attr("y2", windowHelper.section2.bottom - radius * 2).style("stroke-width", 2).style("stroke", "black").style("opacity",0);

	var meanCircles = svg.select(".sampleDiffs").selectAll("circle").data(preCalculatedTStat)
		.enter().append("line")
		.attr("x1", function(d){
			var r = xScale(d.s0);
			return r;
		}).attr("x2", function(d){
			var r = xScale(d.s1);
			return r;
		})
		.attr("y1", middle).attr("y2", middle)
		.style("stroke-width", 2).style("stroke", "red").style("opacity",0);
	var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(preCalculatedTStat)
		.enter().append("circle")
	    .attr("cx", function(d, i) { 
	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0] - (windowHelper.section3.bottom- windowHelper.section3.bottom);
	    })
	    .attr("r", function(d) { return radius; })
	    .attr("fill-opacity", 0)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",0);

	//startAnim2(1000,false);
	/*
	svg.append("svg").attr("id","pop1");
	svg.append("svg").attr("id","pop2");
	 var circle = svg.select("#pop1").selectAll("circle");
	    circle.data(populations[0]).enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0];
	    })
	    .attr("r", function(d) { return radius; })
	    .attr("fill-opacity", 0.5)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1); 
	svg.select("#pop1").append("line").attr("x1", xScale(pop1Mean)).attr("y1", (s1Bottom/2)+20+radius).attr("x2", xScale(pop1Mean)).attr("y2", s1Bottom/2-20+radius).style("stroke-width", 2).style("stroke", "black");

	var circle2 = svg.select("#pop2").selectAll("circle");
	    circle2.data(populations[1]).enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0];
	    })
	    .attr("r", function(d) { return radius; })
	    .attr("fill-opacity", 0.5)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1); 
	var popDiff = pop2Mean - pop1Mean;
	svg.select("#pop2").append("line").attr("x1", xScale(pop2Mean)).attr("y1", s1Bottom+radius+20).attr("x2", xScale(pop2Mean)).attr("y2", s1Bottom+radius-20).style("stroke-width", 2).style("stroke", "black");

	svg.select("#pop2").append("line").attr("x1", xScale(pop2Mean)).attr("y1", (s1Bottom/4)*3+radius).attr("x2", xScale(pop1Mean)).attr("y2", (s1Bottom/4)*3+radius).style("stroke-width", 2).style("stroke", "red");
	svg.select(".meanOfSamples").append("line").attr("x1", xScale2(popDiff)).attr("y1", (s3Bottom+radius)).attr("x2", xScale2(popDiff)).attr("y2", (s2Bottom+radius)).style("stroke-width", 2).style("stroke", "red");

			//down(1, 10);

	var sampleGroup1 = samples[0][0];
	var sampleGroup2 = samples[1][0];
	svg.select("#pop1").selectAll("circle").filter(function(d,i){
		return sampleGroup1.indexOf(d) >= 0;
	}).style("fill", "red");
	svg.select("#pop2").selectAll("circle").filter(function(d,i){
		return sampleGroup2.indexOf(d) >= 0;
	}).style("fill", "red");
	svg.select("#pop1").append("line").attr("x1", xScale(preCalculatedTMeans[0][0])).attr("y1", (s2Bottom- (s2Bottom-s1Bottom)/2)+20+radius).attr("x2", xScale(preCalculatedTMeans[0][0])).attr("y2", s2Bottom- (s2Bottom-s1Bottom)/2-20+radius).style("stroke-width", 2).style("stroke", "black");

	svg.select("#pop2").append("line").attr("x1", xScale(preCalculatedTMeans[0][1])).attr("y1", s2Bottom+20+radius).attr("x2", xScale(preCalculatedTMeans[0][1])).attr("y2", s2Bottom-20+radius).style("stroke-width", 2).style("stroke", "black");

	*/
}
function startAnim2(repititions, goSlow){
	if(repititions >999) resetLines2();
	if(animationState == 0){
		transitionSpeed = baseTransitionSpeed;
		animationState = 1;
		var start = index;
		var end = start + repititions;
		if(repititions > 100) transitionSpeed = 0;
		var jumps = 1;
		if(repititions > 20) jumps = 10;
		down2(start, end, goSlow, jumps);
	}
}
function down2(indexUpTo, goUpTo, goSlow, jumps){
	var svg = d3.select(".svg");
	if(animationState != 1){
		return;
	}
	if(indexUpTo < goUpTo){
		if(indexUpTo >= numSamples){
			animationState = 0;
			return
		}

		var delay = 1;
		if(goSlow) delay = 1000;
		for(var j =0;j<2;j++){
			var circle = svg.select("#pop"+j).selectAll("circle");
			var sample = samples[j][indexUpTo];
			circle.filter(function(d,i){
				return sample.indexOf(d) >= 0;
			})
			.transition().duration(delay).style("fill", "#FF7148").attr("fill-opacity", 1).each('end', function(){
				d3.select(this).transition().duration(transitionSpeed).delay(delay)
			  	.attr("cy", function(d, i){
			    	return d.yPerSample[indexUpTo+1];
				}).each('start', function(d){d3.select(this).style("fill", "#FF7148")}).each('end', function(d, i){ if(d == sample[0]){up2(indexUpTo, goUpTo, goSlow, jumps)}});
			});
		}
		var sampMean = preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);


		svg.select(".sampleLines").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(transitionSpeed).delay(delay*2).style("opacity",1);
		svg.select(".sampleLines2").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(transitionSpeed).delay(delay*2).style("opacity",1);

		svg.select(".sampleDiffs").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(transitionSpeed).delay(delay*2).style("opacity",1);

		svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
			return sampMean.indexOf(d) >= 0;
		}).transition().delay(delay*2 + transitionSpeed).attr("fill-opacity",(transitionSpeed * 0.001)).attr("stroke-opacity",(transitionSpeed * 0.001)).each('end' ,function(d){d3.select(this).transition().duration(transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]})});
	
	}else{
		animationState = 0;

	}
	index += 1;
	index = index % numSamples;
}
function up2(indexUpTo, goUpTo, goSlow, jumps){
	var svg = d3.select(".svg");
	var newIdex = indexUpTo + jumps;
	var delay = 0;
	if(animationState != 1){
		return;
	}
	if(goSlow) delay = 1000;
	for(var j =0;j<2;j++){
		var circle = svg.select("#pop"+j).selectAll("circle");
		var sample = samples[j][indexUpTo];
		var sampMean = preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);

		circle.filter(function(d,i){
			return sample.indexOf(d) >= 0;
		})
		.transition().duration(delay).delay(delay)
		.attr("cy", function(d, i){
	    	return d.yPerSample[0];
		}).style("fill", "#C7D0D5").attr("fill-opacity",0.5).each('end', function(d, i){ if(d == sample[0]){down2(newIdex, goUpTo, goSlow, jumps)}});
	}
	svg.select(".sampleLines").selectAll("line").filter(function(d, i){
		return i == indexUpTo+1;
	}).transition().duration(transitionSpeed).style("opacity",0);

	svg.select(".sampleLines2").selectAll("line").filter(function(d, i){
		return i == indexUpTo+1;
	}).transition().duration(transitionSpeed).style("opacity",0);
	if(goSlow){
		svg.select(".sampleDiffs").selectAll("line").filter(function(d, i){
				return i == indexUpTo+1;
		}).transition().duration(transitionSpeed).attr("x1",function(d){
			var goTo = xScale2(d.value);
			return goTo-d.value/2;
		}).attr("x2",function(d){
			var goTo = xScale2(d.value);
			return goTo+d.value/2;
		}).attr("y1", windowHelper.section3.bottom).attr("y2", windowHelper.section3.bottom).each('end', function(d){
			var middle = windowHelper.section2.top +(windowHelper.section2.height/2) + radius * 2;
			d3.select(this).attr("x1", function(d){
			var r = xScale(d.s0);
			return r;
		}).attr("x2", function(d){
			var r = xScale(d.s1);
			return r;
		})
		.attr("y1", middle).attr("y2", middle)
		.style("stroke-width", 2).style("stroke", "red").style("opacity",0);
		});
	}else{
		svg.select(".sampleDiffs").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(transitionSpeed).style("opacity",0);
	}
	/*
	var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
		return sampMean.indexOf(d) >= 0;
	});
	meanLines.transition().duration(transitionSpeed).style("opacity",0.2).style("stroke", "steelblue"); */
}

function destroy2(){
	d3.select(".svg").selectAll("*").remove();
	d3.select(".svg").append("svg").attr("class","sampleLines");
	d3.select(".svg").append("svg").attr("class","meanOfSamples");
	resetData2();
	loadMain();
}

function resetData2(){
	windowHelpers = null;
	radius = 5;
	populations = {};
	populationStatistic = null;
	samples = null;	
	preCalculatedTStat = [];
	transitionSpeed = 1000;
	index = 0;
	statsDone = false;
	animationState = 0;
	baseTransitionSpeed = 1000;
	groups = [];
	groupStats = {};
}

function resetLines2(){
	var svg = d3.select(".svg");
		svg.select(".sampleLines").selectAll("line").style("opacity",0);
		svg.select("#pop1").selectAll("circle").attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1).style("fill", "#C7D0D5");
		svg.select("#pop0").selectAll("circle").attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1).style("fill", "#C7D0D5");
		svg.select(".sampleLines2").selectAll("line").style("opacity",0);

		svg.select(".sampleDiffs").selectAll("line").style("opacity",0);

		svg.select(".meanOfSamples").selectAll("circle").attr("fill-opacity", 0).attr("stroke-opacity", 0);
}