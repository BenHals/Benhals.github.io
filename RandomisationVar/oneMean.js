
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
			this.population[i].sampleG = [];
		}

		this.xScale = d3.scale.linear().range([this.windowHelper.sampleSection,this.windowHelper.innerWidth]);
		this.xScale.domain([min,max]);

		this.populationStatistic = 0;
		this.populationStatistic = getStatistic(this.statistic, this.population);
				makeBoxplot(this.radius,this.windowHelper.section1.twoThird + this.radius *2,this.windowHelper.innerWidth-this.radius,this.windowHelper.section1.bottom - this.windowHelper.section1.twoThird - this.radius*4,this.population,this.xScale);

		heapYValues3(this.population, this.xScale, this.radius, 0, this.windowHelper.section1.top, this.windowHelper.section1.twoThird);
		this.popSetup = true;
		this.sampleSize = this.population.length;
		this.xScale2 = d3.scale.linear().range([this.windowHelper.sampleSection,this.windowHelper.innerWidth]);
		this.xScale2.domain([-10,10]);
	}

	this.setUpSamples = function(sSize){
		this.sampleSize = sSize;
		var statList = [];
		var oldSampNum = this.numSamples;
		var twelfths = (this.windowHelper.section2.bottom - this.windowHelper.section2.top)/12;
		//this.numSamples = 10000;
		this.samples = this.makeSamples(this.population, this.numSamples, sSize);

		for(var k = 0; k < this.numSamples;k++){
			var g0 = this.population.filter(function(e){
				return e.sampleG[k]==0;
			});
			var g1 = this.population.filter(function(e){
				return e.sampleG[k]==1;
			});
			var stat0 = getStatistic(this.statistic, g0);
			var stat1 = getStatistic(this.statistic, g1);
			var diff = stat1 - stat0;
			statList.push([stat0,stat1,diff]);

			heapYValues3(g0, this.xScale,this.radius, k+1, this.windowHelper.section2.top, this.windowHelper.section2.bottom-(8*twelfths));
			heapYValues3(g1, this.xScale,this.radius, k+1, this.windowHelper.section2.top, this.windowHelper.section2.bottom-2*twelfths);
			this.preCalculatedTStat.push(new item(diff, k));
		}
		heapYValues3(this.preCalculatedTStat, this.xScale2, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom);
		this.statsDone = true;
		this.sampSetup = true;
				this.fontS = this.windowHelper.width * this.windowHelper.height / 50000;



				//this.numSamples = 1000;
	}

	this.makeSamples = function(population, numSamples, sampleSize){
	var samples = [];
	for(var i = 0; i<numSamples;i++){
		samples.push([[],[]]);
		for(var k = 0; k<sampleSize;k++){
			var popItem = this.population[k];
			var gRand = Math.round(Math.random());
			popItem.sampleG.push(gRand);
			samples[i][gRand].push(popItem.value);
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
		var xAxis2 = d3.svg.axis();

		xAxis.scale(this.xScale)
		xAxis2.scale(this.xScale2)
		//Create 3 Axis
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis2);
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

		//svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).style("stroke-width", 2).style("stroke", "black");
		//svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", 0).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.height).style("stroke-width", 0.5).style("stroke", "black").attr("stroke-dasharray","5,5");
		//svg.append("text").attr("x", this.xScale(this.populationStatistic)).attr("y",this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).text(Math.round((this.populationStatistic)*100)/100).style("stroke","blue").attr("font-size",this.fontS);
		var fS = getFontSize(this.windowHelper,this.population.length);
		var fontSize = fS[0];
		this.fontSize = fontSize;
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
		svg.append("svg").attr("id","circleOverlay");
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
		if(repititions >999) this.resetLines();
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
				this.dropDown(settings);

		} 
	}
	this.dropDown = function(settings){
		var self = this;
		this.animationState = 1;
		settings.sample = this.samples[settings.indexUpTo];
		settings.svg = d3.select(".svg");
		this.settings = settings;
		var svg = d3.select(".svg");
		var popText = d3.select("#sampText");
		popText = popText.selectAll("text").data([]);
		popText.exit().remove();
		var reoveCirl = svg.select("#circleOverlay").selectAll("circle");
		reoveCirl.remove();
		var dropCircle = svg.select("#circleOverlay").selectAll("circle").data(this.population);
		   dropCircle.enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0];
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 0)
		    .style("stroke","#556270")
		    .attr("stroke-opacity",1).attr("class",function(d){return "g"+d.sampleG[settings.indexUpTo]});

		if(settings.goSlow){
			dropCircle.transition().duration(this.transitionSpeed).attr("cy", function(d){return d.yPerSample[0] + self.windowHelper.section2.top}).transition().duration(this.transitionSpeed).each('end',function(d,i){
				if(d==self.population[0]){
						self.splitUp(settings);
					
				}
			});
		}else{
			dropCircle.attr("cy", function(d){return d.yPerSample[0] + self.windowHelper.section2.top});
						self.splitUp(settings);

		}

	}
	this.splitUp = function(settings){
		var self = this;
		var g0 = d3.selectAll(".g0");
		var g1 = d3.selectAll(".g1");
		settings.colorIndex = colorByIndex;

		//g0.attr("stroke", colorByIndex[0]).style("stroke", colorByIndex[0]);
		//g1.attr("stroke", colorByIndex[1]).style("stroke", colorByIndex[1]);
		var popText = d3.select("#sampText").selectAll("text").data(self.population);
		popText.style("fill","black");
		var newText = popText.enter().append("text").text(function(d){
			if(d.sampleG[settings.indexUpTo-1] == 0){
				return "A";
			}else{
				return "B";
			}
		}).attr("x",self.windowHelper.sampleSectionDiv*4).attr("y",function(d,i){return (self.fontSize*(i+3)+self.windowHelper.marginSample*(i+2))}).style("font-size",self.fontSize).style("margin",self.windowHelper.marginSample+"px").style("display","inline-block").style("fill",function(d) {return settings.colorIndex[d.sampleG[settings.indexUpTo-1]]}).style("opacity",1);

		var dropCircle = d3.selectAll(".g0,.g1");
		dropCircle.style("stroke", function(d){
			var test = settings.colorIndex[d.sampleG[settings.indexUpTo-1]];
			return test}).transition().duration(this.transitionSpeed).attr("cy",function(d,i){return d.yPerSample[settings.indexUpTo]}).each("end", function(d){
				if(d==self.population[0]){
					if(!settings.incDist){
						self.animStepper(settings);
					}else{
						self.distDrop(settings);
					}
					
				}
		});



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
		this.dropDown(settings);

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