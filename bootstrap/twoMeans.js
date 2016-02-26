
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
		this.xScale = d3.scale.linear().range([this.windowHelper.sampleSection,this.windowHelper.innerWidth]);
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
		this.populationStatistic = newItem.value;
		this.allPop = this.populations[this.groups[0]].concat(this.populations[this.groups[1]]);

	}
	this.setUpSamples = function(sSize){
		var self = this;
		sSize = this.populations[this.groups[0]].concat(this.populations[this.groups[1]]).length;
		var statList = [];

		if(this.groups.length == 2){
			var largeNum = 10000;
			statList = [];
			var tenK = this.makeSample(this.populations, largeNum, sSize,this.statistic);
				statList = tenK[2];
			
			statList.sort(function(a,b){
				if(Math.abs(self.populationStatistic - a ) < Math.abs(self.populationStatistic - b)) return -1;
				if(Math.abs(self.populationStatistic - a ) > Math.abs(self.populationStatistic - b)) return 1;
				return 0;
			});
			var CISplit = Math.abs(this.populationStatistic - statList[this.numSamples*0.95]);
			this.LargeCISplit = CISplit;

			var ret = this.makeSample(this.populations, this.numSamples, sSize,this.statistic);
			var range = [ret[0],ret[1]];
			statList = ret[2];
			this.xScale2 = d3.scale.linear().range([this.windowHelper.sampleSection,this.windowHelper.innerWidth]);
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

			statList.sort(function(a,b){
				if(Math.abs(self.populationStatistic - a ) < Math.abs(self.populationStatistic - b)) return -1;
				if(Math.abs(self.populationStatistic - a ) > Math.abs(self.populationStatistic - b)) return 1;
				return 0;
			})

			CISplit = Math.abs(this.populationStatistic - statList[this.numSamples*0.95]);
			for(var k = 0; k < this.numSamples;k++){
				if(Math.abs(this.populationStatistic - this.preCalculatedTStat[k].value) >= CISplit){
					this.preCalculatedTStat[k].inCI = false;
				}else{
					this.preCalculatedTStat[k].inCI = true;
				}
			}
			this.CISplit = CISplit;
			heapYValues3(this.preCalculatedTStat,this.xScale2,this.radius,0,this.windowHelper.section3.top,this.windowHelper.section3.bottom);
		
		}else{
			mainControl.notImplemented();
		}
		this.statsDone = true;
		this.sampSetup = true;
	}


