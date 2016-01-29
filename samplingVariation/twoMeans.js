
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
	this.sampleSize = 40;
	this.windowHelper = setUpWindow(this.radius);
	this.populations = {};
	this.statistic = statistic;
		this.popSetup = false;
	this.sampSetup = false;
		this.drawnMeans = [];
		this.implemented = true;

	this.changeStat = function(newStatistic){
		this.statistic = newStatistic;
		this.destroy();
	}
	this.setUpPopulation = function(){
		this.sampleSize = 40;
		this.thirds = this.windowHelper.section2.height/4;
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
			var stat = getStatistic(this.statistic,this.populations[this.groups[j]]);
			this.groupStats[this.groups[j]] = stat;
			s.push(stat);
		}

			var newItem = new item(s[1]-s[0], i);
			newItem.s0 = s[0];
			newItem.s1 = s[1];
			this.preCalculatedTStat.push(newItem);
			this.popSetup = true;

			if(this.groups.length != 2){
				this.implemented = false;
			}

	}
	this.setUpSamples = function(sSize){
		if(sSize >= this.populations[this.groups[0]].length){
			alert("Sample size is too large for the poplation");
			return;
		}
		if(this.groups.length == 2){
			var range = this.makeSample(this.populations, this.numSamples, sSize,this.statistic);
			this.xScale2 = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
			var range2 = this.xScale.domain();
			var halfDiff = (range2[1]-range2[0])/2;
			this.xScale2.domain([0-halfDiff, 0+halfDiff]);
			for(var j =0;j<2;j++){
				var top = (this.windowHelper.section2.top +(this.windowHelper.section2.height/2) * j);
				var bottom = (this.windowHelper.section2.top +(this.windowHelper.section2.height/2) * (j + 1) - this.thirds);
				for(var k = 0;k<this.numSamples;k++){
					heapYValues3(this.samples[j][k], this.xScale, this.radius,k+1,top,bottom);
				}
			}
			heapYValues3(this.preCalculatedTStat,this.xScale2,this.radius,0,this.windowHelper.section3.top,this.windowHelper.section3.bottom);
		}else{
			mainControl.notImplemented();
		}
		this.statsDone = true;
		this.sampSetup = true;
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
	if(!this.popSetup) return;
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
		svg.select("#pop"+i).append("text").attr("y", pos).attr("x", this.windowHelper.innerWidth*0.9).text(this.groups[i]).attr("fill","red").style("font-size","0.75em").attr("text-anchor","left").style("opacity",1).style("font-size",this.windowHelper.section1.height / 10);
	} 
}

