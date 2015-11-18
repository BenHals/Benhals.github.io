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
var animationState = 0;

function Start(){
	winWidth = window.innerWidth*0.8;
	winHeight = window.innerHeight*0.99;
	margin = winHeight/10;
	s1Bottom = winHeight/3;
	s2Bottom = winHeight/2;
	s3Bottom = winHeight-margin;
	var SIZE = 5;
	var TOPMARGIN = 1;
	var STATE = 0;

	radius = 5;
	var data = []
	var dataMax = -1;
	var dataMin = -1;
	population = [];
	for(var o = 0; o < 1000; o++){
		var randNum = Math.ceil(Math.random()*300);
		if(randNum > dataMax) dataMax = randNum;
		if(randNum < dataMin || dataMin == -1) dataMin = randNum;
		data.push(randNum);
	}
	var data2 = [48,60,70,61,94,50,58,69,40,45,96,65,54,63,50,67,65,71,58,50,55,47,58,56,48,67,54,55,78,50,60,95,50,54,60,58,54,60,55,59,70,58,45,85,42,50,52,55,60,112,75,88,48,55,55,45,61,49,52,73,69,83,64,54,73,60,58,67,56,54,56,70,74,50,60,56,65,44,90,70,60,68,62,90,55,58,50,85,60,85,55,50,58,54,41,62,65,70,52,70,60,75,55,60,50,80,100,63,70,59,55,80,70,85,44,44,59,45,80,50,90,80,60,100,68,60,75,54,68,57,55,88,130,70,75,58,75,56,88,65,60,80,78,62,98,62,72,93,58,65,67,85,60,65,86,58,98,55,60,67,50,80,52,65,62,96,51,60,70,77,57,43,70,67,66,45,52,50,59,52,62,110,76,60,52,65,75,55,105,46,48,60,70,70,58,85,62,60,76,60,85,73,65,80,72,70,65,85,70,58,62,62,65,65,55,80,78,83,56,67,65,76,86,80,59,65,81,70,79,63,120,68,58,74,46,65,60,66,55,60,73,78,50,79,60,60,70,64,57,54,70,57,47,157,57,75,81,50,95,72,70,65,68,67,60,65,74,50,79,73,55,86,70,56,60,62,48,75,63,60,80,72,53,54,51,85,58,58,78,72,62,92,58,65,63,60,83,50,50,55,52,48,71,76,54,80,50,62,60,63,60,46,60,47,78,72,47,75,77,67,63,40,75,60,75,60,50,52,60,80,49,91,78,63,55,56,62,60,50,45,60,80,60,49,53,43,48,69,61,73,71,74,60,60,50,79,59,58,66,60,63,52,47,45,58,54,58,120,55,85,93,80,62,56,68,100,80,52,68,65,54,53,60,70,49,50,75,80,58,70,61,56,55,60,53,68,90,106,70,78,75,73,60,60,95,50,72,69,64,110,45,64,75,60,48,62,58,69,45,78,52,84,63,60,68,60,61,70,57,56,68,60,69,68,70,78,87,70,106,72,53,54,60,70,68,56,78,60,76,42,43,90,60,65,78,60,50,85,87,62,72,70,43,75,77,72,56,65,69,35,83,55,58,55,82,60,85,89,65,58,65,49,55,70,47,140,65,85,50,79,45,78,59,47,59,64,64,60,70,75,68,68,61,79,101,62,50,173,83,70,68,70,85,68,75,60,68,65,40,64,60,58,58,67,71,64,50,62,54,66,74,58,60,73,88,70,40,80,65,62,62,81,60,83,60,60,58,58,52,90,60,66,93,75,75,63,66,70,52,81,74,65,60,60,60,86,86,65,49,50,57,55,67,63,70,47,57,72,57,87,68,62,54,47,57,45,75,48,60,57,69,67,60,67,70,85,54,45,64,67,96,54,40,72,54,60,78,56,60,65,59,68,52,72,65,53,60,87,46,45,65,60,58,62,87,74,53,56,60,64,69,60,65,68,55,79,60,60,65,80,59];
	data = data2;
	for(var i = 0; i < data.length; i++){
		population.push(new item(data[i], i));
	}
	population.sort(function(a,b){return a.value - b.value});

	xScale = d3.scale.linear().range([radius + TOPMARGIN,winWidth - radius - TOPMARGIN - 10]);
	xScale.domain([d3.min(data),d3.max(data)]);


	var maxY = -1;
	var maxStack = 1;
	popMean = 0;
	popMean = heapYValues3(population, xScale, radius, 0, 0, s1Bottom);
	samples = makeSamples(population, numSamples, 20);
	var maxYs = [];
	for(var k = 0; k < numSamples;k++){
		samples[k].sort(function(a,b){return a.value - b.value});
		maxYs.push(heapYValues3(samples[k], xScale,radius, k+1, s1Bottom, s2Bottom));
	}
	//preCalculatedTMeans.sort(function(a,b){return a.value - b.value});
	heapYValues3(preCalculatedTMeans, xScale, radius, 0, s2Bottom+margin,s3Bottom);
	//preCalculatedTMeans.sort(function(a,b){return a.id - b.id});
	samples.push(maxYs);


	d3.select(".controls").append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "startAnim(1,true)");
	d3.select(".controls").append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "startAnim(10, false)");
	d3.select(".controls").append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "startAnim(1000, false)");
	d3.select(".controls").append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "resetLines()");
	statsDone = true;
	draw();

	var bucketMin = (dataMin - (dataMin%radius));
	var bucketMax = (dataMax + (radius - (dataMax%radius)));


}
function makeSamples(population, numSamples, sampleSize){
	var samples = [];
	var means = []
	for(var i = 0; i<numSamples;i++){
		samples.push([]);
		var indexs = pickRand(sampleSize, population.length);
		for(var k = 0; k<sampleSize;k++){
			samples[i].push(population[indexs[k]]);
		}
		var mean = findMeanItems(samples[i]);
		means.push(mean);
		preCalculatedTMeans.push(new item(mean, i));
	}
	var totalMean = findMean(means);
	samples.push(means);
	samples.push(totalMean);
	return samples;
}