this.makeSample = function(populations, numSamples, sampleSize, statistic){
	this.preCalculatedTStat = [];
	var group1Samples = [];
	var group2Samples = [];
	this.samples = [[],[]];
	var largestDiff = null;
	var smallestDiff = null;
	var statList = [];
	for(var i = 0; i<numSamples;i++){
		this.samples[0].push([]);
		this.samples[1].push([]);
		var groupIndexs = [[],[]];
		var stats = [];
		for(var j = 0; j < sampleSize;j++){
				var group = Math.ceil(Math.random()*2) - 1;
				var index =	Math.ceil(Math.random()*populations[this.groups[group]].length) - 1;
				var nI = new item (populations[this.groups[group]][index].value, j);
				nI.popId = populations[this.groups[group]][index].id;
				nI.xPerSample[0] =populations[this.groups[group]][index].xPerSample[0];
				nI.yPerSample[0] =populations[this.groups[group]][index].yPerSample[0];
				nI.group =	populations[this.groups[group]][index].group;
				this.samples[group][i].push(nI);

		}
		var s = getStatistic(statistic, this.samples[0][i]);	
		stats.push(s);
		s = getStatistic(statistic, this.samples[1][i]);	
		stats.push(s);
		var diff = stats[1] - stats[0];
		statList.push(diff);
		if(largestDiff == null | diff > largestDiff) largestDiff = diff;
		if(smallestDiff == null | diff < smallestDiff) smallestDiff = diff;
		var newItem = new item(diff, i);
		newItem.s0 = stats[0];
		newItem.s1 = stats[1];
		this.preCalculatedTStat.push(newItem);
	}
	return [smallestDiff, largestDiff, statList];
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
	svg.append("svg").attr("class","pop");
	for(var i = 0;i<this.groups.length;i++){
		var pos = (this.windowHelper.section1.top +(this.windowHelper.section1.height/this.groups.length) * (i + 1));
		d3.select(".pop").append("svg").attr("id","pop"+i);
		svg.select("#pop"+i).selectAll("circle").data(this.populations[this.groups[i]]).enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1).attr("class",function(d){return "c"+d.id});
		svg.select("#pop"+i).append("line").attr("x1", this.xScale(this.groupStats[this.groups[i]])).attr("x2", this.xScale(this.groupStats[this.groups[i]])).attr("y1", pos+20).attr("y2", pos-50).style("stroke-width", 2).style("stroke", "black").style("stroke-width",3);
		svg.select("#pop"+i).append("text").attr("y", pos - this.thirds*1.1).attr("x", this.windowHelper.innerWidth*0.9).text(this.groups[i]).attr("fill","red").style("font-size","0.75em").attr("text-anchor","left").style("opacity",1).style("font-size",this.windowHelper.section1.height / 10);
		svg.select("#pop"+i).append("text").attr("y", pos+this.windowHelper.section2.top- this.thirds*0.7).attr("x", this.windowHelper.innerWidth*0.9).text(this.groups[i]).attr("fill","red").style("font-size","0.75em").attr("text-anchor","left").style("opacity",1).style("font-size",this.windowHelper.section1.height / 10);

	} 

		//svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).style("stroke-width", 2).style("stroke", "black");
		//svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", 0).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.height).style("stroke-width", 0.5).style("stroke", "black").attr("stroke-dasharray","5,5");
		var fS = getFontSize(this.windowHelper,this.allPop.length);
		var fontSize = fS[0];
		this.fontSize = fontSize;
		var titleFS = fS[1];
		var popText = svg.append("svg").attr("id","popText");
		svg.append("svg").attr("id","sampText");
		popText.append("rect").attr("width",self.windowHelper.sampleSectionDiv*3).attr("x", self.windowHelper.marginSample).attr("height",self.windowHelper.height - self.windowHelper.marginSample).attr("y", self.windowHelper.marginSample).attr("rx", "20").attr("ry","20").style("fill","#D0D0D0").style("stroke","black");
		popText.append("rect").attr("width",self.windowHelper.sampleSectionDiv*3).attr("x", self.windowHelper.marginSample*2 + self.windowHelper.sampleSectionDiv*3).attr("height",self.windowHelper.height - self.windowHelper.marginSample).attr("y", self.windowHelper.marginSample).attr("rx", "20").attr("ry","20").style("fill","#D0D0D0").style("stroke","black");
		svg.append("text").text(headingContinuous).attr("x",self.windowHelper.sampleSectionDiv*0 + self.windowHelper.marginSample).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",fontSize).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		svg.append("text").text(headingGroup).attr("x",self.windowHelper.sampleSectionDiv*2).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",fontSize).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		var popTextG = popText.selectAll("g").data(this.allPop).enter().append("g");
		popTextG.append("text").text(function(d){return d.value}).attr("x",self.windowHelper.sampleSectionDiv*0 +self.windowHelper.marginSample).attr("y",function(d,i){return (fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		popTextG.append("text").text(function(d){return d.group}).attr("x",self.windowHelper.sampleSectionDiv*2 -self.windowHelper.marginSample).attr("y",function(d,i){return (fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("stroke", function(d){return colorByIndex[self.groups.indexOf(d.group)]});

		svg.append("svg").attr("id","redTContainer");
		svg.append("text").text("ReSample").attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",fontSize*1.1).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");

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
	drawArrow(this.xScale(this.groupStats[this.groups[1]]), this.xScale(this.groupStats[this.groups[0]]), middle, svg, "popDiff", 1, "blue");
		svg.append("text").attr("x", this.xScale(this.preCalculatedTStat[0].s1)).attr("y", middle).text(Math.round((this.populationStatistic)*100)/100).style("stroke","blue").style("opacity",1);
	
	//drawArrow(this.xScale2(this.preCalculatedTStat[0].value), this.xScale2(0), this.windowHelper.section3.bottom + this.radius, svg, "popDiffBot", 1, "blue");
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
	    .attr("stroke-opacity",0)
	    .attr("class",function(d){
			    	if(d.inCI){
			    		return "inCI";
			    	}else{
			    		return "notInCI";
			    	}
			    });
	   // .style("visibility","hidden");
	var overlayContainer = svg.append("svg").attr("id","circleOverlay");
	overlayContainer.append("svg").attr("id","circleOverlayStill");
	overlayContainer.append("svg").attr("id","circleOverlayDrop");
	d3.select("#fadeButton").remove();
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
		if(repititions >900) this.resetLines();
		if(this.animationState == 0){
			if(repititions == 1) this.transitionSpeed = 1000;
			if(repititions == 5) this.transitionSpeed = 500;
			if(repititions == 20) this.transitionSpeed = 100;
			if(repititions == 1000) this.transitionSpeed = 0;
			//this.animationState = 1;
			if(this.index > this.numSamples*0.9){
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
			//if(repititions > 20) jumps = 10;
			//this.stepAnim(start, end, goSlow, jumps, incDist);

			this.showSteps = false;
			if(repititions == 1 && !incDist) {
				this.showSteps = d3.select("#trackCBox").property("checked");
			}

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
			this.buildList(settings);
		} 
	}

		this.fadeNumber = function(t){


		var self = t;
		self.waiting = false;
		if(self.pauseCalled){
			self.pause();
			return;
		}
		if(self.animationState == 0) return;
				this.animationState = 2;
						    this.settings.restarting = false;
		var i = 0;
		for(var k = 0;k<self.allPop.length;k++){
			if(self.allPop[k].id == self.settings.sample[self.upTo].popId){
				i = k;
				break;
			}
		}
		//var i = self.upTo;
		var speedTest = self.goTo - self.upTo;
		var speed = 250;
		if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist) {
			speed = 1000;
		}
		d3.select("#pointerArrow").remove();
		d3.selectAll("#redText").remove();
		d3.selectAll(".sCRemove").remove();
		d3.selectAll(".stepCircle").attr("fill-opacity", 0);
		//drawArrow(self.windowHelper.sampleSectionDiv, 0, self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2,d3.select("#sampText"), "pointerArrow", 1, "red" );
		d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv *0 + self.windowHelper.marginSample).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
		if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist){
			var rT2 = d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
			rT2.transition().duration(speed*0.75).attr("y",self.fontSize*(self.upTo+3)+self.windowHelper.marginSample*(self.upTo+2)).attr("x",self.windowHelper.marginSample*3 + self.windowHelper.sampleSectionDiv*3);
			rT2 = d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].group).attr("x",self.windowHelper.sampleSectionDiv*2 -self.windowHelper.marginSample).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("stroke", colorByIndex[self.groups.indexOf(self.settings.sample[self.upTo].group)]);
			rT2.transition().duration(speed*0.75).attr("y",self.fontSize*(self.upTo+3)+self.windowHelper.marginSample*(self.upTo+2)).attr("x",self.windowHelper.marginSample*-2 + self.windowHelper.sampleSectionDiv*5);

		}
		if(self.showSteps){
			var meanCircles = d3.select(".pop").selectAll("circle");
			meanCircles = meanCircles.filter(function(d){
				var test = (d.id == self.settings.sample[self.upTo].popId);
				return d.id == self.settings.sample[self.upTo].popId;
			});
			var posData = meanCircles.data()[0];
			d3.select("#sampText").append("circle").classed("stepCircle sCRemove",true)
		    .attr("cx", posData.xPerSample[0])
		    .attr("cy", posData.yPerSample[0])
		    .attr("r", self.radius)
		    .attr("fill-opacity", 1)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1)
		    .style("fill","black");
			var moveingCircle = d3.select("#sampText").append("circle").classed("stepCircle",true)
		    .attr("cx", posData.xPerSample[0])
		    .attr("cy", posData.yPerSample[0])
		    .attr("r", self.radius)
		    .attr("fill-opacity", 1)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1)
		    .style("fill","black");
		    if(speed > 500){
		   	 	moveingCircle.transition().duration(speed).attr("cy",self.settings.sample[self.upTo].yPerSample[self.settings.indexUpTo+1]).transition().duration(0).attr("fill-opacity", 0);
			}else{
		   	 	moveingCircle.attr("cy",self.settings.sample[self.upTo].yPerSample[self.settings.indexUpTo+1]).transition().duration(0);

			}
		}
		self.drawnResamps.push(self.settings.sample[self.upTo]);

		var popText = d3.select("#sampText").selectAll("g").data(self.drawnResamps);
		popText.selectAll("text").style("fill","black");
		var popTextG =popText.enter().append("g")

		popTextG.append("text").text(function(d){
			return d.value;
		}).attr("x",self.windowHelper.marginSample*3 + self.windowHelper.sampleSectionDiv*3).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("fill","red").style("opacity",function(){if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist){return 0}else{return 1}})
			.transition().delay(speed*0.75).duration(100).style("opacity",1);
		
		popTextG.append("text").text(function(d){
			return d.group;
		}).attr("x",self.windowHelper.marginSample*-2 + self.windowHelper.sampleSectionDiv*5).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("stroke", function(d){return colorByIndex[self.groups.indexOf(d.group)]}).style("opacity",function(){if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist){return 0}else{return 1}})
			.transition().delay(speed*0.75).duration(100).style("opacity",1);
		
		self.upTo += 1;
		if(self.upTo == self.goTo){
			this.fadeIn(self.settings);
			d3.select("#pointerArrow").remove();
			d3.selectAll("#redText").remove();
			d3.selectAll(".stepCircle").remove();
		popText.selectAll("text").style("fill","black");
			return true;
		}else{
			self.waiting = true;
			setTimeout(function(){
				self.fadeNumber(self)
			}, speed);
		}
	}
	this.trackPoints = function(t){

		var self = t;
		self.waiting = false;
		if(self.pauseCalled){
			self.pause();
			return;
		}
		if(self.animationState == 0) return;
				this.animationState = 3;
						    this.settings.restarting = false;
		if(self.upTo == self.goTo){
			var i = self.upTo;
			if(self.settings.incDist){
				self.distDrop(self.settings);
			}else{
				self.animStepper(self.settings);
			}
			d3.select("#pointerArrow").remove();
			d3.selectAll("#redText").remove();
			d3.selectAll(".stepCircle").remove();
					d3.select("#circleOverlay").selectAll(".c"+(i-1)).style("fill","#FF7148");
		d3.select(".pop").selectAll(".c"+(i-1)).style("fill","#C7D0D5").attr("fill-opacity",0.5);
			return true;
		}
		var i = self.upTo;
		var selected = self.allPop[i];
		var curId = selected.id;
		if(i != 0){
			var prevId = self.allPop[i-1].id;
		}else{
			var prevId = -1;
		}
		var speed = 1000;
		d3.select("#pointerArrow").remove();
		d3.selectAll("#redText").remove();
		d3.selectAll(".stepCircle").remove();
		d3.select("#circleOverlay").selectAll(".c"+(prevId)).style("fill","#FF7148");
		d3.select(".pop").selectAll(".c"+(prevId)).style("fill","#C7D0D5").attr("fill-opacity",0.5);

		//drawArrow(self.windowHelper.sampleSectionDiv, 0, self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2,d3.select("#sampText"), "pointerArrow", 1, "red" );
		d3.select("#redTContainer").append("text").attr("id","redText").text(self.allPop[self.upTo].value).attr("x",self.windowHelper.marginSample).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
		d3.selectAll(".c"+curId).style("fill","black").attr("fill-opacity",1);
		var inSample = d3.select("#circleOverlay").selectAll(".c"+(curId)).data();
		for(var inS = 0; inS < inSample.length; inS++){
			var k = self.settings.sample.indexOf(inSample[inS]);
			d3.select("#redTContainer").append("line").attr("id","redText").attr("x1", self.windowHelper.sampleSectionDiv ).attr("x2",self.windowHelper.marginSample*3 + self.windowHelper.sampleSectionDiv*3).attr("y1", self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2).attr("y2", self.fontSize*(k+3)+self.windowHelper.marginSample*(k+2) - self.fontSize/2).style("stroke","red");
			d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[k].value).attr("x",self.windowHelper.marginSample*3 + self.windowHelper.sampleSectionDiv*3).attr("y",self.fontSize*(k+3)+self.windowHelper.marginSample*(k+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
		}

		self.upTo += 1;
		self.waiting = true;
		setTimeout(function(){
			self.trackPoints(self)
		}, speed);
	}
	this.buildList = function(settings){
		var self = this;
		this.animationState = 1;
		settings.sample = this.samples[0][settings.indexUpTo].concat(this.samples[1][settings.indexUpTo]);
		shuffle(settings.sample);
		settings.svg = d3.select(".svg");
		this.settings = settings;
		settings.svg.select("#circleOverlay").selectAll("circle").data([]).exit().remove();
		//var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
		var opacity = 1;
		if(settings.repititions == 1000) opacity = 0.2;
		//mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
		//var fontSize = (this.windowHelper.height - (this.allPop.length+2)*this.windowHelper.marginSample) / (this.allPop.length+2);
		//this.fontSize = fontSize;
		var popText = d3.select("#sampText");
		popText = popText.selectAll("g").data([]);
		popText.exit().remove();
		var i = this.upTo;
			
		if(settings.repititions == 1 || (settings.repititions == 5 && !settings.incDist)){
			this.drawnResamps = [];
			this.upTo = 0;
			this.goTo = settings.sample.length ;

			this.fadeNumber(this);
		}else{
			popText = d3.select("#sampText").selectAll("g").data(settings.sample);

			var popTextG =popText.enter().append("g");
			popTextG.append("text").text(function(d){
				return d.value;
			}).attr("x",self.windowHelper.marginSample*3 + self.windowHelper.sampleSectionDiv*3).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
			popTextG.append("text").text(function(d){
				return d.group;
			}).attr("x",self.windowHelper.marginSample*-2 + self.windowHelper.sampleSectionDiv*5).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("stroke", function(d){return colorByIndex[self.groups.indexOf(d.group)]});

			this.fadeIn(settings);
		}

	}
	this.fadeIn = function(settings){
		if(this.animationState == 4) return;
		this.animationState = 4;
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
			//d3.select(".meanOfSamples").selectAll("g").remove();
			//settings.svg.select(".sampleLines").selectAll("*").remove();
			//this.drawnMeans = [];
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
			    	return d.xPerSample[settings.indexUpTo+1]; })
			    .attr("cy", function(d) {
			    	return d.yPerSample[settings.indexUpTo+1];
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 0)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",1)
			    .style("fill","#FF7148").attr("class",function(d){return "c"+d.popId});

				/*groups.append("circle")
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
			    .style("fill","#FF7148"); */
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


		var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
		if(!sampMean) {
			this.animStepper(settings);
			return;
		}
		for(var k = 0;k<sampMean.length-1;k++){
			this.drawnMeans.push(sampMean[k]);
		}
			var middle = this.windowHelper.section2.top +(this.windowHelper.section2.height/2) + this.radius * 2;
			if(this.drawnMeans.length > 0){
			var mLines = settings.svg.select(".sampleLines").selectAll("g").data(this.drawnMeans);
			var meanLineG = mLines.enter().append("g");
			meanLineG.append("line").attr("class","memLine").attr("x1", function(d){return self.xScale(d.s0);}).attr("x2", function(d){return self.xScale(d.s0);}).attr("y1", middle + self.radius * 10 - this.thirds).attr("y2", middle - this.radius * 10 -this.thirds).style("stroke-width", 3).style("stroke", "black").style("opacity",1);
			meanLineG.append("line").attr("class","memLine").attr("x1", function(d){return self.xScale(d.s1);}).attr("x2", function(d){return self.xScale(d.s1);}).attr("y1", this.windowHelper.section2.bottom + this.radius * 10 - this.thirds).attr("y2", this.windowHelper.section2.bottom - this.radius * 10 - this.thirds).style("stroke-width", 3).style("stroke", "black").style("opacity",1);
		
			d3.selectAll(".memLine").style("opacity",0.2).style("stroke","steelblue").attr("y2",function(){ return d3.select(this).attr("y1")-self.thirds/2});
			d3.selectAll("#diffLine").remove();
		}
			this.drawnMeans.push(sampMean[sampMean.length-1]);
		mLines = settings.svg.select(".sampleLines").selectAll("g").data(this.drawnMeans);
		meanLineG = mLines.enter().append("g");
		meanLineG.append("line").attr("class","memLine").attr("x1", function(d){
			return self.xScale(d.s0);}).attr("x2", function(d){return self.xScale(d.s0);}).attr("y1", middle + self.radius * 10 - this.thirds).attr("y2", middle - this.radius * 10 -this.thirds).style("stroke-width", 3).style("stroke", "black").style("opacity",1);
		meanLineG.append("line").attr("class","memLine").attr("x1", function(d){return self.xScale(d.s1);}).attr("x2", function(d){return self.xScale(d.s1);}).attr("y1", this.windowHelper.section2.bottom + this.radius * 10 - this.thirds).attr("y2", this.windowHelper.section2.bottom - this.radius * 10 - this.thirds).style("stroke-width", 3).style("stroke", "black").style("opacity",1);
		drawArrow(function(d){return self.xScale(d.s1);},function(d){return self.xScale(d.s0);},middle, meanLineG, "diffLine", 1, "red")


		if(self.showSteps){
			this.upTo = 0;
			this.goTo = settings.sample.length ;
			setTimeout(function(){
			self.trackPoints(self)
			}, this.transitionSpeed);
			return;
		}

		if(settings.goSlow){
			circleOverlay = settings.svg.select("#circleOverlay").selectAll("circle").transition().delay(function(d,i){
					return 1;
				}).duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(this.transitionSpeed*3).each('end', function(d, i){
						if(d == settings.allInSample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								d3.select("#differenceLine").remove();
								self.animStepper(settings);
							}
						}
				});
		}else{
			circleOverlay = settings.svg.select("#circleOverlay").selectAll("circle").style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(this.transitionSpeed*2).each('end', function(d, i){
						if(d == settings.allInSample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								d3.select("#differenceLine").remove();
								self.animStepper(settings);
							}
						}
				});
		}
	}

	this.dropDown = function(settings){
		if(this.animationState == 5) return;
			this.animationState = 5;
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;


			var circle = settings.svg.select("#circleOverlay").selectAll(".move");
		var test = [this.samples[0][settings.indexUpTo], this.samples[1][settings.indexUpTo]];
		var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
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
		if(this.animationState == 5) return;
			this.animationState = 5;
		if(!this.settings.restarting){
			var sentFinish = false;
			var self = this;
				var middle = this.windowHelper.section2.top +(this.windowHelper.section2.height/2) + this.radius * 2;
			var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
			if(this.transitionSpeed > 200){
				var downTo = this.preCalculatedTStat[settings.indexUpTo].yPerSample[0];
				var redLine = settings.svg.select(".meanOfSamples").selectAll("g").data(sampMean).enter().append("g");
	
				var to = this.xScale(sampMean[0].s1);
				var from = this.xScale(sampMean[0].s0);
				var toScaled = sampMean[0].s1 - sampMean[0].s0;
				var diff = (to-from) / 10;
				var yValue = middle;
				if(Math.abs(diff) < headSize) headSize =Math.abs(diff)*0.5;
				if(diff != 0) {var arrowHead = diff / Math.abs(diff);} else { var arrowHead = 0;}

		var diff = to - from;
		var headSize = 20;

		var arrow = drawArrow(function(d){
					return self.xScale(d.s1);
				}, function(d){
					return self.xScale(d.s0);
				}, middle, redLine, "redlineMain", 1, "red");
		arrow[1].transition().duration(2000).attr("y1",this.windowHelper.section3.bottom).attr("y2",this.windowHelper.section3.bottom + headSize*arrowHead/2).attr("x1",this.xScale2(toScaled)).attr("x2", this.xScale2(toScaled) - arrowHead*headSize);
		arrow[2].transition().duration(2000).attr("y1",this.windowHelper.section3.bottom).attr("y2",this.windowHelper.section3.bottom -headSize*arrowHead/2).attr("x1",this.xScale2(toScaled)).attr("x2", this.xScale2(toScaled) - arrowHead*headSize);
		arrow[0].transition().duration(2000).attr("x1",this.xScale2(0)).attr("x2",this.xScale2(toScaled)).attr("y1",this.windowHelper.section3.bottom).attr("y2",this.windowHelper.section3.bottom);


				/*redLine.append("line").attr("x1", function(d){
					return self.xScale(d.s0);
				}).attr("x2", function(d){
					return self.xScale(d.s1);
				}).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "red").style("opacity",0).attr("id", "redlineMain");
				redLine.append("line").attr("x1", to).attr("x2", to - diff).attr("y1", middle).attr("y2", middle + diff).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
				redLine.append("line").attr("x1", to).attr("x2", to - diff).attr("y1", middle).attr("y2", middle - diff).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
			*/} 
			var meanCircles = settings.svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
				return (i>=settings.indexUpTo) && (i <settings.indexUpTo+settings.jumps);
			});

			this.settings.sampMean = sampMean;
			this.settings.meanCircles = meanCircles;
			this.settings.diff = diff;
		}else{
			var downTo = this.preCalculatedTStat[settings.indexUpTo].yPerSample[0];
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
				var acrossTo = this.preCalculatedTStat[settings.indexUpTo].xPerSample[0];
				//d3.select("#redlineMain").style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", downTo).attr("x1", this.xScale2(0)).attr("x2", acrossTo);
				//d3.selectAll(".arrowHead").style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", function(d,i){return downTo + Math.pow(-1, i)*self.settings.diff }).attr("x1", acrossTo).attr("x2", acrossTo - self.settings.diff);

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
		if(this.animationState == 6) return;
		this.animationState = 6;
		settings.indexUpTo += settings.jumps;
		this.index += settings.jumps;
		if(settings.indexUpTo >= settings.end || settings.indexUpTo>= this.numSamples-10){
			mainControl.doneVis();
			if(settings.repititions == 1000 && settings.incDist){
				var svg = d3.select(".svg").append("g").attr("id","meanBox");
				d3.selectAll(".CIButton").attr("disabled",null);
			}
			this.animationState = 0;
			return;
		}
		this.buildList(settings);

	}

	this.showCI = function(num){
		var self = this;
		var CIVar = this.CISplit;
		var svg = d3.select(".svg");
		if(num == "10000"){
			CIVar = this.LargeCISplit;
		}
		svg.append("svg").attr("id","CISplit");

		var middle = this.windowHelper.section1.top +(this.windowHelper.section1.height/4 * 3);
		var to = this.xScale(this.preCalculatedTStat[0].s1);
		var from = this.xScale(this.preCalculatedTStat[0].s0);
		var diff = to - from;
		var headSize = 20;
		if(Math.abs(diff) < headSize) headSize =Math.abs(diff)*0.5;
		if(diff != 0) {var arrowHead = diff / Math.abs(diff);} else { var arrowHead = 0;}
		var arrow = drawArrow(this.xScale(this.groupStats[this.groups[1]]), this.xScale(this.groupStats[this.groups[0]]), middle, svg, "CISplit", 1, "blue");
		arrow[1].transition().duration(2000).attr("y1",this.windowHelper.section3.bottom).attr("y2",this.windowHelper.section3.bottom + headSize*arrowHead/2).attr("x1",this.xScale2(this.populationStatistic)).attr("x2", this.xScale2(this.populationStatistic) - arrowHead*headSize);
		arrow[2].transition().duration(2000).attr("y1",this.windowHelper.section3.bottom).attr("y2",this.windowHelper.section3.bottom -headSize*arrowHead/2).attr("x1",this.xScale2(this.populationStatistic)).attr("x2", this.xScale2(this.populationStatistic) - arrowHead*headSize);
		arrow[0].transition().duration(2000).attr("x1",this.xScale2(0)).attr("x2",this.xScale2(this.populationStatistic)).attr("y1",this.windowHelper.section3.bottom).attr("y2",this.windowHelper.section3.bottom)
			.transition().duration(500).each("end",function(){
				svg.append("text").attr("x", self.xScale2(self.populationStatistic)).attr("y", self.windowHelper.section3.bottom + self.radius*8).text(Math.round(self.populationStatistic*100)/100).style("stroke","blue").style("opacity",1);
				svg.append("line").attr("x1", self.xScale2(self.populationStatistic)).attr("x2", self.xScale2(self.populationStatistic)).attr("y1", self.windowHelper.section3.bottom + self.radius*8).attr("y2", self.windowHelper.section3.bottom + self.radius).style("stroke-width", 2).style("stroke", "blue");

				var visibleCircles = d3.selectAll(".notInCI").filter(function(){
					return this.attributes["fill-opacity"].value == "1";
				});
				visibleCircles.style("opacity",0.2).transition().duration(500).each("end",function(d,i){
					if(i==0){
					drawArrowDown(self.windowHelper.section3.bottom + self.windowHelper.section3.height/10, self.windowHelper.section3.bottom - self.windowHelper.section3.height/4, self.xScale2(self.populationStatistic-CIVar), d3.select("#CISplit"), "ciDownArrow", 1, "red",0.75);
					drawArrowDown(self.windowHelper.section3.bottom + self.windowHelper.section3.height/10, self.windowHelper.section3.bottom - self.windowHelper.section3.height/4, self.xScale2(self.populationStatistic+CIVar), d3.select("#CISplit"), "ciDownArrow", 1, "red",0.75);
					//d3.select("#CISplit").append("line").attr("y1",self.windowHelper.section3.bottom - self.windowHelper.section3.height/4).attr("y2",self.windowHelper.section3.bottom + self.windowHelper.section3.height/10).attr("x1",self.xScale2(self.populationStatistic-self.CISplit)).attr("x2",self.xScale2(self.populationStatistic-self.CISplit)).style("stroke","red");
					//d3.select("#CISplit").append("line").attr("y1",self.windowHelper.section3.bottom - self.windowHelper.section3.height/4).attr("y2",self.windowHelper.section3.bottom + self.windowHelper.section3.height/10).attr("x1",self.xScale2(self.populationStatistic+self.CISplit)).attr("x2",self.xScale2(self.populationStatistic+self.CISplit)).style("stroke","red");
					d3.select("#CISplit").append("text").attr("y",self.windowHelper.section3.bottom + self.windowHelper.section3.height/10).attr("x",self.xScale2(self.populationStatistic+self.CISplit)).text(Math.round((self.populationStatistic+self.CISplit)*100)/100).style("stroke","red").style("font-size", 12);
					d3.select("#CISplit").append("text").attr("y",self.windowHelper.section3.bottom + self.windowHelper.section3.height/10).attr("x",self.xScale2(self.populationStatistic-self.CISplit)).text(Math.round((self.populationStatistic-self.CISplit)*100)/100).style("stroke","red").style("font-size", 12)
						.transition().duration(500).each("end",function(){
							d3.select(".svg").append("svg").attr("id","CISplit").append("line").attr("y1",self.windowHelper.section3.bottom - self.windowHelper.section3.height/4).attr("y2",self.windowHelper.section3.bottom - self.windowHelper.section3.height/4).attr("x1",self.xScale2(self.populationStatistic-self.CISplit)).attr("x2",self.xScale2(self.populationStatistic+self.CISplit)).style("stroke","red").style("stroke-width",5);

						});
					}
				});
			})




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
	d3.select("#sampText").selectAll("*").remove();
	d3.select("#redTContainer").selectAll("*").remove();
	
	d3.select("#meanBox").remove();
	d3.selectAll("#CISplit").remove();
									d3.selectAll(".CIButton").attr("disabled",true);
								d3.selectAll(".notInCI").style("opacity",1);
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
		if(this.waiting){
			this.pauseCalled = true;
			return;
		}
		this.pauseCalled = false;
		var rL = d3.select("#redLine");
		if(rL[0][0] != null) {this.settings.redLine = [rL.attr("y1"), rL.attr("y2"), rL.attr("x1")]; 
		//rL.remove();
	}
		d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		this.pauseState = this.animationState;
		this.animationState = 0;
		d3.selectAll(".goButton").attr("disabled",true);
		this.settings.restarting = false;
	}
	this.unPause = function(){
		if(this.pauseCalled){
			return;
		}
		//this.resetLines();
		//d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		//this.animationState = this.pauseState;
		this.settings.restarting = true;
				if(this.pauseState == 2){
			this.animationState = 1;
			this.fadeNumber(this);
		}
				if(this.pauseState == 3){
			this.animationState = 2;
			this.trackPoints(this);
		}
		if(this.pauseState == 4){
			this.animationState = 3;
			this.fadeIn(this.settings);
		}

		if(this.pauseState == 5){
			this.animationState = 4;
			this.distDrop(this.settings);
		}

				//this.animationState = 0;

	}
}