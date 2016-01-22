
function slope(inputData, headingX, headingY){
	this.radius = 5;
	this.population = [];
	this.populationStatistic = null;
	this.numSamples = 1000;
	this.xScale = null;
	this.samples = [];
	this.preCalculatedTStat = [];
	this.transitionSpeed = 1000;
	this.index = 0;
	this.statsDone = false;
	this.animationState = 0;
	this.baseTransitionSpeed = 1000;
	this.windowHelper = setUpWindow(this.radius*2);
	this.barHeight = 100;
	this.focusGroup = focus;
	this.order = [focus,"Other"];
	this.sampleSize = 20;
	this.sampleLines = [];
	this.maxHeight = 0;
	this.maxWidth = 0;
	this.popSetup = false;
	this.sampSetup = false;

	this.setUpPopulation = function(){
		this.samples.push([]);
		var xValues = [];
		var yValues = [];
		for(var i = 0; i<inputData.length;i++){
			var valueX = +inputData[i][headingX];
			var valueY = +inputData[i][headingY];
			if(isNaN(valueX)) continue;
			if(isNaN(valueY)) continue;
			var addItem = new item(0, i);
			addItem.valueX = valueX;
			addItem.valueY = valueY;
			this.population.push([valueX,valueY]);
			xValues.push(valueX);
			yValues.push(valueY);
		}
		this.maxWidth = d3.max(xValues) + 50;
		this.xScale = d3.scale.linear().range([0,this.windowHelper.innerWidth*0.7]);
		this.xScale.domain([0,d3.max(xValues) + 50]);

		this.yScale = d3.scale.linear().range([this.windowHelper.section1.height,this.radius]);
		this.yScale.domain([0,d3.max(yValues)+ 50]);

		this.slopeScale = d3.scale.linear().range([this.windowHelper.section1.height,this.radius]);
		this.slopeScale.domain([0,(d3.max(yValues) + 50)/(d3.max(xValues)+50)]);

		this.populationStatistic = 0;
		var xSeries = this.population.map(function(d){return d[0]});
		var ySeries = this.population.map(function(d){return d[1]});
		this.populationStatistic =	leastSquares(xSeries,ySeries);
		this.popSetup = true;
	}	

	this.setUpSamples = function(sSize){
		if(sSize >= this.population.length){
			alert("Sample size is too large for the poplation");
			return;
		}
		this.samples = this.makeSamples(this.population, this.numSamples, sSize);
		this.sampSetup = true;
	}




	this.makeSamples = function(population, numSamples, sampleSize){
		var samples = [];
		for(var i = 0; i<numSamples;i++){
			var indexs = pickRand(sampleSize, population.length);
			samples.push([]);
			samples[i].push([]);
			for(var j =0; j<sampleSize;j++){
				samples[i][0].push(population[indexs[j]]);
			}
			var xSeries = samples[i][0].map(function(d){return d[0]});
			var ySeries = samples[i][0].map(function(d){return d[1]});
			samples[i].push(leastSquares(xSeries,ySeries))
			var mH = this.maxWidth*samples[i][1][0];
			if(mH> this.maxHeight) this.maxHeight=mH;
			this.yScale.domain([0,this.maxHeight]);
			this.slopeScale.domain([0,(this.maxHeight/this.maxWidth)]);
			this.preCalculatedTStat.push(new item(samples[i][1][0], i));
		}
		heapYValues3(this.preCalculatedTStat, this.slopeScale, this.radius, 0,this.windowHelper.innerWidth *0.02 ,this.windowHelper.innerWidth *0.23);
		return samples;
	}	


	this.draw = function(){
		var svg = d3.select(".svg");
		this.drawPop();
		this.drawSamples();

	}
	this.drawSamples = function(){
		if(!this.sampSetup) return;
		var self = this;
		var svg = d3.select(".svg");
		var sample = this.samples[0];
		var meanCircles = svg.select(".sampCircles").selectAll("circle").data(sample[0])
			.enter().append("circle")
		    .attr("cx", function(d, i) { 
		    	return self.xScale(d[0]) +25})
		    .attr("cy", function(d) {
		    	return self.yScale(d[1]) + self.radius*1 + self.windowHelper.section2.top;
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 1)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",0);
		var dataLine = svg.select(".sampCircles").selectAll("line").remove();
		var d = sample[1];
		svg.select(".sampCircles").append("line")
				.attr("x1",this.xScale(0)+25)
				.attr("y1",self.yScale(d[1]) + self.windowHelper.section2.top)
				.attr("x2",this.xScale(this.xScale.domain()[1])+25)
				.attr("y2",self.slopeScale(d[0]) +self.windowHelper.section2.top)
				.style("stroke-width", 2).style("stroke", "black");

		svg.select(".meanCircles").selectAll("circle").data(this.preCalculatedTStat).enter().append("circle")
			    .attr("cx", function(d, i) { 
			    	return self.windowHelper.innerWidth - d.yPerSample[0]})
			    .attr("cy", function(d) {
			    	return d.xPerSample[0] + self.windowHelper.section3.top; ;
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 0)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",0);
	}
	this.drawPop = function(){
		if(!this.popSetup) return;
		var self = this;
		var svg = d3.select(".svg");
		svg.append("svg").attr("class","sampLines");

		svg.append("svg").attr("class","popCircles");
		svg.append("svg").attr("class","meanCircles");
		svg.append("svg").attr("class","sampCircles");
		var xAxis = d3.svg.axis().scale(this.xScale);
		var yAxis = d3.svg.axis().scale(this.yScale).orient("left");
		var slopeAxis = d3.svg.axis().scale(this.slopeScale).orient("right");
		svg.append("g").attr("class","axis").attr("transform", "translate(25," + (this.windowHelper.section1.height) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate("+25+","+0+")").call(yAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate("+(25 +this.windowHelper.innerWidth*0.7)+","+0+")").call(slopeAxis)

		svg.append("g").attr("class","axis").attr("transform", "translate(25," + (this.windowHelper.section2.bottom) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate("+25+","+this.windowHelper.section2.top+")").call(yAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate("+(25 +this.windowHelper.innerWidth*0.7)+","+this.windowHelper.section2.top+")").call(slopeAxis);
		
		svg.append("g").attr("class","axis").attr("transform", "translate(25," + (this.windowHelper.section3.bottom) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate("+25+","+(this.windowHelper.section3.top)+")").call(slopeAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate("+(25 +this.windowHelper.innerWidth*0.7)+","+this.windowHelper.section3.top+")").call(slopeAxis);

		var test =this.xScale.domain();
		svg.select(".popCircles").append("line").attr("x1",this.xScale(0)+25).attr("y1",this.yScale(this.populationStatistic[1])).attr("x2",this.xScale(this.xScale.domain()[1])+25).attr("y2",this.slopeScale(this.populationStatistic[0])).style("stroke-width", 2).style("stroke", "black");
		svg.select(".popCircles").append("text")
			.attr("x", this.windowHelper.innerWidth*0.8)
			.attr("y", this.windowHelper.section1.height * 0.5)
			.text(this.populationStatistic[0])
			.attr("fill","red")
			.style("font-size","32px")
			.attr("text-anchor","left")
			.style("opacity",1);
		svg.select(".popCircles").selectAll("circle").data(this.population)
			.enter().append("circle")
			.attr("cx",function(d){return self.xScale(d[0]) +25})
			.attr("cy",function(d){return self.yScale(d[1])})
			.attr("r",this.radius);
	}
	this.startAnim = function(repititions, goSlow){
		var self = this;
		if(repititions >999) this.resetLines();
		if(this.animationState == 0){
			this.transitionSpeed = this.baseTransitionSpeed-repititions*20;
			this.animationState = 1;
			if(this.index > this.numSamples){
				this.index = this.index % this.numSamples;
				this.resetLines();
			}
			var start = this.index;
			var end = start + repititions;
			if(repititions > 100) this.transitionSpeed = 50;
			var jumps = 1;
			if(repititions > 20) jumps = 10;
			self.stepAnim(start, end, goSlow, jumps);
		}
	}
	this.stepAnim = function(indexUpTo, goUpTo, goSlow, jumps){
		if(this.animationState != 1){
			return;
		}
		if(indexUpTo < goUpTo){
			if(indexUpTo >= this.numSamples){
				this.animationState = 0;
				return
			}

		var self = this;
		var svg = d3.select(".svg");
		var sample = this.samples[indexUpTo];
		var delay = 1000;
		var pauseDelay = 1000;
		svg.select(".sampCircles").selectAll("*").remove();
		svg.select(".sampCircles").append("text")
			.attr("x", this.windowHelper.innerWidth*0.8)
			.attr("y", this.windowHelper.section1.height * 0.5 + this.windowHelper.section2.top)
			.text(sample[1][0])
			.attr("fill","red")
			.style("font-size","32px")
			.attr("text-anchor","left")
			.style("opacity",1);
		var meanCircles = svg.select(".sampCircles").selectAll("circle").data(sample[0])
			.enter().append("circle");
		    meanCircles.attr("cx", function(d, i) { 
		    	return self.xScale(d[0]) +25})
		    .attr("cy", function(d) {
		    	if(goSlow){
		    		return self.yScale(d[1]) - self.radius*1 + self.windowHelper.section1.top;
		    	}else{
		    		return self.yScale(d[1])+ self.windowHelper.section2.top;
		    	}
		    })
		    .attr("r", function(d) { return self.radius; })
		    .style("fill", "#FF7148")
		    .attr("fill-opacity", 0)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",0);
		if(goSlow){
				meanCircles.transition().delay(function(d,i){return delay*2/sample[0].length * sample[0].indexOf(d)}).duration(100).attr("fill-opacity", 1)
				.transition().duration(function(d,i){return delay*2/sample[0].length * (sample[0].length - sample[0].indexOf(d))})
				.transition().duration(pauseDelay)
				.transition().duration(this.transitionSpeed).attr("cy", function(d) {return self.yScale(d[1])+ self.windowHelper.section2.top;});
		}else{
				meanCircles.attr("fill-opacity", 1);
		}
		var dataLine = svg.select(".sampCircles").selectAll("line").remove();
		var d = sample[1];
		var sampLine =svg.select(".sampCircles").append("line")
				.attr("x1",this.xScale(0)+25)
				.attr("y1",self.yScale(d[1]) + self.windowHelper.section2.top)
				.attr("x2",this.xScale(this.xScale.domain()[1])+25)
				.attr("y2",self.slopeScale(d[0]) +self.windowHelper.section2.top)
				.style("stroke-width", 2).style("stroke", "black").style("opacity",0);
		if(goSlow){
			sampLine.transition().delay(delay*2+pauseDelay+this.transitionSpeed).duration(this.transitionSpeed).style("opacity",1);
		}else{
			sampLine.style("opacity",1);
		}


			this.index += jumps;
		this.sampleLines.push(d);
		var sLines =svg.select(".sampLines").selectAll("line").data(this.sampleLines).style("opacity",0.2).style("stroke", "black");
		sLines = sLines.enter().append("line");
			sLines.attr("x1",this.xScale(0)+25)
				.attr("y1",self.yScale(d[1]) + self.windowHelper.section2.top)
				.attr("x2",this.xScale(this.xScale.domain()[1])+25)
				.attr("y2",self.slopeScale(d[0]) +self.windowHelper.section2.top)
				.style("stroke-width", 2).style("stroke", "steelblue")
				.style("opacity",0);

		if(goSlow){
			sLines.transition().delay(delay*2+pauseDelay+this.transitionSpeed).duration(this.transitionSpeed).style("opacity",1)
			.transition().duration(pauseDelay)
			.transition().duration(this.transitionSpeed).attr("y1",self.yScale(0) + self.windowHelper.section3.top).attr("y2",self.slopeScale(d[0]) +self.windowHelper.section3.top);
		}else{
			sLines.attr("y1",self.yScale(0) + self.windowHelper.section3.top).attr("y2",self.slopeScale(d[0]) +self.windowHelper.section3.top).style("opacity",1);
		}
		var meanCircles = svg.select(".meanCircles").selectAll("circle").filter(function(d, i){
			return (i>=indexUpTo) && (i <indexUpTo+jumps);
		});
		if(this.transitionSpeed <= 100){
			meanCircles =meanCircles.style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5");
		}else{
			if(goSlow){
				meanCircles = meanCircles.transition().delay(delay*2+pauseDelay*2+this.transitionSpeed*3).attr("fill-opacity",(this.transitionSpeed * 0.001)).attr("stroke-opacity",(this.transitionSpeed * 0.001))
				.transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue");
			}else{
				meanCircles = meanCircles.attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").transition().delay(this.transitionSpeed).duration(this.transitionSpeed);
			}
		}



		setTimeout(function(){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)},100);
		}else{
			this.animationState = 0;

		}



	}

	this.resetLines =function(){
		this.index = 1;
		var self = this;
		var svg = d3.select(".svg");
		var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", this.windowHelper.section1.bottom+20).attr("y2", this.windowHelper.section1.bottom-20).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);
		this.sampleLines = [];
		svg.select(".sampLines").selectAll("line").remove();
		svg.select(".meanCircles").selectAll("circle").attr("fill-opacity",0).attr("stroke-opacity",0);
		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").remove();


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
		this.samples = [];
		this.preCalculatedTStat = [];		
		this.transitionSpeed = 1000;
		this.index = 0;
		this.statsDone = false;

		this.baseTransitionSpeed = 1000;
	}
}