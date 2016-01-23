
function oneMean(inputData, heading, statistic){
	this.radius = 5;
	this.population = [];
	this.populationStatistic = null;
	this.numSamples = 1000;
	this.xScale = null;
	this.samples = null;
	this.preCalculatedTStat = [];
	this.transitionSpeed = 1000;
	this.index = 0;
	this.statsDone = false;
	this.animationState = 0;
	this.baseTransitionSpeed = 1000;
	this.windowHelper = setUpWindow(this.radius);
	this.statistic = statistic;
		this.popSetup = false;
	this.sampSetup = false;
	this.drawnMeans = [];
	this.sampleSize = 20;
	this.pauseState = 0;
			this.implemented = true;


	this.changeStat = function(newStatistic){
		this.statistic = newStatistic;
		this.destroy();
	}
	this.setUpPopulation = function(){
		this.sampleSize = 20;
		var max = null;
		var min = null;
		for(var i = 0; i<inputData.length;i++){
			var value = +inputData[i][heading];
			if(isNaN(value)) continue;
			if(max == null | value > max) max = value;
			if(min == null | value < min) min = value;
			this.population.push(new item(value, i));
		}

		this.xScale = d3.scale.linear().range([this.windowHelper.sampleSection,this.windowHelper.innerWidth]);
		this.xScale.domain([min,max]);

		this.populationStatistic = 0;
		this.populationStatistic = getStatistic(this.statistic, this.population);
		heapYValues3(this.population, this.xScale, this.radius, 0, this.windowHelper.section1.top, this.windowHelper.section1.twoThird);
		this.popSetup = true;
		this.sampleSize = this.population.length;
	}

	this.setUpSamples = function(sSize){
		this.sampleSize = sSize;
		if(sSize > this.population.length){
			alert("Sample size is too large for the poplation");
			return;
		}
		this.samples = this.makeSamples(this.population, this.numSamples, sSize);
		for(var k = 0; k < this.numSamples;k++){
			var stat = getStatistic(this.statistic, this.samples[k])
			heapYValues3(this.samples[k], this.xScale,this.radius, k+1, this.windowHelper.section2.top, this.windowHelper.section2.twoThird);
			this.preCalculatedTStat.push(new item(stat, k));
		}
		heapYValues3(this.preCalculatedTStat, this.xScale, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom);

		this.statsDone = true;
		this.sampSetup = true;
	}




	this.makeSamples = function(population, numSamples, sampleSize){
	var samples = [];
	for(var i = 0; i<numSamples;i++){
		samples.push([]);
		//var indexs = pickRand(sampleSize, population.length);
		for(var k = 0; k<sampleSize;k++){
			var index =	Math.ceil(Math.random()*sampleSize) - 1;
			var itemSelected = population[index];
			var nItem = new item(itemSelected.value, itemSelected.id);
			nItem.sampId = k;
			samples[i].push(nItem);
		}
	}
	return samples;
	}
	this.draw = function(){
		this.drawPop();
		this.drawSamples();
	}
	this.drawPop = function(){
		this.resetLines();
		if(!this.popSetup) return;
		var self = this;
		//if(!this.statsDone) return;
		var TRANSITIONSPEED = this.transitionSpeed;
		var sampleMeans = [];
		var svg = d3.select(".svg");
		var xAxis = d3.svg.axis();

		xAxis.scale(this.xScale)
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis);
		svg.append("svg").attr("class","pop");
		var circle = svg.select(".pop").selectAll("circle").data(this.population);
		   circle.enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0.5)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",1);

		svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).style("stroke-width", 2).style("stroke", "black");
		svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", 0).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.height).style("stroke-width", 0.5).style("stroke", "black").attr("stroke-dasharray","5,5");
		var fontSize = (this.windowHelper.height - (this.population.length+2)*this.windowHelper.marginSample) / (this.population.length+2);
		var popText = svg.append("svg").attr("id","popText");
		svg.append("svg").attr("id","sampText");
		popText.append("rect").attr("width",self.windowHelper.sampleSectionDiv*3).attr("x", self.windowHelper.marginSample).attr("height",self.windowHelper.height - self.windowHelper.marginSample).attr("y", self.windowHelper.marginSample).attr("rx", "20").attr("ry","20").style("fill","#D0D0D0").style("stroke","black");
		popText.append("rect").attr("width",self.windowHelper.sampleSectionDiv*3).attr("x", self.windowHelper.marginSample*2 + self.windowHelper.sampleSectionDiv*3).attr("height",self.windowHelper.height - self.windowHelper.marginSample).attr("y", self.windowHelper.marginSample).attr("rx", "20").attr("ry","20").style("fill","#D0D0D0").style("stroke","black");
		svg.append("text").text(heading).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",fontSize*1.5).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		popText.selectAll("text").data(this.population).enter().append("text").text(function(d){return d.value}).attr("x",self.windowHelper.sampleSectionDiv).attr("y",function(d,i){return (fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		svg.append("svg").attr("id","redTContainer");
	}
	this.drawSamples = function(){
		if(!this.sampSetup) return;
		var self = this;
		if(!this.statsDone) return;
		var TRANSITIONSPEED = this.transitionSpeed;
		var sampleMeans = [];
		var svg = d3.select(".svg");
		//var meanLines = svg.select(".sampleLines").selectAll("line").data(this.preCalculatedTStat)
		//	.enter().append("line").attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);
		svg.append("svg").attr("id","circleOverlay")
		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(this.preCalculatedTStat)
			.enter().append("circle")
			    .attr("cx", function(d, i) { 
			    	return d.xPerSample[0]; })
			    .attr("cy", function(d) {
			    	return d.yPerSample[0];
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 0)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",0); 
	}
	this.startAnim = function(repititions, goSlow, incDist){
		//this.fadeIn(goSlow, this.index);
		if(repititions >999) this.resetLines();
		if(this.animationState == 0){
			if(repititions == 1) this.transitionSpeed = 1000;
			if(repititions == 5) this.transitionSpeed = 500;
			if(repititions == 20) this.transitionSpeed = 100;
			if(repititions == 1000) this.transitionSpeed = 0;
			//this.animationState = 1;
			if(this.index >= this.numSamples-1){
				this.index = this.index % this.numSamples;
				this.resetLines();
			}
			var start = this.index;
			var end = start + repititions;
			if(repititions > 100) this.transitionSpeed = 0;
			var jumps = 1;
			if(repititions > 20) jumps = 1;
			//this.stepAnim(start, end, goSlow, jumps, incDist);


			//Check tick box TODO
			this.showSteps = true;
			var settings = new Object();
			settings.goSlow = goSlow;
			settings.indexUpTo = start;
			settings.incDist = incDist;
			settings.end = end;
			settings.jumps = jumps;
			settings.delay = 1000;
			settings.pauseDelay = 1000;
			settings.fadeIn = 200;
			settings.repititions = repititions;
				this.buildList(settings);

		} 
	}
	this.fadeNumber = function(t){
		var self = t;
		var i = self.settings.sample[self.upTo].id;
		var speedTest = self.goTo - self.upTo;
		var speed = 250;
		if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist) {
			speed = 1000;
		}
		//if(t %1000 == 0){
			d3.select("#pointerArrow").remove();
			d3.selectAll("#redText").remove();
			//d3.selectAll(".stepCircle").remove();
			drawArrow(self.windowHelper.sampleSectionDiv, 0, self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2,d3.select("#sampText"), "pointerArrow", 1, "red" );
			d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
			if(self.upTo <= 5){
				var rT2 = d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
				rT2.transition().duration(speed*0.75).attr("y",self.fontSize*(self.upTo+3)+self.windowHelper.marginSample*(self.upTo+2)).attr("x",self.windowHelper.sampleSectionDiv*4);
			}
			if(self.showSteps){
				var meanCircles = d3.select(".pop").selectAll("circle").filter(function(d){
					return d.id == i;
				});
				var posData = meanCircles.data()[0];
				d3.select("#sampText").append("circle").classed("stepCircle",true)
			    .attr("cx", posData.xPerSample[0])
			    .attr("cy", posData.yPerSample[0])
			    .attr("r", self.radius)
			    .attr("fill-opacity", 1)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",1)
			    .style("fill","black").transition().duration(speed).attr("cy",self.samples[self.settings.indexUpTo][self.upTo].yPerSample[self.settings.indexUpTo+1]).transition().duration(0).attr("fill-opacity", 0);
			}
			self.drawnResamps.push(self.settings.sample[self.upTo]);

			var popText = d3.select("#sampText").selectAll("text").data(self.drawnResamps);
			popText.style("fill","black");
			popText.enter().append("text").text(function(d){
				return d.value;
			}).attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("fill","red");
		//}
		self.upTo += 1;
		if(self.upTo == self.goTo){
			this.fadeIn(self.settings);
			d3.select("#pointerArrow").remove();
			d3.selectAll("#redText").remove();
			d3.selectAll(".stepCircle").remove();
						popText.style("fill","black");
			return true;
		}else{
			setTimeout(function(){
				self.fadeNumber(self)
			}, speed);
		}
	}
	this.buildList = function(settings){
		var self = this;
		settings.sample = this.samples[settings.indexUpTo];
		settings.svg = d3.select(".svg");
		this.settings = settings;
		settings.svg.select("#circleOverlay").selectAll("circle").data([]).exit().remove();
		var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
		var opacity = 1;
		if(settings.repititions == 1000) opacity = 0.2;
		mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
		var fontSize = (this.windowHelper.height - (this.population.length+2)*this.windowHelper.marginSample) / (this.population.length+2);
		this.fontSize = fontSize;
		var popText = d3.select("#sampText");
		popText = popText.selectAll("text").data([]);
		popText.exit().remove();
		var i = this.upTo;
		settings.svg.append("text").text("ReSample").attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",fontSize*1.1).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
			
		if(settings.repititions == 1){
			this.drawnResamps = [];
			this.upTo = 0;
			this.goTo = settings.sample.length ;

			this.fadeNumber(this);
		}else{
			popText = d3.select("#sampText").selectAll("text").data(settings.sample);

			popText.enter().append("text").text(function(d){
				return d.value;
			}).attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",function(d,i){return (fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
			this.fadeIn(settings);
		}

	}
	this.fadeIn = function(settings){
		if(this.animationState == -1) return;
		if(this.animationState == 1) return;
		this.animationState = 1;
		this.settings = settings;
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;
			settings.sample = this.samples[settings.indexUpTo];
			settings.svg = d3.select(".svg");
			this.settings = settings;
			//var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			//mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			//var opacity = 1;
			//if(settings.repititions == 1000) opacity = 0.2;

			var circle = settings.svg.select(".pop").selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.2);
			//settings.svg.select(".sampleLines").selectAll("line").style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			var powScale = d3.scale.pow();
			powScale.exponent(4);
			powScale.domain([0,settings.delay*2]);
			//settings.svg.select("#circleOverlay").selectAll("circle").data([]).exit().remove();
			var circleOverlay = settings.svg.select("#circleOverlay").selectAll("circle").data(settings.sample);
				circleOverlay.attr("fill-opacity",1);
				circleOverlay.exit().remove();
				circleOverlay.enter().append("circle")
			    .attr("cx", function(d, i) { 
			    	return d.xPerSample[settings.indexUpTo+1]; })
			    .attr("cy", function(d) {
			    	return d.yPerSample[settings.indexUpTo+1];
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 1)
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

					var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
			if(sampMean.length > 1){
				this.drawnMeans = this.drawnMeans.concat(sampMean.slice(0,-1));
				var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
				mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);
				
				//mLines.style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
				this.drawnMeans.push(sampMean[sampMean.length-1]);
			}else{
				this.drawnMeans = this.drawnMeans.concat(sampMean);
			}
			var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			var opacity = 1;
			if(settings.repititions == 1000) opacity = 0.2;
			mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			var meanLines = mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);


		if(settings.goSlow){
			circleOverlay = circleOverlay.transition().delay(function(d,i){
					//return delay*2/sample.length * sample.indexOf(d)
					//var test1 =settings.sample.indexOf(d);
					//var test = (powScale.invert(test1 +2 )- powScale.invert(1 )) * fillInTime;
					//return test;
					return 1;
				}).duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1).each('end', function(d, i){
				//.transition().duration(function(d,i){return settings.delay*2/settings.sample.length * (settings.sample.length - settings.sample.indexOf(d))})
						if(d == settings.sample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								self.animStepper(settings);
							}
							sentFinish = true;
						}
				});
		}else{
			circleOverlay = circleOverlay.style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(1).each('end', function(d, i){
						if(d == settings.sample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								self.animStepper(settings);
							}
							sentFinish = true;
						}
				});
		}
	}

	this.dropDown = function(settings){
		if(this.animationState == -1 || this.animationState == 0) return;
					if(this.animationState == 2) return;
			this.animationState = 2;
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;

			var circle = settings.svg.select(".pop").selectAll("circle");
			circle = circle.filter(function(d,i){return settings.sample.indexOf(d) >= 0;});

			var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
			if(sampMean.length > 1){
				this.drawnMeans = this.drawnMeans.concat(sampMean.slice(0,-1));
				mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
				mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);
				
				//mLines.style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
				this.drawnMeans.push(sampMean[sampMean.length-1]);
			}else{
				this.drawnMeans = this.drawnMeans.concat(sampMean);
			}
			var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			var opacity = 1;
			if(settings.repititions == 1000) opacity = 0.2;
			mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			var meanLines = mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

			this.settings.circle = circle;
			this.settings.sampMean = sampMean;
			this.settings.mLines = mLines;
			this.settings.meanLines = meanLines;

		}else{
			var self = this;
			var circle = this.settings.circle;
			var sampMean = this.settings.sampMean;
			var mLines = this.settings.mLines;
			var meanLines = this.settings.meanLines;
					    this.settings.restarting = false;
		}

		
		if(settings.goSlow){
				circle = circle.transition().duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1)
					.transition().duration(settings.pauseDelay)
					.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[settings.indexUpTo+1]})
					.transition().duration(settings.pauseDelay * 2)
					.each('end', function(d, i){
						if(d == settings.sample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								self.animStepper(settings);
							}
							sentFinish = true;
						}
					});

				meanLines = meanLines.transition().duration(settings.fadeIn)
					.transition().duration(settings.pauseDelay * 2)
					.transition().duration(this.transitionSpeed).style("opacity",1).attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight)


		}else{
							meanLines = meanLines.attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).style("stroke", "green").style("opacity",1);
				circle = circle.attr("cy", function(d, i){return d.yPerSample[settings.indexUpTo+1]}).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(1)
				.each('end', function(d, i){
						if(d == settings.sample[0]){
							if(settings.incDist){
								self.distDrop(settings);
							}else{
								self.animStepper(settings);
							}
							sentFinish = true;
						}
					});

		}

	}

	this.distDrop = function(settings){
		if(this.animationState == -1 || this.animationState == 0) return;
					if(this.animationState == 3) return;
			this.animationState = 3;
		if(!this.settings.restarting){
			var sentFinish = false;
			var self = this;

			var sampMean = this.preCalculatedTStat.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
			if(this.transitionSpeed > 200){
				var downTo = this.preCalculatedTStat[settings.indexUpTo].yPerSample[0];
				var redLine = settings.svg.select(".meanOfSamples").append("line").attr("id","redLine").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).attr("x1",this.xScale(sampMean[0].value)).attr("x2",this.xScale(sampMean[0].value)).style("stroke-width", 2).style("stroke", "red").style("opacity", 0);

			}
			var meanCircles = settings.svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
				return (i>=settings.indexUpTo) && (i <settings.indexUpTo+settings.jumps);
			});

			this.settings.sampMean = sampMean;
			this.settings.meanCircles = meanCircles;
		}else{
			var downTo = this.preCalculatedTStat[settings.indexUpTo].yPerSample[0];
			var rL = this.settings.redLine;
			d3.select("#redLine").remove();
			if(rL) var redLine =  settings.svg.select(".meanOfSamples").append("line").attr("id","redLine").attr("y1", rL[0]).attr("y2", rL[1]).attr("x1",rL[2]).attr("x2",rL[2]).style("stroke-width", 2).style("stroke", "red").style("opacity", 0);
			var self = this;
			var sampMean = this.settings.sampMean;
			var meanCircles = this.settings.meanCircles;

			this.settings.restarting = false;
		}
		//if(this.transitionSpeed <= 100){
		//	meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5");
		//}else{
			if(this.transitionSpeed > 200){
				redLine.style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", downTo).each("end",function(){d3.select(this).remove()});
			}
			if(settings.goSlow){
				meanCircles = meanCircles.transition().delay(this.transitionSpeed*2).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]}).each('end', function(d, i){
					if(!sentFinish){
						self.animStepper(settings);
						sentFinsih = true;
					}
				});
			}else{
				meanCircles = meanCircles.attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]})
					.transition().duration(this.transitionSpeed*2).each('end', function(d, i){
					if(d == self.preCalculatedTStat[settings.indexUpTo]){
						self.animStepper(settings);
						sentFinsih = true;
					}
				});
			}
		//}
	}
	this.animStepper = function(settings){
		if(this.animationState == -1 || this.animationState == 0) return;
		if(this.animationState == 4) return;
		this.animationState = 4;
		settings.indexUpTo += settings.jumps;
		this.index += settings.jumps;
		if(settings.indexUpTo >= settings.end  || settings.indexUpTo>= this.numSamples){
			this.animationState = 0;
			mainControl.doneVis();
			return;
		}
		this.buildList(settings);

	}


	this.resetLines =function(){
		this.drawnMeans = [];
						d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		this.index = 1;
		var self = this;
		var svg = d3.select(".svg");
		//var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);
		svg.select(".sampleLines").selectAll("line").remove();
		this.drawnMeans = [];
		var meanCircles = svg.select(".meanOfSamples").selectAll("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("fill-opacity", 0)
		    .attr("stroke-opacity",0); 
		d3.select("#circleOverlay").selectAll("*").remove();
		d3.select(".pop").selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.2);
		svg.select(".meanOfSamples").selectAll("line").remove();


	}




	this.stop = function(){
	this.animationState = -1;
	this.resetLines();
	this.animationState = 0;
	}

	this.destroy = function(){
		d3.select(".svg").selectAll("*").remove();
		d3.select(".svg").append("svg").attr("class","sampleLines");
		d3.select(".svg").append("svg").attr("class","meanOfSamples");
		this.resetData();
		//loadMain();
	}

	this.resetData = function(){
		this.animationState = 0;
		windowHelpers = null;
		this.radius = 5;
		this.population = [];
		this.populationStatistic = null;
		this.samples = null;
		this.preCalculatedTStat = [];		
		this.transitionSpeed = 1000;
		this.index = 0;
		this.statsDone = false;

		this.baseTransitionSpeed = 1000;
	}

	this.pause = function(){

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