
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

	this.setUpPopulation = function(){
		this.samples.push([]);
		var xValues = [];
		var yValues = [];
		for(var i = 0; i<inputData.length;i++){
			var valueX = +inputData[i][headingX];
			var valueY = +inputData[i][headingY];
			var addItem = new item(0, i);
			addItem.valueX = valueX;
			addItem.valueY = valueY;
			this.population.push([valueX,valueY]);
			xValues.push(valueX);
			yValues.push(valueY);
		}
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
	}

	this.setUpSamples = function(){
		this.samples = this.makeSamples(this.population, this.numSamples, this.sampleSize);
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
		}
		return samples;
	}	


	this.draw = function(){
		this.drawPop();
		this.drawSamples();

	}
	this.drawSamples = function(){
		var self = this;
		var svg = d3.select(".svg");
		var sample = this.samples[0];
		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(sample[0])
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
		var dataLine = svg.select(".meanOfSamples").selectAll("line").remove();
		var d = sample[1];
		svg.select(".meanOfSamples").append("line")
				.attr("x1",this.xScale(0)+25)
				.attr("y1",self.yScale(d[1]) + self.windowHelper.section2.top)
				.attr("x2",this.xScale(this.xScale.domain()[1])+25)
				.attr("y2",self.slopeScale(d[0]) +self.windowHelper.section2.top)
				.style("stroke-width", 2).style("stroke", "black");

	}
	this.drawPop = function(){
		var self = this;
		var svg = d3.select(".svg");
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
		svg.append("line").attr("x1",this.xScale(0)+25).attr("y1",this.yScale(this.populationStatistic[1])+this.radius*1).attr("x2",this.xScale(this.xScale.domain()[1])+25).attr("y2",this.slopeScale(this.populationStatistic[0]) +this.radius*1).style("stroke-width", 2).style("stroke", "black");

		svg.selectAll("circle").data(this.population)
			.enter().append("circle")
			.attr("cx",function(d){return self.xScale(d[0]) +25})
			.attr("cy",function(d){return self.yScale(d[1]) + self.radius*1})
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
		svg.select(".meanOfSamples").selectAll("circle").remove();
		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(sample[0])
			.enter().append("circle");
		    meanCircles.attr("cx", function(d, i) { 
		    	return self.xScale(d[0]) +25})
		    .attr("cy", function(d) {
		    	return self.yScale(d[1]) + self.radius*1 + self.windowHelper.section2.top;
		    })
		    .attr("r", function(d) { return self.radius; })
		    .attr("fill-opacity", 1)
		    .attr("stroke","#556270")
		    .attr("stroke-opacity",0);
		var dataLine = svg.select(".meanOfSamples").selectAll("line").remove();
		var d = sample[1];
		svg.select(".meanOfSamples").append("line")
				.attr("x1",this.xScale(0)+25)
				.attr("y1",self.yScale(d[1]) + self.windowHelper.section2.top)
				.attr("x2",this.xScale(this.xScale.domain()[1])+25)
				.attr("y2",self.slopeScale(d[0]) +self.windowHelper.section2.top)
				.style("stroke-width", 2).style("stroke", "black");


			this.index += jumps;

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
		loadMain();
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
}