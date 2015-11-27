/*
var winHeight;
var winWidth;
var pop1Mean;
var pop2Mean;
var population1 = null;
var population2 = null;
var this.populations = [[],[]];
var this.samples = [];
var means; 
var sampleMeans = [];
var this.baseTransitionSpeed = 1000;
var this.transitionSpeed = this.baseTransitionSpeed;
var preCalculatedTMeans = [];
var totalMeans = [];
var currentTotMean = 0;
var totalMean;
var s1Bottom = 0;
var s2Bottom = 0;
var s3Bottom = 0;
var margin = 0; */




function twoMeans(inputData, headingGroup, headingContinuous, statistic){
	this.animationState = 0;
	this.numSamples = 1000;
	this.yScale;
	this.xScale;
	this.xScale2;
	this.radius = 5;
	this.populations = {};
	this.populationStatistic = null;
	this.samples = null;
	this.preCalculatedTStat = [];
	this.transitionSpeed = 1000;
	this.index = 1;
	this.statsDone = false;
	this.baseTransitionSpeed = 1000;
	this.groups = [];
	this.groupStats = {};
	this.sampleSize = 10;
	this.windowHelper = setUpWindow(this.radius);
	this.populations = {};

	this.setUpPopulation = function(){
		var max = null;
		var min = null;
		//var dataGroup = ["female","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","male","male","female","female","female","female","female","female","female","male","female","female","female","female","female","male","female","female","female","male","female","male","female","female","male","female","female","male","female","female","female","female","female","male","female","male","female","female","female","female","female","female","female","male","male","male","female","female","male","male","male","male","female","female","female","male","male","female","female","female","female","female","male","female","female","female","male","female","female","female","female","male","female","male","female","female","female","male","female","male","female","female","female","male","female","female","female","male","female","male","male","male","male","female","female","male","female","male","female","female","female","female","female","female","female","male","male","male","female","female","male","female","female","female","female","male","male","male","male","female","female","female","male","male","male","male","male","female","female","female","male","male","female","female","female","male","male","male","male","female","male","female","female","male","female","male","female","female","female","male","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","male","female","male","female","female","female","female","male","female","female","female","female","male","female","male","female","female","male","male","male","male","female","female","female","female","male","male","male","female","female","female","male","male","female","male","female","male","male","male","female","male","male","female","female","female","male","male","female","female","female","male","female","female","female","male","female","male","female","female","male","male","female","male","female","female","male","male","female","female","male","female","female","female","female","male","female","female","female","male","male","male","male","female","female","female","male","female","male","male","male","male","female","female","female","female","female","male","female","female","male","male","female","male","female","female","female","male","female","male","female","male","female","male","male","female","female","male","female","female","female","female","male","male","female","male","female","female","female","male","female","female","female","female","male","female","male","female","male","male","male","female","female","female","male","female","female","female","male","male","female","female","male","female","female","female","male","female","female","female","male","male","female","female","female","female","female","male","male","male","male","male","female","female","female","male","female","female","female","female","female","female","female","female","female","female","female","female","female","male","male","male","male","female","male","male","male","female","male","female","female","female","male","female","female","female","male","male","female","male","female","female","female","female","female","female","male","male","male","male","male","female","male","female","male","female","female","male","female","male","female","male","male","male","female","female","female","female","female","male","female","male","female","female","female","male","female","female","female","female","male","female","female","male","female","male","male","male","male","male","female","female","female","male","male","female","male","female","male","female","female","female","male","male","male","male","female","male","male","female","male","male","female","female","male","male","female","female","male","female","female","female","female","female","male","female","male","male","female","female","female","male","male","male","female","male","male","male","male","male","female","male","female","male","female","male","male","female","male","female","male","male","female","male","male","female","female","female","male","male","female","male","male","male","female","female","male","male","female","male","male","female","female","female","male","female","female","male","female","female","female","male","female","male","male","male","female","female","male","female","male","male","male","male","female","male","female","female","female","female","male","male","male","female","female","female","male","female","female","male","male","female","male","female","female","male","male","female","female","male","female","female","female","female","male","female","male","female","female","male","male","female","female","female","female","female","male","female","female","female","male","female","male","female","male","male","female","female","male","female","male","female","female","male","female","male","male","female","female","male","female","female","female","male","female","female","male","male","female","female","male","male","female","female","male","male","female","female","female","male","female","male","female","female","female","male","female","male","male","female","female"];
		//var data = [48,60,70,61,94,50,58,69,40,45,96,65,54,63,50,67,65,71,58,50,55,47,58,56,48,67,54,55,78,50,60,95,50,54,60,58,54,60,55,59,70,58,45,85,42,50,52,55,60,112,75,88,48,55,55,45,61,49,52,73,69,83,64,54,73,60,58,67,56,54,56,70,74,50,60,56,65,44,90,70,60,68,62,90,55,58,50,85,60,85,55,50,58,54,41,62,65,70,52,70,60,75,55,60,50,80,100,63,70,59,55,80,70,85,44,44,59,45,80,50,90,80,60,100,68,60,75,54,68,57,55,88,130,70,75,58,75,56,88,65,60,80,78,62,98,62,72,93,58,65,67,85,60,65,86,58,98,55,60,67,50,80,52,65,62,96,51,60,70,77,57,43,70,67,66,45,52,50,59,52,62,110,76,60,52,65,75,55,105,46,48,60,70,70,58,85,62,60,76,60,85,73,65,80,72,70,65,85,70,58,62,62,65,65,55,80,78,83,56,67,65,76,86,80,59,65,81,70,79,63,120,68,58,74,46,65,60,66,55,60,73,78,50,79,60,60,70,64,57,54,70,57,47,157,57,75,81,50,95,72,70,65,68,67,60,65,74,50,79,73,55,86,70,56,60,62,48,75,63,60,80,72,53,54,51,85,58,58,78,72,62,92,58,65,63,60,83,50,50,55,52,48,71,76,54,80,50,62,60,63,60,46,60,47,78,72,47,75,77,67,63,40,75,60,75,60,50,52,60,80,49,91,78,63,55,56,62,60,50,45,60,80,60,49,53,43,48,69,61,73,71,74,60,60,50,79,59,58,66,60,63,52,47,45,58,54,58,120,55,85,93,80,62,56,68,100,80,52,68,65,54,53,60,70,49,50,75,80,58,70,61,56,55,60,53,68,90,106,70,78,75,73,60,60,95,50,72,69,64,110,45,64,75,60,48,62,58,69,45,78,52,84,63,60,68,60,61,70,57,56,68,60,69,68,70,78,87,70,106,72,53,54,60,70,68,56,78,60,76,42,43,90,60,65,78,60,50,85,87,62,72,70,43,75,77,72,56,65,69,35,83,55,58,55,82,60,85,89,65,58,65,49,55,70,47,140,65,85,50,79,45,78,59,47,59,64,64,60,70,75,68,68,61,79,101,62,50,173,83,70,68,70,85,68,75,60,68,65,40,64,60,58,58,67,71,64,50,62,54,66,74,58,60,73,88,70,40,80,65,62,62,81,60,83,60,60,58,58,52,90,60,66,93,75,75,63,66,70,52,81,74,65,60,60,60,86,86,65,49,50,57,55,67,63,70,47,57,72,57,87,68,62,54,47,57,45,75,48,60,57,69,67,60,67,70,85,54,45,64,67,96,54,40,72,54,60,78,56,60,65,59,68,52,72,65,53,60,87,46,45,65,60,58,62,87,74,53,56,60,64,69,60,65,68,55,79,60,60,65,80,59];
		for(var i = 0; i < inputData.length;i++){
			var thisItem = new Object();
			var inputItem = inputData[i];
			if(!(inputItem[headingGroup] in this.populations)) {
				this.populations[inputItem[headingGroup]] = [];
				 this.groups.push(inputItem[headingGroup]);
			}
			thisItem.group = inputItem[headingGroup];
			thisItem.value = +inputItem[headingContinuous];
			if(max == null | thisItem.value > max) max = thisItem.value;
			if(min == null | thisItem.value < min) min = thisItem.value;
			thisItem.xPerSample = {};
			thisItem.yPerSample = {};
			thisItem.id = i;
			this.populations[thisItem.group].push(thisItem)
		}
		this.xScale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
		this.xScale.domain([min,max]);
		var s = [];
		for(var j =0; j <this.groups.length;j++){
			var top = (this.windowHelper.section1.top +(this.windowHelper.section1.height/this.groups.length) * j);
			var bottom = (this.windowHelper.section1.top +(this.windowHelper.section1.height/this.groups.length) * (j + 1));
			heapYValues3(this.populations[this.groups[j]], this.xScale, this.radius, 0, top,bottom);
			var stat = getStatistic(statistic,this.populations[this.groups[j]]);
			this.groupStats[this.groups[j]] = stat;
			s.push(stat);
		}

			var newItem = new item(s[1]-s[0], i);
			newItem.s0 = s[0];
			newItem.s1 = s[1];
			this.preCalculatedTStat.push(newItem);

	}
	this.setUpSamples = function(){
		if(this.groups.length == 2){
			var range = this.makeSample(this.populations, this.numSamples, this.sampleSize,statistic);
			this.xScale2 = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
			this.xScale2.domain(range);
			for(var j =0;j<2;j++){
				var top = (this.windowHelper.section2.top +(this.windowHelper.section2.height/2) * j);
				var bottom = (this.windowHelper.section2.top +(this.windowHelper.section2.height/2) * (j + 1));
				for(var k = 0;k<this.numSamples;k++){
					heapYValues3(this.samples[j][k], this.xScale, this.radius,k+1,top,bottom);
				}
			}
			heapYValues3(this.preCalculatedTStat,this.xScale2,this.radius,0,this.windowHelper.section3.top,this.windowHelper.section3.bottom);
		}
		this.statsDone = true;
	}


this.makeSample = function(populations, numSamples, sampleSize, statistic){
	var group1Samples = [];
	var group2Samples = [];
	this.samples = [[],[]];
	var largestDiff = null;
	var smallestDiff = null;
	for(var i = 0; i<numSamples;i++){
		var cut = Math.ceil(Math.random()*(sampleSize-1));
		this.samples[0].push([]);
		this.samples[1].push([]);
		var groupIndexs = [[],[]];
		groupIndexs[0] = pickRand(cut, populations[this.groups[0]].length);
		groupIndexs[1] = pickRand(sampleSize - cut, populations[this.groups[1]].length);
		var stats = [];
		for(var j = 0; j < 2;j++){
			for(var k = 0; k<groupIndexs[j].length;k++){
				this.samples[j][i].push(populations[this.groups[j]][groupIndexs[j][k]]);
			}
			var s = getStatistic(statistic, this.samples[j][i]);
			stats.push(s);
		}
		var diff = stats[1] - stats[0];
		if(largestDiff == null | diff > largestDiff) largestDiff = diff;
		if(smallestDiff == null | diff < smallestDiff) smallestDiff = diff;
		var newItem = new item(diff, i);
		newItem.s0 = stats[0];
		newItem.s1 = stats[1];
		this.preCalculatedTStat.push(newItem);
	}
	return [smallestDiff, largestDiff];
}
this.draw = function(){
		var self = this;
	if(!this.statsDone) return;
	var TRANSITIONSPEED = 1000;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(this.xScale)
	var xAxis2 = d3.svg.axis();
	xAxis2.scale(this.xScale2);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis2);
	for(var i = 0;i<this.groups.length;i++){
		var pos = (this.windowHelper.section1.top +(this.windowHelper.section1.height/this.groups.length) * (i + 1));
		svg.append("svg").attr("id","pop"+i);
		svg.select("#pop"+i).selectAll("circle").data(this.populations[this.groups[i]]).enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1);
		svg.select("#pop"+i).append("line").attr("x1", this.xScale(this.groupStats[this.groups[i]])).attr("x2", this.xScale(this.groupStats[this.groups[i]])).attr("y1", pos+20).attr("y2", pos-20).style("stroke-width", 2).style("stroke", "black");
	} 
	if(this.groups.length > 2) return;
	var middle = this.windowHelper.section1.top +(this.windowHelper.section1.height/2) + this.radius*2;
	svg.append("line").attr("x1", this.xScale(this.preCalculatedTStat[0].s0)).attr("x2", this.xScale(this.preCalculatedTStat[0].s1)).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "red");
	svg.append("line").attr("x1", this.xScale2(this.preCalculatedTStat[0].value)).attr("x2", this.xScale2(this.preCalculatedTStat[0].value)).attr("y1", this.windowHelper.section3.top).attr("y2", this.windowHelper.section3.bottom).style("stroke-width", 2).style("stroke", "red");

	var middle = this.windowHelper.section2.top +(this.windowHelper.section2.height/2) + this.radius * 2;
	svg.append("svg").attr("class","sampleDiffs");
	svg.append("svg").attr("class","sampleLines2");
	var samplesLines = svg.select(".sampleLines").selectAll("line").data(this.preCalculatedTStat).enter();
		samplesLines.append("line").attr("x1", function(d){return self.xScale(d.s0);}).attr("x2", function(d){return self.xScale(d.s0);}).attr("y1", middle - self.radius * 3).attr("y2", middle + this.radius * 1).style("stroke-width", 2).style("stroke", "black").style("opacity",0);
	svg.select(".sampleLines2").selectAll("line").data(this.preCalculatedTStat).enter().append("line").attr("x1", function(d){return self.xScale(d.s1);}).attr("x2", function(d){return self.xScale(d.s1);}).attr("y1", this.windowHelper.section2.bottom + this.radius * 2).attr("y2", this.windowHelper.section2.bottom - this.radius * 2).style("stroke-width", 2).style("stroke", "black").style("opacity",0);

	var meanCircles = svg.select(".sampleDiffs").selectAll("circle").data(this.preCalculatedTStat)
		.enter().append("line")
		.attr("x1", function(d){
			var r = self.xScale(d.s0);
			return r;
		}).attr("x2", function(d){
			var r = self.xScale(d.s1);
			return r;
		})
		.attr("y1", middle).attr("y2", middle).style("visibility","hidden")
		.style("stroke-width", 2).style("stroke", "red").style("opacity",0);
	var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(this.preCalculatedTStat)
		.enter().append("circle")
	    .attr("cx", function(d, i) { 
	    	return d.xPerSample[0]; })
	    .attr("cy", function(d) {
	    	return d.yPerSample[0] - (self.windowHelper.section3.bottom- self.windowHelper.section3.bottom);
	    })
	    .attr("r", function(d) { return self.radius; })
	    .attr("fill-opacity", 0)
	    .attr("stroke","#556270")
	    .attr("stroke-opacity",0)
	    .style("visibility","hidden");
}
this.startAnim = function(repititions, goSlow){
	if(repititions >999) this.resetLines();
	if(this.animationState == 0){
		this.transitionSpeed = this.baseTransitionSpeed-repititions*20;
		this.animationState = 1;
		var start = this.index;
		var end = start + repititions;
		if(repititions > 100) this.transitionSpeed = 0;
		var jumps = 1;
		if(repititions > 20) jumps = 10;
		this.stepAnim(start, end, goSlow, jumps);
	}
}
this.stepAnim = function(indexUpTo, goUpTo, goSlow, jumps){
		var self = this;
	var svg = d3.select(".svg");
	if(this.animationState != 1){
		return;
	}
	if(indexUpTo < goUpTo){
		if(indexUpTo >= this.numSamples){
			this.animationState = 0;
			return
		}

		var delay = 1;
		if(goSlow){
			delay = 1000;
		}else{
			delay = 10;
		}
		var allInSample = this.samples[0][indexUpTo].concat(this.samples[1][indexUpTo]);
		shuffle(allInSample);
		for(var j =0;j<2;j++){
			var sample = this.samples[j][indexUpTo];
			var circle = svg.select("#pop"+j).selectAll("circle").filter(function(d,i){
				return sample.indexOf(d) >= 0;
			});
			if(goSlow){
				circle = circle.transition().delay(function(d,i){return delay/allInSample.length * allInSample.indexOf(d)}).duration(100).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(function(d,i){return delay/allInSample.length * (allInSample.length - allInSample.indexOf(d))});
			}else{
				circle = circle.style("fill", "#FF7148").attr("fill-opacity", 1);
			}
			if(this.transitionSpeed <= 100){
				circle.attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
				.transition().duration(delay)
				.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[0]}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo + jumps, goUpTo, goSlow, jumps)}});
			}else{
				circle.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
				.transition().duration(function(){if(goSlow){ return delay + self.transitionSpeed * 2} return delay})
				.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[0]}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo + jumps, goUpTo, goSlow, jumps)}});
			}
		}
		var sampMean = this.preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);
		svg.select(".sampleLines").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(this.transitionSpeed/2).delay(this.transitionSpeed*0.5+delay).style("opacity",1)
			.transition().duration(delay)
			.transition().duration(this.transitionSpeed).style("opacity",0);
		svg.select(".sampleLines2").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(this.transitionSpeed/2).delay(this.transitionSpeed*0.5+delay).style("opacity",1)
			.transition().duration(delay)
			.transition().duration(this.transitionSpeed).style("opacity",0);

		var diffLine = svg.select(".sampleDiffs").selectAll("line").filter(function(d, i){
			return i == indexUpTo+1;
		}).style("visibility","visible").transition().duration(this.transitionSpeed/2).delay(this.transitionSpeed*0.5+delay).style("opacity",1)
			.transition().duration(delay);
		if(!(this.transitionSpeed <= 100)){
			diffLine.transition().duration(this.transitionSpeed).attr("x1",function(d){
						var goTo = self.xScale2(d.value);
						return goTo-d.value/2;
					}).attr("x2",function(d){
						var goTo = self.xScale2(d.value);
						return goTo+d.value/2;
					}).attr("y1", this.windowHelper.section3.bottom).attr("y2", this.windowHelper.section3.bottom).each('end', function(d){
						var middle = self.windowHelper.section2.top +(self.windowHelper.section2.height/2) + self.radius * 2;
						d3.select(this).attr("x1", function(d){
						var r = self.xScale(d.s0);
						return r;
					}).attr("x2", function(d){
						var r = self.xScale(d.s1);
						return r;
					})
					.attr("y1", middle).attr("y2", middle)
					.style("stroke-width", 2).style("stroke", "red").style("opacity",0);
				});
		}else{
			diffLine.transition().duration(this.transitionSpeed).style("opacity",0);
		}
		svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
			return sampMean.indexOf(d) >= 0;
		}).style("fill","red").style("visibility","visible").transition().delay(function(d){ if(goSlow){return delay*3 + self.transitionSpeed}else{return self.transitionSpeed*2}}).attr("fill-opacity",1).attr("stroke-opacity",1).style("fill","#C7D0D5");
	}else{
		this.animationState = 0;
	}
	this.index += jumps;
	this.index = this.index % this.numSamples;

}

