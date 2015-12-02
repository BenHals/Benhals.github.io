
function oneProportion(inputData, heading, statistic){
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
	this.windowHelper = setUpWindow(this.radius);

	this.setUpPopulation = function(){
		this.samples.push([]);
		var groups = {};
		for(var i = 0; i<inputData.length;i++){
			var value = inputData[i][heading];
			if(!(value in groups)) groups[value] = 1;
			groups[value] += 1;
			var addItem = new item(0, i);
			addItem.group = value;
			this.population.push(addItem);
		}
		var total = 0;
		for(var key in groups){
			this.samples[0].push([total, groups[key]]);
			total += groups[key];
		}
		this.xScale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
		this.xScale.domain([0,1]);
	}

	this.setUpSamples = function(){
		var lastElement = this.samples[0][this.samples[0].length -1];
		var total = lastElement[0] + lastElement[1];
		this.populationStatistic = 0;
		this.populationStatistic =	lastElement[0]/ (lastElement[1]+lastElement[0]);
		this.samples = this.samples.concat(this.makeSamples(this.population, this.numSamples, 20));
		for(var k = 0; k < this.numSamples;k++){
			lastElement = this.samples[k+1][this.samples[0].length -1];
			var stat = lastElement[0]/ (lastElement[1]+lastElement[0]);
			this.preCalculatedTStat.push(new item(stat, k));
		}
		heapYValues3(this.preCalculatedTStat, this.xScale, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom);

		this.statsDone = true;
	}




	this.makeSamples = function(population, numSamples, sampleSize){
	var samples = [];
	for(var i = 0; i<numSamples;i++){
		var groups = {};
		samples.push([]);
		var indexs = pickRand(sampleSize, population.length);
		for(var k = 0; k<sampleSize;k++){
			var value = population[indexs[k]]["group"];
			if(!(value in groups)) groups[value] = 1;
			groups[value] += 1;
		}
		var total = 0;
		for(var key in groups){
			samples[i].push([total, groups[key]]);
			total += groups[key];
		}
		if(samples[i].length == 1){
			samples[i].push([total, 0]);
		}
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
		/*var meanLines = svg.select(".sampleLines").selectAll("line").data(this.preCalculatedTStat)
			.enter().append("line").attr("y1", this.windowHelper.section1.bottom+20).attr("y2", this.windowHelper.section1.bottom-20).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);
	*/
		var meanCircles = svg.select(".meanOfSamples").selectAll("circle").data(this.preCalculatedTStat)
			.enter().append("circle")
			    .attr("cx", function(d, i) { 
			    	return d.xPerSample[0]; })
			    .attr("cy", function(d) {
			    	return d.yPerSample[0] - (self.windowHelper.section3.bottom- self.windowHelper.section2.bottom);
			    })
			    .attr("r", function(d) { return self.radius; })
			    .attr("fill-opacity", 0)
			    .attr("stroke","#556270")
			    .attr("stroke-opacity",0);
	}
	this.drawPop = function(){
		var self = this;
		//if(!this.statsDone) return;
		var svg = d3.select(".svg");
		var xAxis = d3.svg.axis();
		xAxis.scale(this.xScale)
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis);
		var lastElement = this.samples[0][this.samples[0].length -1];
		var total = lastElement[0] + lastElement[1];
		this.xScale.domain([0,total]);
		var g1Rect = svg.selectAll("rect").data(this.samples[0]);
		g1Rect.enter().append("rect")
			.attr("height","100")
			.attr("y",this.windowHelper.section1.bottom - 100)
			.attr("width", function(d){return self.xScale(d[1])})
			.attr("x",function(d){return self.xScale(d[0])})
			.attr("fill",function(d,i){return colorByIndex[i]});
		/*var circle = svg.selectAll("circle").data(this.population);
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

		svg.append("line").attr("x1", this.xScale(this.populationStatistic)).attr("y1", this.windowHelper.section1.bottom+20).attr("x2", this.xScale(this.populationStatistic)).attr("y2", this.windowHelper.section1.bottom-20).style("stroke-width", 2).style("stroke", "black");
	*/
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
			if(repititions > 100) this.transitionSpeed = 0;
			var jumps = 1;
			if(repititions > 20) jumps = 10;
			self.stepAnim(start, end, goSlow, jumps);
		}
	}
	this.stepAnim = function(indexUpTo, goUpTo, goSlow, jumps){
		var svg = d3.select(".svg");
		var self = this;
		if(this.animationState != 1){
			return;
		}
		if(indexUpTo < goUpTo){
			if(indexUpTo >= this.numSamples){
				this.animationState = 0;
				return
			}
			var circle = svg.selectAll("circle");
			var sample = this.samples[indexUpTo+1];
			var delay = 1;
			/*if(goSlow) delay = 1000;
			circle = circle.filter(function(d,i){return sample.indexOf(d) >= 0;});
			if(goSlow){
				circle = circle.transition().duration(delay).style("fill", "#FF7148").attr("fill-opacity", 1)
								.transition().duration(delay);
			}else{
				circle = circle.style("fill", "#FF7148").attr("fill-opacity", 1);
			}
			if(this.transitionSpeed <= 100){
				circle = circle.attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
				.transition().duration(delay)
				.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
			}else{
				circle = circle.transition().duration(this.transitionSpeed).attr("cy", function(d, i){return d.yPerSample[indexUpTo+1]})
				.transition().duration(delay)
				.transition().duration(delay).attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.5)
				.each('end', function(d, i){ if(d == sample[0]){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
			} */
			var lastElement = sample[1];
			var total = lastElement[0] + lastElement[1];
			this.xScale.domain([0,total]);
			var sampleRect = svg.select(".sampleLines").selectAll("rect").data(sample);
			sampleRect.exit().remove();
			sampleRect.enter().append("rect");
			sampleRect
			.attr("height","100")
			.attr("y",this.windowHelper.section2.bottom - 100)
			.attr("width", function(d){return self.xScale(d[1])})
			.attr("x",function(d){return self.xScale(d[0])})
			.attr("fill",function(d,i){return colorByIndex[i]});


			/*
			var sampMean = this.preCalculatedTStat.slice(indexUpTo+1, indexUpTo+jumps+1);

			var meanLines = svg.select(".sampleLines").selectAll("line").filter(function(d, i){
				return (i>=indexUpTo+1) && (i <indexUpTo+jumps+1);
			});
			if(goSlow){
				meanLines = meanLines.transition().delay(delay).duration(delay).style("opacity",1)
				.transition().duration(this.transitionSpeed).attr("y1", this.windowHelper.section2.bottom+10).attr("y2", this.windowHelper.section2.bottom-10).style("stroke", "steelblue")
				.transition().duration(this.transitionSpeed).style("opacity",0.2).style("stroke", "steelblue");
			}else{
				meanLines = meanLines.attr("y1", this.windowHelper.section2.bottom+10).attr("y2", this.windowHelper.section2.bottom-10).style("stroke", "steelblue").style("opacity",1).transition().duration(this.transitionSpeed).style("opacity",0.2);
			}
			*/
			var meanCircles = svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
				return (i>=indexUpTo) && (i <indexUpTo+jumps);
			});
			if(this.transitionSpeed <= 100){
				meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5").each('end', function(d, i){ if(i == 0){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
			}else{
				if(goSlow){
					meanCircles = meanCircles.transition().delay(delay*2 + this.transitionSpeed).attr("fill-opacity",(this.transitionSpeed * 0.001)).attr("stroke-opacity",(this.transitionSpeed * 0.001))
					.transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]}).each('end', function(d, i){ if(i == 0){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
				}else{
					meanCircles = meanCircles.attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").transition().delay(this.transitionSpeed).duration(this.transitionSpeed).attr("cy", function(d){return d.yPerSample[0]}).each('end', function(d, i){ if(i ==0){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
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
		var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", this.windowHelper.section1.bottom+20).attr("y2", this.windowHelper.section1.bottom-20).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

		var meanCircles = svg.select(".meanOfSamples").selectAll("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0] - (self.windowHelper.section3.bottom- self.windowHelper.section2.bottom);
		    })
		    .attr("fill-opacity", 0)
		    .attr("stroke-opacity",0); 


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