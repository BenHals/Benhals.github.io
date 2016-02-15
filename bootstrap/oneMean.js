
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
				makeBoxplot(this.radius,this.windowHelper.section1.twoThird + this.radius *2,this.windowHelper.innerWidth-this.radius,this.windowHelper.section1.bottom - this.windowHelper.section1.twoThird - this.radius*4,this.population,this.xScale);

		heapYValues3(this.population, this.xScale, this.radius, 0, this.windowHelper.section1.top, this.windowHelper.section1.twoThird);
		this.popSetup = true;
		this.sampleSize = this.population.length;
	}

	this.setUpSamples = function(sSize){
		this.sampleSize = sSize;
		var statList = [];
		var oldSampNum = this.numSamples;
		//this.numSamples = 10000;
		this.samples = this.makeSamples(this.population, this.numSamples, sSize);
		this.tenKSamples = this.makeSamples(this.population, 10000, sSize);
		for(var k = 0; k < this.numSamples;k++){
			var stat = getStatistic(this.statistic, this.samples[k])
			statList.push(stat);
			heapYValues3(this.samples[k], this.xScale,this.radius, k+1, this.windowHelper.section2.top, this.windowHelper.section2.twoThird);
			this.preCalculatedTStat.push(new item(stat, k));
		}
		var self = this;
		statList.sort(function(a,b){
			if(Math.abs(self.populationStatistic - a ) < Math.abs(self.populationStatistic - b)) return -1;
			if(Math.abs(self.populationStatistic - a ) > Math.abs(self.populationStatistic - b)) return 1;
			return 0;
		})
		var CISplit = Math.abs(this.populationStatistic - statList[this.numSamples*0.95]);
		for(var k = 0; k < this.numSamples;k++){
			if(Math.abs(this.populationStatistic - this.preCalculatedTStat[k].value) >= CISplit){
				this.preCalculatedTStat[k].inCI = false;
			}else{
				this.preCalculatedTStat[k].inCI = true;
			}
		}
		this.CISplit = CISplit;
		heapYValues3(this.preCalculatedTStat, this.xScale, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom);

		statList = [];
		var higherNum = 100000;
		this.tenKSamples = this.makeSamples(this.population, higherNum, sSize);

		for(var k = 0; k < higherNum;k++){
			var stat = getStatistic(this.statistic, this.tenKSamples[k])
			statList.push(stat);
		}
		statList.sort(function(a,b){
			if(Math.abs(self.populationStatistic - a ) < Math.abs(self.populationStatistic - b)) return -1;
			if(Math.abs(self.populationStatistic - a ) > Math.abs(self.populationStatistic - b)) return 1;
			return 0;
		})
		CISplit = Math.abs(this.populationStatistic - statList[higherNum*0.95]);
		this.CISplitTenK = CISplit;

		this.statsDone = true;
		this.sampSetup = true;
				this.fontS = this.windowHelper.width * this.windowHelper.height / 50000;
				//this.numSamples = 1000;
	}

	this.makeSamples = function(population, numSamples, sampleSize){
	var samples = [];
	for(var i = 0; i<numSamples;i++){
		samples.push([]);
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
		var sampleMeans = [];
		var svg = d3.select(".svg");
		var xAxis = d3.svg.axis();

		xAxis.scale(this.xScale)
		//Create 3 Axis
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis);
		svg.append("svg").attr("class","pop");

		//Create population circles
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
		    .attr("stroke-opacity",1).attr("class",function(d){return "c"+d.id});

		svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).style("stroke-width", 2).style("stroke", "black");
		svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", 0).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.height).style("stroke-width", 0.5).style("stroke", "black").attr("stroke-dasharray","5,5");
		svg.append("text").attr("x", this.xScale(this.populationStatistic)).attr("y",this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).text(Math.round((this.populationStatistic)*100)/100).style("stroke","blue").attr("font-size",this.fontS);
		var fS = getFontSize(this.windowHelper,this.population.length);
		var fontSize = fS[0];
		self.fontSize = fontSize;
		var titleFS = fS[1];
		var popText = svg.append("svg").attr("id","popText");
		svg.append("svg").attr("id","sampText");
		popText.append("rect").attr("width",self.windowHelper.sampleSectionDiv*3).attr("x", self.windowHelper.marginSample).attr("height",self.windowHelper.height - self.windowHelper.marginSample).attr("y", self.windowHelper.marginSample).attr("rx", "20").attr("ry","20").style("fill","#D0D0D0").style("stroke","black");
		popText.append("rect").attr("width",self.windowHelper.sampleSectionDiv*3).attr("x", self.windowHelper.marginSample*2 + self.windowHelper.sampleSectionDiv*3).attr("height",self.windowHelper.height - self.windowHelper.marginSample).attr("y", self.windowHelper.marginSample).attr("rx", "20").attr("ry","20").style("fill","#D0D0D0").style("stroke","black");
		svg.append("text").text(heading).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",titleFS).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		popText.selectAll("text").data(this.population).enter().append("text").text(function(d){return d.value}).attr("x",self.windowHelper.sampleSectionDiv).attr("y",function(d,i){return (fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");
		svg.append("svg").attr("id","redTContainer");
		svg.append("text").text("ReSample").attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",self.windowHelper.marginSample*2 + fontSize*2).style("font-size",titleFS).style("font-weight", 700).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block");

	}
	this.drawSamples = function(){
		if(!this.sampSetup) return;
		var self = this;
		if(!this.statsDone) return;
		var TRANSITIONSPEED = this.transitionSpeed;
		var sampleMeans = [];
		var svg = d3.select(".svg");
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
			    .attr("stroke-opacity",0)
			    .attr("class",function(d){
			    	if(d.inCI){
			    		return "inCI";
			    	}else{
			    		return "notInCI";
			    	}
			    }); 
	}
	this.startAnim = function(repititions, goSlow, incDist){
		this.incDist = incDist;
		if(repititions >999 || repititions == 1) this.resetLines();
		if(this.animationState == 0){
			if(repititions == 1) this.transitionSpeed = 1000;
			if(repititions == 5) this.transitionSpeed = 500;
			if(repititions == 20) this.transitionSpeed = 100;
			if(repititions == 1000) this.transitionSpeed = 0;
			if(this.index >= this.numSamples-1){
				this.index = this.index % this.numSamples;
				this.resetLines();
			}
			var start = this.index;
			var end = start + repititions;
			if(repititions > 100) this.transitionSpeed = 0;
			var jumps = 1;
			if(repititions > 20) jumps = 5;

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
			settings.pauseDelay = 1000;
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
		var i = self.settings.sample[self.upTo].id;
		var speedTest = self.goTo - self.upTo;
		var speed = 250;
		if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist) {
			speed = 1000;
		}
		d3.select("#pointerArrow").remove();
		d3.selectAll("#redText").remove();
		d3.selectAll(".sCRemove").remove();
		d3.selectAll(".stepCircle").attr("fill-opacity", 0);
		drawArrow(self.windowHelper.sampleSectionDiv, 0, self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2,d3.select("#sampText"), "pointerArrow", 1, "red" );
		var rsText = d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("fill","red").style("opacity",1);
		if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist){
			var rT2 = d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
			rT2.transition().duration(speed*0.75).attr("y",self.fontSize*(self.upTo+3)+self.windowHelper.marginSample*(self.upTo+2)).attr("x",self.windowHelper.sampleSectionDiv*4);
			//rsText.transition().delay(speed*0.75).duration(100).style("opacity",1);
		}
		if(self.showSteps){
			var meanCircles = d3.select(".pop").selectAll("circle").filter(function(d){
				return d.id == i;
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
		   	 	moveingCircle.transition().duration(speed).attr("cy",self.samples[self.settings.indexUpTo][self.upTo].yPerSample[self.settings.indexUpTo+1]).transition().duration(0).attr("fill-opacity", 0);
			}else{
		   	 	moveingCircle.attr("cy",self.samples[self.settings.indexUpTo][self.upTo].yPerSample[self.settings.indexUpTo+1]).transition().duration(0);

			}
		}
		self.drawnResamps.push(self.settings.sample[self.upTo]);

		var popText = d3.select("#sampText").selectAll("text").data(self.drawnResamps);
		popText.style("fill","black");
		var newText = popText.enter().append("text").text(function(d){
			return d.value;
		}).attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("fill","red").style("opacity",function(){if(self.upTo <= 5 && self.settings.repititions == 1 && !self.settings.incDist){return 0}else{return 1}});
					newText.transition().delay(speed*0.75).duration(100).style("opacity",1);
		self.upTo += 1;
		if(self.upTo == self.goTo){
			this.fadeIn(self.settings);
			d3.select("#pointerArrow").remove();
			d3.selectAll("#redText").remove();
			d3.selectAll(".stepCircle").remove();
						popText.style("fill","rgb(255, 113, 72)");
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
		var i = self.upTo;
		d3.select("#circleOverlay").selectAll(".c"+(i-1)).style("fill","#FF7148");
		d3.select(".pop").selectAll(".c"+(i-1)).style("fill","#C7D0D5").attr("fill-opacity",0.5);
		if(self.animationState == 0) return;
				this.animationState = 3;
						    this.settings.restarting = false;
		if(self.upTo == self.goTo){
			if(self.settings.incDist){
				self.distDrop(self.settings);
			}else{
				self.animStepper(self.settings);
			}
			d3.select("#pointerArrow").remove();
			d3.selectAll("#redText").remove();
			d3.selectAll(".stepCircle").remove();
			return true;
		}

		var selected = self.population[i];
		var speed = 1000;
		d3.select("#pointerArrow").remove();
		d3.selectAll("#redText").remove();
		d3.selectAll(".stepCircle").remove();


		drawArrow(self.windowHelper.sampleSectionDiv, 0, self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2,d3.select("#sampText"), "pointerArrow", 1, "red" );
		d3.select("#redTContainer").append("text").attr("id","redText").text(self.population[self.upTo].value).attr("x",self.windowHelper.sampleSectionDiv).attr("y",self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
		d3.selectAll(".c"+i).style("fill","black").attr("fill-opacity",1);
		var inSample = d3.select("#circleOverlay").selectAll(".c"+(i)).data();
		for(var inS = 0; inS < inSample.length; inS++){
			var k = inSample[inS].sampId;
			d3.select("#redTContainer").append("line").attr("id","redText").attr("x1", self.windowHelper.sampleSectionDiv*2 ).attr("x2",self.windowHelper.sampleSectionDiv*4).attr("y1", self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2) - self.fontSize/2).attr("y2", self.fontSize*(k+3)+self.windowHelper.marginSample*(k+2) - self.fontSize/2).style("stroke","red");
			d3.select("#redTContainer").append("text").attr("id","redText").text(self.settings.sample[k].value).attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",self.fontSize*(k+3)+self.windowHelper.marginSample*(k+2)).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("opacity",1).style("fill","red");
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
		settings.sample = this.samples[settings.indexUpTo];
		settings.svg = d3.select(".svg");
		this.settings = settings;
		settings.svg.select("#circleOverlay").selectAll("circle").data([]).exit().remove();
		var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
		var opacity = 1;
		if(settings.repititions == 1000) opacity = 0.2;
		mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
		//var fontSize = (this.windowHelper.height - (this.population.length+2)*this.windowHelper.marginSample) / (this.population.length+2);
		//if(fontSize>this.windowHelper.sampleSection*0.1)fontSize=this.windowHelper.sampleSection*0.1;
		var fontSize = this.fontSize;
		var popText = d3.select("#sampText");
		popText = popText.selectAll("text").data([]);
		popText.exit().remove();
		var i = this.upTo;
			
		if(settings.repititions == 1 || (settings.repititions == 5 && !settings.incDist)){
			this.drawnResamps = [];
			this.upTo = 0;
			this.goTo = settings.sample.length ;

			this.fadeNumber(this);
		}else{
			popText = d3.select("#sampText").selectAll("text").data(settings.sample);

			popText.enter().append("text").text(function(d){
				return d.value;
			}).attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",function(d,i){return (fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("fill","rgb(255, 113, 72)");
			this.fadeIn(settings);
		}

	}
	this.fadeIn = function(settings){
		if(this.animationState == -1) return;
		if(this.animationState == 4) return;
		this.animationState = 4;
		this.settings = settings;
		if(!this.settings.restarting){
			var sentFinish = false;

			var self = this;
			settings.sample = this.samples[settings.indexUpTo];
			settings.svg = d3.select(".svg");
			this.settings = settings;
			var circle = settings.svg.select(".pop").selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.2);

			var powScale = d3.scale.pow();
			powScale.exponent(4);
			powScale.domain([0,settings.delay*2]);

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
			    .style("fill","#FF7148").attr("class",function(d){return "c"+d.id});
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
				
				this.drawnMeans.push(sampMean[sampMean.length-1]);
			}else{
				this.drawnMeans = this.drawnMeans.concat(sampMean);
			}
			var mLines = settings.svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			var opacity = 1;
			if(settings.repititions == 1000) opacity = 0.2;
			mLines.style("opacity",opacity).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			var meanLines = mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);

		if(self.showSteps){
			this.upTo = 0;
			this.goTo = settings.sample.length ;
			setTimeout(function(){
			self.trackPoints(self)
			}, this.transitionSpeed);
			return;
		}
		if(settings.goSlow){
			circleOverlay = circleOverlay.transition().delay(function(d,i){

					return 1;
				}).duration(settings.fadeIn).style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(this.transitionSpeed*2).each('end', function(d, i){
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
			circleOverlay = circleOverlay.style("fill", "#FF7148").attr("fill-opacity", 1).transition().duration(this.transitionSpeed*2).each('end', function(d, i){
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
					if(this.animationState == 5) return;
			this.animationState = 5;
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

		if(this.transitionSpeed > 200){
			//redLine.style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", downTo).each("end",function(){d3.select(this).remove()});
			redLine.style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo+this.radius/2).attr("y2", downTo-this.radius/2).each("end",function(){d3.select(this).remove()});
		}
		if(settings.goSlow || settings.repititions == 5){
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

	}
	this.animStepper = function(settings){
		if(this.animationState == -1 || this.animationState == 0) return;
		if(this.animationState == 6) return;
		this.animationState = 6;
		settings.indexUpTo += settings.jumps;
		this.index += settings.jumps;
		if(settings.indexUpTo >= settings.end  || settings.indexUpTo>= this.numSamples){
			if(settings.repititions == 1000 && settings.incDist){
				d3.selectAll(".CIButton").attr("disabled",null);
			}
			this.animationState = 0;
			mainControl.doneVis();
			return;
		}
		this.buildList(settings);

	}
	this.showCI = function(variableName){
		var CIVar = this.CISplit;
		if(variableName=="10") CIVar= this.CISplitTenK;
		var self = this;
		var visibleCircles = d3.selectAll(".notInCI").filter(function(){
			return this.attributes["fill-opacity"].value == "1";
			});
		visibleCircles.style("opacity",0.2);

		d3.select(".svg").append("svg").attr("id","CISplit").append("line").attr("y1",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("y2",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("x1",this.xScale(this.populationStatistic-CIVar)).attr("x2",this.xScale(this.populationStatistic+CIVar)).style("stroke","red").style("stroke-width",5);
					drawArrowDown(this.windowHelper.section3.bottom + this.windowHelper.section3.height/10, this.windowHelper.section3.bottom - this.windowHelper.section3.height/4, this.xScale(this.populationStatistic-CIVar), d3.select("#CISplit"), "ciDownArrow", 1, "red",0.75);
					drawArrowDown(this.windowHelper.section3.bottom + this.windowHelper.section3.height/10, this.windowHelper.section3.bottom - this.windowHelper.section3.height/4, this.xScale(this.populationStatistic+CIVar), d3.select("#CISplit"), "ciDownArrow", 1, "red",0.75);

					//d3.select("#CISplit").append("line").attr("y1",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("y2",this.windowHelper.section3.bottom + this.windowHelper.section3.height/10).attr("x1",this.xScale(this.populationStatistic-this.CISplit)).attr("x2",this.xScale(this.populationStatistic-this.CISplit)).style("stroke","red");
					//d3.select("#CISplit").append("line").attr("y1",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("y2",this.windowHelper.section3.bottom + this.windowHelper.section3.height/10).attr("x1",this.xScale(this.populationStatistic+this.CISplit)).attr("x2",this.xScale(this.populationStatistic+this.CISplit)).style("stroke","red");
					d3.select("#CISplit").append("text").attr("y",this.windowHelper.section3.bottom + this.windowHelper.section3.height/10).attr("x",this.xScale(this.populationStatistic+CIVar)).text(Math.round((this.populationStatistic+CIVar)*100)/100).style("stroke","red").style("font-size", 12);
					d3.select("#CISplit").append("text").attr("y",this.windowHelper.section3.bottom + this.windowHelper.section3.height/10).attr("x",this.xScale(this.populationStatistic-CIVar)).text(Math.round((this.populationStatistic-CIVar)*100)/100).style("stroke","red").style("font-size", 12);
		var c2 = d3.select("#CISplit").append("line").attr("y1",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("y2",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("x1",this.xScale(this.populationStatistic-CIVar)).attr("x2",this.xScale(this.populationStatistic+CIVar)).style("stroke","red").style("stroke-width",5);
		var c3 = d3.select("#CISplit").append("line").attr("y1",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("y2",this.windowHelper.section3.bottom - this.windowHelper.section3.height/4).attr("x1",this.xScale(this.populationStatistic-CIVar)).attr("x2",this.xScale(this.populationStatistic+CIVar)).style("stroke","red").style("stroke-width",5);

		c2.transition().duration(1000).transition().duration(1000).attr("y1",this.windowHelper.section2.bottom - this.windowHelper.section2.height/4).attr("y2",this.windowHelper.section2.bottom - this.windowHelper.section2.height/4);
		c3.transition().duration(1000).transition().duration(1000).attr("y1",this.windowHelper.section2.bottom - this.windowHelper.section2.height/4).attr("y2",this.windowHelper.section2.bottom - this.windowHelper.section2.height/4).transition().duration(1000)
		.transition().duration(1000).attr("y1",this.windowHelper.section1.bottom - this.windowHelper.section1.height/4).attr("y2",this.windowHelper.section1.bottom - this.windowHelper.section1.height/4).each("end",function(){
					//d3.select("#CISplit").append("line").attr("y1",self.windowHelper.section1.bottom - self.windowHelper.section1.height/4).attr("y2",self.windowHelper.section1.bottom + self.windowHelper.section1.height/10).attr("x1",self.xScale(self.populationStatistic-self.CISplit)).attr("x2",self.xScale(self.populationStatistic-self.CISplit)).style("stroke","red");
					//d3.select("#CISplit").append("line").attr("y1",self.windowHelper.section1.bottom - self.windowHelper.section1.height/4).attr("y2",self.windowHelper.section1.bottom + self.windowHelper.section1.height/10).attr("x1",self.xScale(self.populationStatistic+self.CISplit)).attr("x2",self.xScale(self.populationStatistic+self.CISplit)).style("stroke","red");
					drawArrowDown(self.windowHelper.section1.bottom + self.windowHelper.section1.height/10, self.windowHelper.section1.bottom - self.windowHelper.section1.height/4, self.xScale(self.populationStatistic-CIVar), d3.select("#CISplit"), "ciDownArrow", 1, "red",0.75);
					drawArrowDown(self.windowHelper.section1.bottom + self.windowHelper.section1.height/10, self.windowHelper.section1.bottom - self.windowHelper.section1.height/4, self.xScale(self.populationStatistic+CIVar), d3.select("#CISplit"), "ciDownArrow", 1, "red",0.75);
					d3.select("#CISplit").append("text").attr("y",self.windowHelper.section1.bottom + self.windowHelper.section1.height/10).attr("x",self.xScale(self.populationStatistic+CIVar)).text(Math.round((self.populationStatistic+CIVar)*100)/100).style("stroke","red").style("font-size", 12);
					d3.select("#CISplit").append("text").attr("y",self.windowHelper.section1.bottom + self.windowHelper.section1.height/10).attr("x",self.xScale(self.populationStatistic-CIVar)).text(Math.round((self.populationStatistic-CIVar)*100)/100).style("stroke","red").style("font-size", 12);

		});

	}

	this.resetLines =function(){
								d3.selectAll(".CIButton").attr("disabled",true);
								d3.selectAll(".notInCI").style("opacity",1);
		this.drawnMeans = [];
		d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		this.index = 1;
		d3.selectAll("#CISplit").remove();
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
		d3.select("#pointerArrow").remove();
		d3.selectAll("#redText").remove();
		d3.selectAll(".sCRemove").remove();
		d3.selectAll(".stepCircle").remove();
		d3.selectAll("#sampText text").remove();


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