this.drawSample = function(){
	if(!this.sampSetup) return;
	var self = this;
	var svg = d3.select(".svg");
	if(this.groups.length > 2) return;
	var xAxis2 = d3.svg.axis();
	xAxis2.scale(this.xScale2);
	svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis2);
	d3.selectAll(".axis text").filter(function(d){
		return d == 0;
	}).style("font-size",20).style("font-weight",700);
	var middle = this.windowHelper.section1.top +(this.windowHelper.section1.height/4 * 3);
	//svg.append("line").attr("x1", this.xScale(this.preCalculatedTStat[0].s0)).attr("x2", this.xScale(this.preCalculatedTStat[0].s1)).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "red");
	drawArrow(this.xScale(this.preCalculatedTStat[0].s1), this.xScale(this.preCalculatedTStat[0].s0), middle, svg, "popDiff", 1, "blue");
	svg.append("text").attr("x", this.xScale(this.preCalculatedTStat[0].s1)).attr("y", middle).text(Math.round((this.preCalculatedTStat[0].s1 - this.preCalculatedTStat[0].s0)*100)/100).style("stroke","blue");
	svg.append("line").attr("x1", this.xScale2(this.preCalculatedTStat[0].value)).attr("x2", this.xScale2(this.preCalculatedTStat[0].value)).attr("y1", this.windowHelper.section3.bottom + this.radius*8).attr("y2", this.windowHelper.section3.bottom + this.radius).style("stroke-width", 2).style("stroke", "blue");
	//drawArrow(this.xScale2(this.preCalculatedTStat[0].value), this.xScale2(0), this.windowHelper.section3.bottom + this.radius, svg, "popDiffBot", 1, "blue");
	svg.append("text").attr("x", this.xScale2(this.preCalculatedTStat[0].value)).attr("y",this.windowHelper.section3.bottom + this.radius*8).text(Math.round((this.preCalculatedTStat[0].s1 - this.preCalculatedTStat[0].s0)*100)/100).style("stroke","blue");

	var middle = this.windowHelper.section2.top +(this.windowHelper.section2.height/2) + this.radius * 2;
	svg.append("svg").attr("class","sampleDiffs");
	svg.append("svg").attr("class","sampleLines2");
	//var samplesLines = svg.select(".sampleLines").selectAll("line").data(this.preCalculatedTStat).enter();
	//	samplesLines.append("line").attr("x1", function(d){return self.xScale(d.s0);}).attr("x2", function(d){return self.xScale(d.s0);}).attr("y1", middle - self.radius * 3).attr("y2", middle + this.radius * 1).style("stroke-width", 2).style("stroke", "black").style("opacity",0);
	//svg.select(".sampleLines2").selectAll("line").data(this.preCalculatedTStat).enter().append("line").attr("x1", function(d){return self.xScale(d.s1);}).attr("x2", function(d){return self.xScale(d.s1);}).attr("y1", this.windowHelper.section2.bottom + this.radius * 2).attr("y2", this.windowHelper.section2.bottom - this.radius * 2).style("stroke-width", 2).style("stroke", "black").style("opacity",0);

	/*var meanCircles = svg.select(".sampleDiffs").selectAll("circle").data(this.preCalculatedTStat)
		.enter().append("line")
		.attr("x1", function(d){
			var r = self.xScale(d.s0);
			return r;
		}).attr("x2", function(d){
			var r = self.xScale(d.s1);
			return r;
		})
		.attr("y1", middle).attr("y2", middle).style("visibility","hidden")
		.style("stroke-width", 2).style("stroke", "red").style("opacity",0); */
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
	    .attr("stroke-opacity",0);
	   // .style("visibility","hidden");
	var overlayContainer = svg.append("svg").attr("id","circleOverlay");
	overlayContainer.append("svg").attr("id","circleOverlayStill");
	overlayContainer.append("svg").attr("id","circleOverlayDrop");
}
/*this.startAnim = function(repititions, goSlow){
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
} */
	this.startAnim = function(repititions, goSlow, incDist){
		//this.fadeIn(goSlow, this.index);
		d3.select(".sampleLines").selectAll("*").remove();
				this.drawnMeans = [];
		if(repititions >999) this.resetLines();
		if(this.animationState == 0){
			if(repititions == 1) this.transitionSpeed = 1000;
			if(repititions == 5) this.transitionSpeed = 500;
			if(repititions == 20) this.transitionSpeed = 100;
			if(repititions == 1000) this.transitionSpeed = 0;
			//this.animationState = 1;
			if(this.index > this.numSamples){
				this.index = this.index % this.numSamples;
				this.resetLines();
			}
			var start = this.index;
			var end = start + repititions;
			if(repititions > 100) this.transitionSpeed = 0;
			var jumps = 1;
			if(repititions > 20) 
			{
				jumps = 2;
				if(incDist) jumps = 10;
			}
			//this.stepAnim(start, end, goSlow, jumps, incDist);
			var settings = new Object();
			settings.goSlow = goSlow;
			settings.indexUpTo = start;
			settings.incDist = incDist;
			settings.end = end;
			settings.jumps = jumps;
			settings.delay = 1000;
			settings.pauseDelay = this.transitionSpeed;
			settings.fadeIn = 200;
			settings.repititions = repititions;
			this.fadeIn(settings);
		} 
	}
	this.fadeIn = function(settings){
		if(this.animationState == 1) return;
		this.animationState = 1;
		this.settings = settings;
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;
			//settings.sample = this.samples[settings.indexUpTo];
			settings.svg = d3.select(".svg");
			this.settings = settings;

			var allInSample = this.samples[0][settings.indexUpTo].concat(this.samples[1][settings.indexUpTo]);
			shuffle(allInSample);

			settings.allInSample = allInSample;

			//settings.svg.select(".sampleLines").selectAll("line").style("opacity",0.2).style("stroke", "steelblue");
			d3.select(".meanOfSamples").selectAll("g").remove();
			settings.svg.select(".sampleLines").selectAll("*").remove();
			this.drawnMeans = [];
			var powScale = d3.scale.pow();
			powScale.exponent(4);
			powScale.domain([0,settings.delay*2]);
			var circleOverlay = settings.svg.select("#circleOverlay").selectAll("g").data([]);
			circleOverlay.exit().remove();
			circleOverlay = settings.svg.select("#circleOverlay").selectAll("g").data(allInSample, function(d){return d.id});
				circleOverlay.attr("fill-opacity",0);
				circleOverlay.exit().remove();
				var groups = circleOverlay.enter().append("g");
				groups.append("circle")
				.attr("class", "still")
			    .attr("cx", function(d, i) { 
			    	return d.xPerSample[0]; })
			    .attr("cy", function(d) {
			    	return d.yPerSample[0];
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 0)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",1)
			    .style("fill","#FF7148");

				groups.append("circle")
				.attr("class", "move")
			    .attr("cx", function(d, i) { 
			    	return d.xPerSample[0]; })
			    .attr("cy", function(d) {
			    	return d.yPerSample[0];
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 0)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",1)
			    .style("fill","#FF7148");
		    var fillInTime = this.transitionSpeed/this.baseTransitionSpeed;
		    this.settings.circleOverlay = circleOverlay;
		    this.settings.powScale = powScale;
		}else{
			var circleOverlay = this.settings.circleOverlay;
			var powScale = this.settings.powScale;
			var self = this;
		    var fillInTime = this.transitionSpeed/this.baseTransitionSpeed;
		    this.settings.restarting = false;
		}
		if(settings.goSlow){
			circleOverlay = settings.svg.select("#circleOverlay").selectAll("circle").transition().delay(function(d,i){
					//return delay*2/sample.length * sample.indexOf(d)
					var test = (powScale.invert(i +2 )- powScale.invert(1 )) * fillInTime;
					return test;
				}).duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(function(d,i){return settings.delay*2/settings.allInSample.length * (settings.allInSample.length - settings.allInSample.indexOf(d))}).each('end', function(d, i){
					if(d == settings.allInSample[0]){
						self.dropDown(settings)
						sentFinish = true;
					}
				});
		}else{
			circleOverlay = settings.svg.select("#circleOverlay").selectAll("circle").style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(1).each('end', function(d, i){
					if(d == settings.allInSample[0]){
						self.dropDown(settings)
						sentFinish = true;
					}
				});
		}
	}

	this.dropDown = function(settings){
		if(this.animationState == 2) return;
			this.animationState = 2;
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;


			var circle = settings.svg.select("#circleOverlay").selectAll(".move");
		var test = [this.samples[0][settings.indexUpTo], this.samples[1][settings.indexUpTo]];
		var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo + 1, settings.indexUpTo+settings.jumps + 1);
			/*if(sampMean.length > 1){
				this.drawnMeans = this.drawnMeans.concat(sampMean.slice(0,-1));
				mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
				mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);
				mLines.style("opacity",0.2).style("stroke", "steelblue");
				this.drawnMeans.push(sampMean[sampMean.length-1]);
			}else{
				this.drawnMeans = this.drawnMeans.concat(sampMean);
			} */
			this.drawnMeans.push(sampMean[sampMean.length -1]);
				var middle = this.windowHelper.section2.top +(this.windowHelper.section2.height/2) + this.radius * 2;
			var mLines = settings.svg.select(".sampleLines").selectAll("g").data(this.drawnMeans);
			//mLines.style("opacity",0.2).style("stroke", "steelblue");
			mLines.remove();
			var meanLineG = mLines.enter().append("g");
			meanLineG.append("line").attr("x1", function(d){return self.xScale(d.s0);}).attr("x2", function(d){return self.xScale(d.s0);}).attr("y1", middle - self.radius * 10 - this.thirds).attr("y2", middle + this.radius * 10 -this.thirds).style("stroke-width", 3).style("stroke", "black").style("opacity",0);
			meanLineG.append("line").attr("x1", function(d){return self.xScale(d.s1);}).attr("x2", function(d){return self.xScale(d.s1);}).attr("y1", this.windowHelper.section2.bottom + this.radius * 10 - this.thirds).attr("y2", this.windowHelper.section2.bottom - this.radius * 10 - this.thirds).style("stroke-width", 3).style("stroke", "black").style("opacity",0);
			drawArrow(function(d){return self.xScale(d.s1);},function(d){return self.xScale(d.s0);},middle, meanLineG, "diffLine", 0, "red")
			//meanLineG.append("line").attr("id","differenceLine").attr("x1", function(d){return self.xScale(d.s0);}).attr("x2", function(d){return self.xScale(d.s1);}).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "black").style("opacity",0);
			this.settings.circle = circle;
			this.settings.sampMean = sampMean;
			this.settings.mLines = mLines;
			this.settings.meanLineG = meanLineG;

		}else{
			var self = this;
			var circle = this.settings.circle;
			var sampMean = this.settings.sampMean;
			var mLines = this.settings.mLines;
			var meanLineG = this.settings.meanLineG;
					    this.settings.restarting = false;
		}

		
		if(settings.goSlow){
				circle = circle.transition().duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
					.transition().duration(settings.pauseDelay)
					.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[settings.indexUpTo+1]})
					.transition().duration(settings.pauseDelay * 2)
					.each('end', function(d, i){

						if(d == settings.allInSample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								d3.select("#differenceLine").remove();
								self.animStepper(settings);
							}
							sentFinish = true;
						}
					});

				meanLineG.selectAll("line").transition().duration(settings.pauseDelay + this.transitionSpeed).transition().duration(settings.fadeIn).style("opacity", 1);

				/*meanLines = meanLines.transition().duration(settings.fadeIn).style("opacity",1)
					.transition().duration(settings.pauseDelay)
					.transition().duration(this.transitionSpeed).attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight)
				*/

		}else{
				circle = circle.attr("cy", function(d, i){return d.yPerSample[settings.indexUpTo+1]}).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(this.transitionSpeed + 1)
				.each('end', function(d, i){
						if(d == settings.allInSample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								d3.select("#differenceLine").remove();
								self.animStepper(settings);
							}
							sentFinish = true;
						}
					});

			meanLineG.selectAll("line").style("opacity", 1);		
		}

	}


	this.distDrop = function(settings){
		d3.select(".meanOfSamples").selectAll("g").remove();
		if(this.animationState == 3) return;
			this.animationState = 3;
		if(!this.settings.restarting){
			var sentFinish = false;
			var self = this;
				var middle = this.windowHelper.section2.top +(this.windowHelper.section2.height/2) + this.radius * 2;
			var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo+1, settings.indexUpTo+settings.jumps+1);
			if(this.transitionSpeed > 200){
				var downTo = this.preCalculatedTStat[settings.indexUpTo+1].yPerSample[0];
				var redLine = settings.svg.select(".meanOfSamples").selectAll("g").data(sampMean).enter().append("g");
	
				var to = this.xScale(sampMean[0].s1);
				var from = this.xScale(sampMean[0].s0);
				var diff = (to-from) / 10;
				var yValue = middle;
				redLine.append("line").attr("x1", function(d){
					return self.xScale(d.s0);
				}).attr("x2", function(d){
					return self.xScale(d.s1);
				}).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "red").style("opacity",0).attr("id", "redlineMain");
				redLine.append("line").attr("x1", to).attr("x2", to - diff).attr("y1", middle).attr("y2", middle + diff).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
				redLine.append("line").attr("x1", to).attr("x2", to - diff).attr("y1", middle).attr("y2", middle - diff).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
			}
			var meanCircles = settings.svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
				return (i>=settings.indexUpTo+1) && (i <settings.indexUpTo+settings.jumps+1);
			});

			this.settings.sampMean = sampMean;
			this.settings.meanCircles = meanCircles;
			this.settings.diff = diff;
		}else{
			var downTo = this.preCalculatedTStat[settings.indexUpTo+1].yPerSample[0];
			var rL = this.settings.redLine;
			d3.select("#redLine").remove();
			var redLine = settings.svg.select(".meanOfSamples").append("g");
			if(rL){
				var test = rL[0] + this.settings.diff ;
				redLine.append("line").attr("x1", rL[1]).attr("x2", rL[2]).attr("y1", rL[0]).attr("y2", rL[0]).style("stroke", "red").style("opacity", 1).attr("id","redlineMain");
				redLine.append("line").attr("x1", rL[2]).attr("x2", rL[2] - settings.diff).attr("y1", rL[0]).attr("y2", rL[0]-0 + settings.diff).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
				redLine.append("line").attr("x1", rL[2]).attr("x2", rL[2] - settings.diff).attr("y1", rL[0]).attr("y2", rL[0] - settings.diff).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
			} //var redLine =  settings.svg.select(".meanOfSamples").append("line").attr("id","redLine").attr("y1", rL[0]).attr("y2", rL[1]).attr("x1",rL[2]).attr("x2",rL[2]).style("stroke-width", 2).style("stroke", "red").style("opacity", 0);
			var self = this;
			var sampMean = this.settings.sampMean;
			var meanCircles = this.settings.meanCircles;

			this.settings.restarting = false;
		}
		//if(this.transitionSpeed <= 100){
		//	meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5");
		//}else{
			if(this.transitionSpeed > 200){
				var acrossTo = this.preCalculatedTStat[settings.indexUpTo+1].xPerSample[0];
				d3.select("#redlineMain").style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", downTo).attr("x1", this.xScale2(0)).attr("x2", acrossTo);
				d3.selectAll(".arrowHead").style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", function(d,i){return downTo + Math.pow(-1, i)*self.settings.diff }).attr("x1", acrossTo).attr("x2", acrossTo - self.settings.diff);

			}
			if(settings.goSlow || this.transitionSpeed == 500){
				meanCircles = meanCircles.transition().delay(this.transitionSpeed*2).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]}).each('end', function(d, i){
					if(!sentFinish){
						self.animStepper(settings);
						sentFinsih = true;
					}
				});
			}else{
				meanCircles = meanCircles.attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]})
					.transition().duration(this.transitionSpeed*2);
					setTimeout(self.animStepper(settings), 100);
			}
		//}
	}

	this.animStepper = function(settings){
		if(this.animationState == 4) return;
		this.animationState = 4;
		settings.indexUpTo += settings.jumps;
		this.index += settings.jumps;
		if(settings.indexUpTo >= settings.end  || settings.indexUpTo>= this.numSamples){
			mainControl.doneVis();
			this.animationState = 0;
			if(settings.repititions == 1000 && settings.incDist){
				d3.select(".meanOfSamples").selectAll("g").remove();
				settings.svg.select(".sampleLines").selectAll("*").remove();
				var circleOverlay = settings.svg.select("#circleOverlay").selectAll("g").data([]);
				circleOverlay.exit().remove();
			}
			return;
		}
		this.fadeIn(settings);

	}

