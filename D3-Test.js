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
var totalMeans = [];
var currentTotMean = 0;

var totalMean;
window.onload = function(){
	var winWidth = window.innerWidth*0.8;
	var winHeight = window.innerHeight - 100;
	var SIZE = 5;
	var TOPMARGIN = 1;
	var STATE = 0;
	var TRANSITIONSPEED = 1000;
	var data = [10, 20, 50, 150,20,20];
	var data2 = [636, 623,615,672,601,600,542,554,543,520,609,559,595,565,573,554,626,501,574,468,578,560,525,647,456,688,679,960,558,482,527,536,557,572,457,489,532,506,648,485,610,444,626,626,426,585,487,436,642,476,586,565,617,528,578,472,485,539,523,479,535,603,512,449];
	var data3 = [];
	for(var o = 0; o < 100; o++){
		var randNum = Math.ceil(Math.random()*100);
		data3.push(randNum);
	}
	data = data3;
	var hMap = {}
	var svg = d3.select(".svg");
	//svg.attr("width", winWidth);
	//svg.attr("height", winHeight);
	//svg.style("margin-left", "10px");

	var x = d3.scale.linear().range([SIZE + TOPMARGIN,winWidth - SIZE - TOPMARGIN - 10]);
	x.domain([d3.min(data), d3.max(data)]);

	/*var xAxis = d3.svg.axis();
	xAxis.scale(x) */
/*
	var circle = svg.selectAll("circle")
	    .data(data);
	   circle.enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return x(d); })
	    .attr("cy", function(d) {
	    	if(!(d in hMap)){
	    		hMap[d] = 0;
	    	}else{
	    		hMap[d] = hMap[d] += SIZE*2 + TOPMARGIN*2;
	    	}
	    	return winHeight/3 - hMap[d];
	    })
	    .attr("r", function(d) { return SIZE; })
	    .attr("opacity", 1)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1); 
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 + 20) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 * 2 + 20) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 * 2.5 + 20) + ")").call(xAxis); */
	var popMean = findMean(data);
	//svg.append("line").attr("x1", x(popMean)).attr("y1", winHeight/3 + 20).attr("x2", x(popMean)).attr("y2", winHeight/3 - 20).style("stroke-width", 2).style("stroke", "black");
	var sampleMeans = [];
	var sample = [];
	var hMap2 = {};
	var placements = {};
	
	document.onkeypress = function(e){
		e =e || window.event;

		if(e.keyCode == 115 && STATE == 0){
			sample = pickRand(20, data.length);
			hMap2 = {};
			placements = {};
			var found = false;
			circle.filter(function(d,i){
				return sample.indexOf(i) >= 0;
			})
			.transition().duration(TRANSITIONSPEED)
		    .attr("cy", function(d, i){
		    		placements[i] = d3.select(this).attr("cy");
		    		if(!(d in hMap2)){
			    		hMap2[d] = 0;
			    	}else{
			    		hMap2[d] = hMap2[d] += 11;
			    	}
			    	return winHeight/3*2 - hMap2[d];

		    }).each('start', function(d){d3.select(this).style("fill", "#FF7148")});
			var sampMean = findMean(sample);
			sampleMeans.push(sampMean);
			var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
			meanLines.enter().append("line").attr("x1", function(d){return x(d)}).attr("y1", winHeight/3 + 20).attr("x2", function(d){return x(d)}).attr("y2", winHeight/3 - 20).style("stroke-width", 2).style("stroke", "green").style("opacity", 0)
					.transition().duration(TRANSITIONSPEED).attr("y1", winHeight/3 * 2 + 20).attr("y2", winHeight/3 * 2 - 20).style("opacity", 1);
			STATE = -1;
			setTimeout(function(){
				STATE = 1;
			}, TRANSITIONSPEED*0.9);

		}
		if(e.keyCode == 115 && STATE == 1){
			var meanOfSamples  = findMean(sampleMeans);
			svg.select(".meanOfSamples").append("line").attr("x1", x(meanOfSamples)).attr("y1", winHeight/3 * 2 + 30).attr("x2", x(meanOfSamples)).attr("y2", winHeight/3 * 2 - 30).style("stroke-width", 2).style("stroke", "#EC583A").style("opacity", 0)
				.transition().duration(TRANSITIONSPEED).attr("y1", winHeight/3 * 2.5 + 20).attr("y2", winHeight/3 * 2.5 - 20).style("opacity", 1);
		}

		if(e.keyCode == 119 && STATE == 1){
			hMap = {}
			circle.filter(function(d,i){
				return sample.indexOf(i) >= 0;
			})
			.transition().duration(TRANSITIONSPEED)
			    .attr("cy", function(d, i) {
			    	return placements[i];
			    })
			    .style("fill","#C7D0D5");
			var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
			meanLines.transition().duration(TRANSITIONSPEED).attr("y2", winHeight/3 * 2 - 10).attr("y1", winHeight/3 * 2 + 10).style("stroke", "steelblue");
			
			hMap2 = {};
			STATE = -1;
			setTimeout(function(){
				STATE = 0;
			}, TRANSITIONSPEED*0.9);
			
		}
		
	}
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

function Start(){
	winWidth = window.innerWidth*0.8;
	winHeight = window.innerHeight*0.99;
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
	for(var j = 0; j < population.length;j++){
		var thisItem = population[j];
		thisItem.x = xScale(thisItem.value);
		popMean+= thisItem.value;
		if(j != 0){
			var lastItem = population[j-1];
			if(thisItem.x - lastItem.x <= radius*0.2){
				thisItem.level = lastItem.level + 1;
				thisItem.y = lastItem.y +((radius*2) * Math.pow(0.99,thisItem.level));
				if(thisItem.y > maxY){
					maxY = thisItem.y;
					maxStack++;
				}
			}else{
				thisItem.y = 0;
			}
		}else{
			thisItem.y = 0;
		}
	}
	popMean = popMean/population.length;

	yScale = d3.scale.linear().range([winHeight/3 -1,Math.max((winHeight/3) - maxY,radius)]);
	yScale.domain([0,maxY]);
	samples = makeSamples(population, 1000, 20);
	for(var l = 0; l<population.length;l++){
		population[l].y = yScale(population[l].y);
	}
	var maxYs = [];
	for(var k = 0; k < 1000;k++){
		samples[k].sort(function(a,b){return a.value - b.value});
		maxY = 0;
		for(var j = 0; j < 20;j++){
			var thisItem = samples[k][j];
			thisItem.y2[k] = 0;
			thisItem.level2[k] = 1;
			if(j != 0){
				var lastItem = samples[k][j-1];
				if(thisItem.x - lastItem.x <= radius*0.2){
					thisItem.level2[k] = lastItem.level2[k] + 1;
					thisItem.y2[k] = lastItem.y2[k] +((radius*2) * Math.pow(0.99,thisItem.level2[k]));
					if(thisItem.y2[k] > maxY){
						maxY = thisItem.y2[k];
					}
				}else{
					thisItem.y2[k] = 0;
					thisItem.level2[k] = 1;
				}
			}else{
				thisItem.y2[k] = 0;
				thisItem.level2[k] = 1;
			}

		}
		maxYs.push(maxY);
		var yScale2 = d3.scale.linear().range([winHeight/3*2 -1,Math.max((winHeight/3*2) - maxY,radius)]);
			yScale2.domain([0,maxY]);
		for(var l = 0; l<20;l++){
			samples[k][l].y2[k] = yScale2(samples[k][l].y2[k]);
		}
		//samples[k].push(maxY);
	}
	samples.push(maxYs);
	d3.select(".controls").append("input").attr("name", "do10").attr("type", "button").attr("value","do10").attr("onClick", "startAnim(10, false)");
	d3.select(".controls").append("input").attr("name", "do1").attr("type", "button").attr("value","do1").attr("onClick", "startAnim(1,true)");
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
		//samples[i].push(mean);
	}
	var totalMean = findMean(means);
	samples.push(means);
	samples.push(totalMean);
	return samples;
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
}
function draw(){
	if(!statsDone) return;
	var TRANSITIONSPEED = 1000;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(xScale)
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 + 20) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 * 2 + 20) + ")").call(xAxis);

	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (winHeight/3 * 2.5 + 20) + ")").call(xAxis);
	var circle = svg.selectAll("circle")
	    .data(population);
	   circle.enter().append("circle")
	    .attr("cx", function(d, i) { 

	    	return d.x; })
	    .attr("cy", function(d) {
	    	return d.y;
	    })
	    .attr("r", function(d) { return radius; })
	    .attr("fill-opacity", 0.5)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",1);
	svg.append("line").attr("x1", xScale(popMean)).attr("y1", winHeight/3 + 20).attr("x2", xScale(popMean)).attr("y2", winHeight/3 - 20).style("stroke-width", 2).style("stroke", "black");
	var indexUpTo = 1;
	means = samples[samples.length-3];
	totalMean = samples[samples.length -2];
	sampleMeans = [];
			//down(1, 10);
	
}
function startAnim(repititions, goSlow){
	var start = Math.ceil(Math.random() * (1001-repititions));
	var end = start + repititions;
		down(start, end, goSlow);

	currentTotMean = 0;
	for(var i = start;i<end;i++){
		currentTotMean += means[i];
	}
	currentTotMean = currentTotMean/repititions;
}
function down(indexUpTo, goUpTo, goSlow){
	var svg = d3.select(".svg");
	if(indexUpTo < goUpTo){

	var circle = svg.selectAll("circle");
	var sample = samples[indexUpTo];
	var found = false;
		var delay = 0;
	if(goSlow) delay = 1000;
	if(goSlow){
		circle.filter(function(d,i){
		return sample.indexOf(d) >= 0;
	})
	.transition().duration(TRANSITIONSPEED).style("fill", "#FF7148").attr("fill-opacity", 1).each('end', function(){
		d3.select(this).transition().duration(TRANSITIONSPEED).delay(delay)
  	  .attr("cy", function(d, i){
		    	return d.y2[indexUpTo];

   	 	}).each('start', function(d){d3.select(this).style("fill", "#FF7148")}).each('end', function(d, i){ if(d == sample[0]){ TRANSITIONSPEED = TRANSITIONSPEED*0.95; up(indexUpTo, goUpTo, goSlow)}});
	});
	}else{
		circle.filter(function(d,i){
			return sample.indexOf(d) >= 0;
		})
		.transition().duration(TRANSITIONSPEED)
  	  .attr("cy", function(d, i){
		    	return d.y2[indexUpTo];

   	 	}).each('start', function(d){d3.select(this).style("fill", "#FF7148")}).each('end', function(d, i){ if(d == sample[0]){ TRANSITIONSPEED = TRANSITIONSPEED*0.95; up(indexUpTo, goUpTo, goSlow)}});
	}
	var sampMean = means[indexUpTo];
	sampleMeans.push(sampMean);
	var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
	meanLines.enter().append("line").attr("x1", function(d){return xScale(d)}).attr("y1", winHeight/3 + 20).attr("x2", function(d){return xScale(d)}).attr("y2", winHeight/3 - 20).style("stroke-width", 2).style("stroke", "green").style("opacity", 0)
			.transition().duration(TRANSITIONSPEED).delay(delay*2).attr("y1", winHeight/3 * 2 + 20).attr("y2", winHeight/3 * 2 - 20).style("opacity", 1);
		}else{
			TRANSITIONSPEED = baseTransitionSpeed;
			var meanOfSamples  = totalMean;
			totalMeans.push(currentTotMean);
			svg.select(".meanOfSamples").selectAll("line").data(totalMeans).enter().append("line").attr("x1", function(d){return xScale(d)}).attr("y1", winHeight/3 * 2 + 30).attr("x2", function(d){return xScale(d)}).attr("y2", winHeight/3 * 2 - 30).style("stroke-width", 2).style("stroke", "#EC583A").style("opacity", 0)
				.transition().duration(1000).attr("y1", winHeight/3 * 2.5 + 20).attr("y2", winHeight/3 * 2.5 - 20).style("opacity", 1);
			currentTotMean = 0;

		}
}
function up(indexUpTo, goUpTo, goSlow){
	var svg = d3.select(".svg");
	if(indexUpTo < goUpTo){
		var newIdex = indexUpTo +1;
		if(TRANSITIONSPEED < 500){
			newIdex += 9;
	}
	var delay = 0;
	if(goSlow) delay = 1000;
	var circle = svg.selectAll("circle");
	var sample = samples[indexUpTo];
	var found = false;
	circle.filter(function(d,i){
		return sample.indexOf(d) >= 0;
	})
	.transition().duration(TRANSITIONSPEED).delay(delay)
    .attr("cy", function(d, i){
	    	return d.y;

    }).style("fill", "#C7D0D5").attr("fill-opacity",0.5).each('end', function(d, i){ if(d == sample[0]){ TRANSITIONSPEED = TRANSITIONSPEED*0.95; down(newIdex, goUpTo, goSlow)}});
    			var meanLines = svg.select(".sampleLines").selectAll("line").data(sampleMeans);
			meanLines.transition().duration(TRANSITIONSPEED).attr("y2", winHeight/3 * 2 - 10).attr("y1", winHeight/3 * 2 + 10).style("stroke", "steelblue");
	}
}

function resetLines(){
	sampleMeans = [];
	totalMeans = [];
	d3.select(".svg").select(".sampleLines").selectAll("line").data(sampleMeans).exit().remove();
	d3.select(".svg").select(".meanOfSamples").selectAll("line").data(sampleMeans).exit().remove();


}