function draw(){
	if(!statsDone) return;
	var TRANSITIONSPEED = 1000;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(xScale)
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (s1Bottom + radius) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (s2Bottom + radius) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (s3Bottom + radius) + ")").call(xAxis);
	var circle = svg.selectAll("circle")
	    .data(population);
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
	svg.append("line").attr("x1", xScale(popMean)).attr("y1", s1Bottom+20).attr("x2", xScale(popMean)).attr("y2", s1Bottom-20).style("stroke-width", 2).style("stroke", "black");
	
	var meanLines = svg.select(".sampleLines").selectAll("line").data(preCalculatedTMeans)
		.enter().append("line").attr("y1", s1Bottom+20).attr("y2", s1Bottom-20).attr("x1", function(d){return xScale(d.value)}).attr("x2", function(d){return xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

	var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(preCalculatedTMeans)
		.enter().append("circle")
						    .attr("cx", function(d, i) { 

				    	return d.xPerSample[0]; })
				    .attr("cy", function(d) {
				    	return d.yPerSample[0] - (s3Bottom - s2Bottom);
				    })
				    .attr("r", function(d) { return radius; })
				    .attr("fill-opacity", 0)
				    .attr("stroke","#556270")
				    .attr("stroke-opacity",0); 

	var indexUpTo = 1;
	means = samples[samples.length-3];
	totalMean = samples[samples.length -2];
	sampleMeans = [];
			//down(1, 10);
	
}
function startAnim(repititions, goSlow){
	if(animationState == 0){
		animationState = 1;
		//var start = Math.ceil(Math.random() * (1000-repititions));
		var start = index;
		var end = start + repititions;
		index = end;
		index = index % numSamples;
		TRANSITIONSPEED = baseTransitionSpeed;
		if(repititions > 100) TRANSITIONSPEED = 0;
		var jumps = 1;
		if(repititions > 20) jumps = 10;
		down(start, end, goSlow, jumps);

		currentTotMean = 0;
		for(var i = start;i<end;i++){
			currentTotMean += means[i];
		}
		currentTotMean = currentTotMean/repititions;
	}
}
function down(indexUpTo, goUpTo, goSlow, jumps){
	var svg = d3.select(".svg");
	if(animationState != 1){
		animationState = 0;
		return;
	}
	if(indexUpTo < goUpTo){
		if(indexUpTo >= numSamples){
			animationState = 0;
			return
		}
	var circle = svg.selectAll("circle");
	var sample = samples[indexUpTo];
	var found = false;
	var delay = 1;
	if(goSlow) delay = 1000;
	circle.filter(function(d,i){
		return sample.indexOf(d) >= 0;
	})
	.transition().duration(delay).style("fill", "#FF7148").attr("fill-opacity", 1).each('end', function(){
		d3.select(this).transition().duration(TRANSITIONSPEED).delay(delay)
  	  .attr("cy", function(d, i){
		    	return d.yPerSample[indexUpTo+1];

   	 	}).each('start', function(d){d3.select(this).style("fill", "#FF7148")}).each('end', function(d, i){ if(d == sample[0]){up(indexUpTo, goUpTo, goSlow, jumps)}});
	});
	var sampMean = preCalculatedTMeans.slice(indexUpTo, indexUpTo+jumps);
	svg.select(".sampleLines").selectAll("line").filter(function(d, i){
		return sampMean.indexOf(d) >= 0;
	}).transition().duration(delay).style("opacity",(TRANSITIONSPEED * 0.001)).each('end', function(d){d3.select(this).transition().delay(delay).duration(TRANSITIONSPEED).attr("y1", s2Bottom+10).attr("y2", s2Bottom-10).style("stroke", "steelblue")});
	
	svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
		return sampMean.indexOf(d) >= 0;
	}).transition().delay(delay*2 + TRANSITIONSPEED).attr("fill-opacity",(TRANSITIONSPEED * 0.001)).attr("stroke-opacity",(TRANSITIONSPEED * 0.001)).each('end' ,function(d){d3.select(this).transition().duration(TRANSITIONSPEED).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]})});

	//sampleMeans = sampleMeans.concat(sampMean);
	//var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
	//meanLines.enter().append("line").attr("x1", function(d){return xScale(d.value)}).attr("y1", s1Bottom + 20).attr("x2", function(d){return xScale(d.value)}).attr("y2", s1Bottom - 20).style("stroke-width", 2).style("stroke", "green").style("opacity", 0)
	//		.transition().duration(TRANSITIONSPEED).delay(delay*2).attr("y1", s2Bottom+10).attr("y2", s2Bottom-10).style("opacity", 1);
		}else{
			animationState = 0;

		}
}
function up(indexUpTo, goUpTo, goSlow, jumps){
	var svg = d3.select(".svg");
	var newIdex = indexUpTo + jumps;
	var delay = 0;
	if(goSlow) delay = 1000;
	var circle = svg.selectAll("circle");
	var sample = samples[indexUpTo];
		var sampMean = preCalculatedTMeans.slice(indexUpTo, indexUpTo+jumps);
	circle.filter(function(d,i){
		return sample.indexOf(d) >= 0;
	})
	.transition().duration(delay).delay(delay)
    .attr("cy", function(d, i){
	    	return d.yPerSample[0];

    }).style("fill", "#C7D0D5").attr("fill-opacity",0.5).each('end', function(d, i){ if(d == sample[0]){down(newIdex, goUpTo, goSlow, jumps)}});
    			var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
		return sampMean.indexOf(d) >= 0;
	});
			meanLines.transition().duration(TRANSITIONSPEED).style("opacity",0.2).style("stroke", "steelblue").each('end', function(d, i){
				/*totalMeans.push(d);
				svg.select(".meanOfSamples").selectAll("circle").data(totalMeans).enter().append("circle")
				    .attr("cx", function(d, i) { 

				    	return d.xPerSample[0]; })
				    .attr("cy", function(d) {
				    	return d.yPerSample[0];
				    })
				    .attr("r", function(d) { return radius; })
				    .attr("fill-opacity", 0.5)
				    .attr("stroke","#556270")
				    .attr("stroke-opacity",1); */
						}); 
	}

