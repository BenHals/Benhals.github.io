
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


	this.changeStat = function(newStatistic){
		this.statistic = newStatistic;
		this.destroy();
	}
	this.setUpPopulation = function(){
		var max = null;
		var min = null;
		for(var i = 0; i<inputData.length;i++){
			var value = +inputData[i][heading];
			if(isNaN(value)) continue;
			if(max == null | value > max) max = value;
			if(min == null | value < min) min = value;
			this.population.push(new item(value, i));
		}

		this.xScale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
		this.xScale.domain([min,max]);

		this.populationStatistic = 0;
		this.populationStatistic = getStatistic(this.statistic, this.population);
		heapYValues3(this.population, this.xScale, this.radius, 0, this.windowHelper.section1.top, this.windowHelper.section1.twoThird);
		this.popSetup = true;
	}

	this.setUpSamples = function(sSize){
		this.sampleSize = sSize;
		if(sSize >= this.population.length){
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
		var indexs = pickRand(sampleSize, population.length);
		for(var k = 0; k<sampleSize;k++){
			samples[i].push(population[indexs[k]]);
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
		if(repititions >999) this.resetLines();
		if(this.animationState == 0){
			if(repititions == 1) this.transitionSpeed = 1000;
			if(repititions == 5) this.transitionSpeed = 500;
			if(repititions == 20) this.transitionSpeed = 100;
			if(repititions == 1000) this.transitionSpeed = 0;
			this.animationState = 1;
			if(this.index > this.numSamples){
				this.index = this.index % this.numSamples;
				this.resetLines();
			}
			var start = this.index;
			var end = start + repititions;
			if(repititions > 100) this.transitionSpeed = 0;
			var jumps = 1;
			if(repititions > 20) jumps = 10;
			this.stepAnim(start, end, goSlow, jumps, incDist);
		}
	}
	this.stepAnim = function(indexUpTo, goUpTo, goSlow, jumps, incDist){
		var svg = d3.select(".svg");
		var self = this;
		//svg.select(".sampleLines").selectAll("line").transition().duration(this.transitionSpeed).style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
		if(this.animationState != 1){
			return;
		}
		if(indexUpTo < goUpTo){
			if(indexUpTo >= this.numSamples){
				this.animationState = 0;
				return
			}

			var circle = svg.select(".pop").selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.2);
			var sample = this.samples[indexUpTo];
			var delay = 1;
			var circleOverlay = svg.select("#circleOverlay").selectAll("circle").data(sample, function(d){return d.id});
			circleOverlay.attr("fill-opacity",0);
			circleOverlay.exit().remove();
			circleOverlay.enter().append("circle")
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
			 delay = this.transitionSpeed;
			var powScale = d3.scale.pow();
			powScale.exponent(4);
			//powScale.range([0,this.sampleSize]);
			powScale.domain([0,delay*2]);
			//alert(powScale(3));
			//alert(powScale(500));
		    var pauseDelay = delay;
			if(goSlow){
				circleOverlay = circleOverlay.transition().delay(function(d,i){
					//return delay*2/sample.length * sample.indexOf(d)
					var test1 =sample.indexOf(d);
					var test = (powScale.invert(test1 +2 )- powScale.invert(1 )) * fillInTime;
					return test;
				}).duration(100).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(function(d,i){return delay*2/sample.length * (sample.length - sample.indexOf(d))});
			}else{
				circleOverlay = circleOverlay.style("fill", "#FF7148").attr("fill-opacity", 1);
			}



			circle = circle.filter(function(d,i){return sample.indexOf(d) >= 0;});
			//if(goSlow){
			//	circle = circle.transition().delay(delay*2).duration(delay).style("fill", "#FF7148").attr("fill-opacity", 1)
			//					.transition().duration(delay);
			//}else{

			//}
			if(!goSlow){
				circle = circle.attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]}).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(delay)
				//.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps, incDist)}});
			}else{
				circle = circle.transition().delay((powScale.invert(this.sampleSize)- powScale.invert(2)) *fillInTime).duration(50).style("fill", "#FF7148").attr("fill-opacity", 1)
				.transition().duration(delay + pauseDelay)
				.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
				.transition().duration(delay + pauseDelay * 2)
				//.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps, incDist)}});
			}

			var sampMean = this.preCalculatedTStat.slice(indexUpTo, indexUpTo+jumps);
			if(sampMean.length > 1){
				this.drawnMeans = this.drawnMeans.concat(sampMean.slice(0,-1));
				var mLines = svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
				mLines.enter().append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 1);
				this.drawnMeans.push(sampMean[sampMean.length-1]);
			}else{
				this.drawnMeans = this.drawnMeans.concat(sampMean);
			}
			var mLines = svg.select(".sampleLines").selectAll("line").data(this.drawnMeans);
			mLines.style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			var meanLines = mLines.enter().append("line").attr("y1", this.windowHelper.section1.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section1.twoThird-this.windowHelper.lineHeight).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);
			//var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
			//	return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
			//});
			if(goSlow){
				meanLines = meanLines.transition().delay((powScale.invert(this.sampleSize)- powScale.invert(2 )) * fillInTime).duration(delay).style("opacity",1)
				.transition().duration(pauseDelay)
				.transition().duration(this.transitionSpeed).attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight)
				.transition().duration(delay);
				//.transition().duration(this.transitionSpeed).style("opacity",0.2).style("stroke", "steelblue").attr("y2", this.windowHelper.section2.twoThird +5);
			}else{
				meanLines = meanLines.attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).style("stroke", "green").style("opacity",1);
			}

			if(incDist){
				if(this.transitionSpeed > 200){
					if(goSlow){
						var waitTime = (powScale.invert(this.sampleSize)- powScale.invert(2 )) * fillInTime + delay + pauseDelay * 2 + this.transitionSpeed;
					}else{
						var waitTime = 10;
					}
					var downTo = this.preCalculatedTStat[indexUpTo].yPerSample[0];
					var redLine = svg.select(".meanOfSamples").append("line").attr("y1", this.windowHelper.section2.twoThird+this.windowHelper.lineHeight).attr("y2", this.windowHelper.section2.twoThird -this.windowHelper.lineHeight).attr("x1",this.xScale(sampMean[0].value)).attr("x2",this.xScale(sampMean[0].value)).style("stroke-width", 2).style("stroke", "red").style("opacity", 0);
					redLine.transition().delay(waitTime).duration(50).style("opacity",1).transition().duration(this.transitionSpeed).attr("y1", downTo).attr("y2", downTo).each("end",function(){d3.select(this).remove()});

				}
				var meanCircles = svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
					return (i>=indexUpTo) && (i <indexUpTo+jumps);
				});
				if(this.transitionSpeed <= 100){
					meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5");
				}else{
					if(goSlow){
						meanCircles = meanCircles.transition().delay(powScale.invert(this.sampleSize)- powScale.invert(2 ) * fillInTime + delay + pauseDelay * 2 + this.transitionSpeed*2).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]});
					}else{
						meanCircles = meanCircles.transition().delay(this.transitionSpeed).duration(30).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]});
					}
				}
			}
			this.index += jumps;


		}else{
			this.animationState = 0;

		}
	}

	this.resetLines =function(){
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
		d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		this.pauseState = this.animationState;
		this.animationState = 0;
		d3.selectAll(".goButton").attr("disabled",true);
	}
	this.unPause = function(){
		this.resetLines();
		//d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		this.animationState = this.pauseState;
				this.animationState = 0;
		d3.selectAll(".goButton").attr("disabled",null);
	}
}