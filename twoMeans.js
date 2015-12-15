
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
		for(var i = 0; i < inputData.length;i++){
			var thisItem = new Object();
			var inputItem = inputData[i];
			if(!(inputItem[headingGroup] in this.populations)) {
				this.populations[inputItem[headingGroup]] = [];
				 this.groups.push(inputItem[headingGroup]);
			}
			thisItem.group = inputItem[headingGroup];
			thisItem.value = +inputItem[headingContinuous];
			if(isNaN(thisItem.value)) continue;
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
	this.drawPop();
	this.drawSample();
}
this.drawPop = function(){
	var self = this;
	var TRANSITIONSPEED = 1000;
	var sampleMeans = [];
	var svg = d3.select(".svg");
	var xAxis = d3.svg.axis();
	xAxis.scale(this.xScale)
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);

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
		svg.select("#pop"+i).append("text").attr("y", pos).attr("x", this.windowHelper.innerWidth*0.9).text(this.groups[i]).attr("fill","red").style("font-size","0.75em").attr("text-anchor","left").style("opacity",1);
	} 
}
this.drawSample = function(){
	var self = this;
	var svg = d3.select(".svg");
	if(this.groups.length > 2) return;
	var xAxis2 = d3.svg.axis();
	xAxis2.scale(this.xScale2);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis2);
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
			var circle = svg.select("#pop"+j).selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0]}).style("fill", "#C7D0D5").attr("fill-opacity",0.1).filter(function(d,i){
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
				//.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[0]}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo + jumps, goUpTo, goSlow, jumps)}});
			}
		}
		var sampMean = this.preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);
		svg.select(".sampleLines").selectAll("line").style("opacity",0).filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(this.transitionSpeed/2).delay(this.transitionSpeed*0.5+delay).style("opacity",1)
			.transition().duration(delay)
			//.transition().duration(this.transitionSpeed).style("opacity",0);
		svg.select(".sampleLines2").selectAll("line").style("opacity",0).filter(function(d, i){
			return i == indexUpTo+1;
		}).transition().duration(this.transitionSpeed/2).delay(this.transitionSpeed*0.5+delay).style("opacity",1)
			.transition().duration(delay);
			//.transition().duration(this.transitionSpeed).style("opacity",0);

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
	//loadMain();
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