function resetLines(){
	var svg = d3.select(".svg");
		var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", s1Bottom+20).attr("y2", s1Bottom-20).attr("x1", function(d){return xScale(d.value)}).attr("x2", function(d){return xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

	var meanCircles = svg.select(".meanOfSamples").selectAll("circle")
						    .attr("cx", function(d, i) { 

				    	return d.xPerSample[0]; })
				    .attr("cy", function(d) {
				    	return d.yPerSample[0] - (s3Bottom - s2Bottom)
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
function item(value, id){
	this.value = value;
	this.id = id;
	this.x = -1;
	this.y = -1;
	this.x2 = -1;
	this.y2 = {};
	this.level = 1;
	this.level2 = {};
	this.xPerSample = {};
	this.yPerSample = {};
}

function heapYValues(itemsToHeap, xScale, radius, sampleIndex, areaTopY, areaBottomY){
	var popMean = 0;
	var maxY = 0;
	for(var j = 0; j < itemsToHeap.length;j++){
		var thisItem = itemsToHeap[j];
		thisItem.xPerSample[sampleIndex] = xScale(thisItem.value);
		thisItem.yPerSample[sampleIndex] = 0;
		thisItem.level = 0;
		popMean += thisItem.value;
		if(j != 0){
			var lastItem = itemsToHeap[j-1];
			if(thisItem.xPerSample[sampleIndex] - lastItem.xPerSample[sampleIndex] <= radius*0.2){
				thisItem.level = lastItem.level + 1;
				thisItem.yPerSample[sampleIndex] = lastItem.yPerSample[sampleIndex] +((radius*2) * Math.pow(0.99,thisItem.level));
				if(thisItem.yPerSample[sampleIndex] > maxY){
					maxY = thisItem.yPerSample[sampleIndex];
				}
			}
		}
	}
	popMean = popMean/population.length;
	yScale = d3.scale.linear().range([areaBottomY,Math.max(areaBottomY - maxY,areaTopY+radius*2)]);
	yScale.domain([0,maxY]);
	for(var l = 0; l<itemsToHeap.length;l++){
		itemsToHeap[l].yPerSample[sampleIndex] = yScale(itemsToHeap[l].yPerSample[sampleIndex]);
	}
	return popMean;
}
function heapYValues2(itemsToHeap, xScale, radius, sampleIndex, areaTopY, areaBottomY){
	var levels = [[]];
	var mean = 0;
	var maxY = 0;
	for(var i = 0; i < itemsToHeap.length;i++){
		var thisItem = itemsToHeap[i];
		thisItem.xPerSample[sampleIndex] = xScale(thisItem.value);
		thisItem.yPerSample[sampleIndex] = 0;
		var closest = null;
		var dist = -1;
		for(var k = levels.length-1;k>=0;k--){
			for(var j = 0; j< levels[k].length;j++){
				var thisDist = Math.abs(levels[k][j].xPerSample[sampleIndex] - thisItem.xPerSample[sampleIndex]);
				if(dist < 0 | thisDist < dist){
					dist = thisDist;
					closest = levels[k][j];
				}
			}
			if(dist > 0 && dist < radius * 0.5){
				if(closest.level  >= levels.length) levels.push([]);
					thisItem.level = closest.level + 1;
					thisItem.yPerSample[sampleIndex] = closest.yPerSample[sampleIndex] +((radius*2) * Math.pow(1,thisItem.level));
					levels[thisItem.level - 1].push(thisItem);
					if(thisItem.yPerSample[sampleIndex] > maxY){
						maxY = thisItem.yPerSample[sampleIndex];
					}
				break;
			}else{
				dist = -1;
			}
		}
		if(dist < 0){
			levels[0].push(thisItem);
		}

		
	}
	mean = mean/population.length;
	yScale = d3.scale.linear().range([areaBottomY,Math.max(areaBottomY - maxY,areaTopY+radius*2)]);
	yScale.domain([0,maxY]);
	for(var l = 0; l<itemsToHeap.length;l++){
		itemsToHeap[l].yPerSample[sampleIndex] = yScale(itemsToHeap[l].yPerSample[sampleIndex]);
	}
	return mean;
}

function heapYValues3(itemsToHeap, xScale, radius, sampleIndex, areaTopY, areaBottomY){
	var section = radius * 0.8;
	var buckets = {};
	var maxY = 0;
	var mean = 0;
	for(var i = 0; i < itemsToHeap.length;i++){
		var thisItem = itemsToHeap[i];
		thisItem.xPerSample[sampleIndex] = xScale(thisItem.value);
		thisItem.yPerSample[sampleIndex] = 0;

		var nearest = Math.round(thisItem.xPerSample[sampleIndex] / section)*section;
		if(!(nearest in buckets)){
			buckets[nearest] = [];
		}
		thisItem.yPerSample[sampleIndex] = radius * buckets[nearest].length;
		mean += thisItem.xPerSample[sampleIndex];
		buckets[nearest].push(thisItem);
		if(thisItem.yPerSample[sampleIndex] > maxY){
			maxY = thisItem.yPerSample[sampleIndex];
		}
	}
		mean = mean/itemsToHeap.length;
	yScale = d3.scale.linear().range([areaBottomY,Math.max(areaBottomY - maxY,areaTopY+radius*2)]);
	yScale.domain([0,maxY]);
	for(var l = 0; l<itemsToHeap.length;l++){
		itemsToHeap[l].yPerSample[sampleIndex] = yScale(itemsToHeap[l].yPerSample[sampleIndex]);
	}
	return mean;
}

function stop(){
	animationState = 0;
}