/*this.stepAnim = function(indexUpTo, goUpTo, goSlow, jumps){
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

} */

this.destroy = function(){
	d3.select(".svg").selectAll("*").remove();
	d3.select(".svg").append("svg").attr("class","sampleLines");
	d3.select(".svg").append("svg").attr("class","meanOfSamples");
	this.resetData();
	//loadMain();
}
	this.stop = function(){
	this.animationState = 0;
	this.resetLines();
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
			this.drawnMeans = [];
				d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
	var self = this;
	this.index = 1;
	var svg = d3.select(".svg");
		svg.select(".sampleLines").selectAll("*").remove();
		svg.select("#circleOverlay").selectAll("g").remove();
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
		this.animationState = 0;
}
this.pause = function(){

	var rL = d3.select("#redlineMain");
	if(rL[0][0] != null) {this.settings.redLine = [rL.attr("y1"), rL.attr("x1"), rL.attr("x2")]; 
	//rL.remove();
}
	d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
	this.pauseState = this.animationState;
	this.animationState = 0;
	d3.selectAll(".goButton").attr("disabled",true);
	this.settings.restarting = false;
}
this.unPause = function(){
	//this.resetLines();
	//d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
	//this.animationState = this.pauseState;
	this.settings.restarting = true;
	if(this.pauseState == 1){
		this.fadeIn(this.settings);
	}
	if(this.pauseState == 2){
		this.animationState = 1;
		this.dropDown(this.settings);
	}
	if(this.pauseState == 3){
		this.animationState = 2;
		this.distDrop(this.settings);
	}

			//this.animationState = 0;
	d3.selectAll(".goButton").attr("disabled",null);
}
}