this.destroy = function(){
	d3.select(".svg").selectAll("*").remove();
	d3.select(".svg").append("svg").attr("class","sampleLines");
	d3.select(".svg").append("svg").attr("class","meanOfSamples");
	this.resetData();
	loadMain();
}
	this.stop = function(){
	this.animationState = 0;
	}

this.resetData = function(){
	windowHelpers = null;
	this.radius = 5;
	this.populations = {};
	this.populationStatistic = null;
	this.samples = null;	
	this.preCalculatedTStat = [];
	this.transitionSpeed = 1000;
	this.index = 0;
	this.statsDone = false;
	this.animationState = 0;
	this.baseTransitionSpeed = 1000;
	this.groups = [];
	this.groupStats = {};
}

this.resetLines = function(){
	var self = this;
	this.index = 1;
	var svg = d3.select(".svg");
		svg.select(".sampleLines").selectAll("line").style("opacity",0);
		svg.select("#pop1").selectAll("circle").attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1).style("fill", "#C7D0D5");
		svg.select("#pop0").selectAll("circle").attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1).style("fill", "#C7D0D5");
		svg.select(".sampleLines2").selectAll("line").style("opacity",0);

		svg.select(".sampleDiffs").selectAll("line").style("opacity",0);

		svg.select(".meanOfSamples").selectAll("circle").attr("fill-opacity", 0).attr("stroke-opacity", 0);
}
}