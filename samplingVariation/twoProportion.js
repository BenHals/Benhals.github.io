
function twoProportion(inputData, heading, heading2, focus){
	this.radius = 5;
	this.population = [];
	this.populationStatistic = null;
	this.numSamples = 1000;
	this.xScale = null;
	this.samples = [];
	this.preCalculatedTStat = [];
	this.transitionSpeed = 1000;
	this.index = 1;
	this.statsDone = false;
	this.animationState = 0;
	this.baseTransitionSpeed = 1000;
	this.windowHelper = setUpWindow(this.radius);
	this.barHeight = 100;
	this.focusGroup = focus;
	this.order = [focus,"Other Groups"];
		this.popSetup = false;
	this.sampSetup = false;
	this.category = heading;
	this.category2 = heading2;
	this.drawnSamples = [];
			this.implemented = true;
			this.popGroups = {};


	this.setUpPopulation = function(){
		this.sampleSize = 20;
		this.samples.push([]);
		this.drawnSamples = [];
		var groups = {};
		this.unique1 = mainControl.model.dataSplit[heading].filter(onlyUnique);
		this.unique2 = mainControl.model.dataSplit[heading2].filter(onlyUnique);
		if(this.unique1.length == 2){
			if(focus != this.unique1[1]){
				this.order[1] = this.unique1[1];
			}else{
				this.order[1] = this.unique1[0];
			}
		}
		for(var i = 0;i<this.unique2.length;i++){
			groups[this.unique2[i]] = {};
			for(var k = 0;k<this.order.length;k++){
				groups[this.unique2[i]][this.order[k]] = 0;
			}
		}
		for(var j = 0;j<inputData.length;j++){
			var firstSplit = inputData[j][heading2];
			var value = inputData[j][heading];
			if(!(value == this.focusGroup)) value = this.order[1];
			groups[firstSplit][value] += 1;
			var addItem = new item(0,j);
			addItem.firstSplit = firstSplit;
			addItem.secondSplit = value;
			this.population.push(addItem);
		}
		this.popGroups = groups;
		/*
		this.secondaryGroup = null;
		var groups = {};
		for(var j =0;j<this.order.length;j++){
			groups[this.order[j]] = 0;
		}
		for(var i = 0; i<inputData.length;i++){
			var value = inputData[i][heading];
			if(!(value == this.focusGroup)) value = "Other Groups";
			if(!(value in groups)) groups[value] = 0;
			groups[value] += 1;
			var addItem = new item(0, i);
			addItem.group = value;
			this.population.push(addItem);
		}
		var total = 0;
		for(var j =0;j<this.order.length;j++){
			this.samples[0].push([total, groups[this.order[j]]]);
			total += groups[this.order[j]];
		} */

		if(this.unique2.length != 2){
			this.implemented = false;
		}else{
			this.group1Proportion = this.popGroups[this.unique2[0]][this.order[0]] / (this.popGroups[this.unique2[0]][this.order[0]] + this.popGroups[this.unique2[0]][this.order[1]]);
			this.group2Proportion = this.popGroups[this.unique2[1]][this.order[0]] / (this.popGroups[this.unique2[1]][this.order[0]]+ this.popGroups[this.unique2[1]][this.order[1]]);

			this.popDiff = this.group1Proportion - this.group2Proportion;
		}
		this.xScale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
		this.xScale.domain([0,1]);
		this.popSetup = true;
	}

	this.setUpSamples = function(sSize){
		if(sSize >= this.population.length){
			alert("Sample size is too large for the poplation");
			return;
		}
		if(this.unique2.length == 2){
			this.samples = this.makeSamples(this.population, this.numSamples, sSize);
			for(var i = 0;i<this.samples.length;i++){
				var prop1 = this.samples[i][0][0][1] / this.samples[i][0][1][1];
				var prop2 = this.samples[i][1][0][1] / this.samples[i][1][1][1];

				var diff = prop1 - prop2;
				this.preCalculatedTStat.push(new item(diff,i));
			}

			this.xScale2 = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth]);
			var range2 = this.xScale.domain();
			var halfDiff = (range2[1]-range2[0])/2;
			this.xScale2.domain([0-halfDiff, 0+halfDiff]);
			heapYValues3(this.preCalculatedTStat, this.xScale2, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom);
			/*
			var lastElement = this.samples[0][this.samples[0].length -1];
			this.total = lastElement[0] + lastElement[1];
			this.populationStatistic = 0;
			this.populationStatistic =	this.xScale(lastElement[0]/ (lastElement[1]+lastElement[0]));
			this.samples = this.samples.concat(this.makeSamples(this.population, this.numSamples, sSize));
			for(var k = 0; k < this.numSamples;k++){
				lastElement = this.samples[k+1][this.samples[0].length -1];
				var stat = lastElement[0]/ (lastElement[1]+lastElement[0]);
				this.preCalculatedTStat.push(new item(stat, k));
			}
			heapYValues3(this.preCalculatedTStat, this.xScale, this.radius, 0, this.windowHelper.section3.top,this.windowHelper.section3.bottom); */
		}else{
			mainControl.notImplemented();
		}
		this.statsDone = true;
		this.sampSetup = true;
	}




	this.makeSamples = function(population, numSamples, sampleSize){
	var samples = [];
	for(var i = 0; i<numSamples;i++){
		var samp = [[[0,0],[0,0]],[[0,0],[0,0]]];
		var indexs = pickRand(sampleSize, population.length);
		for(var k =0;k<indexs.length;k++){
			var chosen = population[indexs[k]];
			if(chosen.secondSplit == this.focusGroup){
				var fSplit = this.unique2.indexOf(chosen.firstSplit);
				samp[fSplit][0][1] += 1;
			}else{
				var fSplit = this.unique2.indexOf(chosen.firstSplit);
				samp[fSplit][1][1] += 1;
			}
		}
		samp[0][1][0] = samp[0][0][1];
		samp[0][1][1] = samp[0][1][1] + samp[0][0][1];
		samp[1][1][0] = samp[1][0][1];
		samp[1][1][1] = samp[1][1][1] + samp[1][0][1];

		samples.push(samp);
		/*
		var groups = {};
		for(var j =0;j<this.order.length;j++){
			groups[this.order[j]] = 0;
		}
		samples.push([]);
		var indexs = pickRand(sampleSize, population.length);
		for(var k = 0; k<sampleSize;k++){
			var value = population[indexs[k]]["group"];
			if(!(value in groups)) groups[value] = 0;
			groups[value] += 1;
		}
		var total = 0;
		for(var key in groups){
			samples[i].push([total, groups[key]]);
			total += groups[key];
		}
		if(samples[i].length == 1){
			samples[i].push([total, 0]);
		} */
	}
	return samples;
	}


	this.draw = function(){
		this.drawPop();
		this.drawSamples();

	}
	this.drawSamples = function(){
		if(!this.sampSetup) return;
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

		var xAxis2 = d3.svg.axis();
		xAxis2.scale(this.xScale2)
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section3.bottom + this.radius) + ")").call(xAxis2);

		drawArrow(this.xScale2(this.popDiff), this.xScale2(0), this.windowHelper.section3.bottom, svg.select(".pop"), "popDiffBot", 0.5, "blue");
		svg.append("line").attr("x1", this.xScale2(this.popDiff)).attr("y1", this.windowHelper.section3.bottom - this.marginSize*5).attr("x2", this.xScale2(this.popDiff)).attr("y2", this.windowHelper.section3.bottom).style("stroke-width", 0.5).style("stroke", "blue").attr("stroke-dasharray","5,5").style("opacity",1);;
	}
	this.drawPop = function(){
		if(!this.popSetup) return;
		var self = this;
		//if(!this.statsDone) return;
		var svg = d3.select(".svg");
		//svg.append("text").text("what");
		var sampleSelection = svg.append("svg").attr("class","sampleSelection");
		for(var i =0;i<this.unique2.length;i++){
			for(var k=0;k<this.order.length;k++){
				sampleSelection.append("svg").classed(this.unique2[i].replace(/\s+/g, '') +" "+this.order[k].replace(/\s+/g, ''),true);
			}
		}
		//sampleSelection.append("svg").attr("class","g1Circles");
		//sampleSelection.append("svg").attr("class","g2Circles");
		var xAxis = d3.svg.axis();
		xAxis.scale(this.xScale)


		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section1.bottom + this.radius) + ")").call(xAxis);
		svg.append("g").attr("class","axis").attr("transform", "translate(0," + (this.windowHelper.section2.bottom + this.radius) + ")").call(xAxis);

		var fontSize = this.windowHelper.section1.height / (this.unique2.length*3);
		if(fontSize > 32) fontSize = 32;
		this.marginSize = this.windowHelper.height/70;
		this.barHeight = (this.windowHelper.section1.height - this.marginSize*this.unique2.length) / this.unique2.length;

		svg.append("svg").attr("class", "pop");

		for(var k =0;k<this.unique2.length;k++){
			var total = 0
			var rects = [];
			for(var l = 0;l<this.order.length;l++){
				var newTotal = total + this.popGroups[this.unique2[k]][this.order[l]];
				rects.push([total, newTotal]);
				total = newTotal;
			}
			var gRects = svg.select(".pop").append("g").attr("id",this.unique2[k].replace(/\s+/g+"Rect")).selectAll("g").data(rects).enter().append("g");

			gRects.append("rect")
				.attr("height",this.barHeight)
				.attr("y",this.windowHelper.section1.bottom - (this.barHeight*(k+1))-this.marginSize*k)
				.attr("width", function(d){return self.xScale((d[1]-d[0])/total) - self.radius})
				.attr("x",function(d){return self.xScale(d[0]/total)})
				.attr("fill",function(d,i){return colorByIndex[i]})
				.attr("fill-opacity","0.5");

			gRects.append("text")
				.attr("x", function(d){return self.xScale((d[0] +((d[1]-d[0])/2))/total)})
				.attr("y", this.windowHelper.section1.bottom   - (this.barHeight*(k+1))-this.marginSize*k + fontSize*2)
				.text(function(d){return d[1]})
				//.attr("fill",function(d,i){return colorByIndex[i]})
				.style("font-size", fontSize+"px")
				.attr("text-anchor","middle").style("opacity",0.6).classed("labelText",true);
			gRects.append("text")
				.attr("x", function(d){return self.xScale((d[0] +((d[1]-d[0])/2))/total)})
				.attr("y", this.windowHelper.section1.bottom  - (this.barHeight*(k+1))-this.marginSize*k + fontSize)
				.text(function(d, i){return self.order[i]})
				//.attr("fill",function(d,i){return colorByIndex[i]})
				.style("font-size",fontSize+"px")
				.attr("text-anchor","middle").style("opacity",0.6).classed("labelText",true);

			gRects.append("text")
				.attr("x", function(d){return self.xScale((d[0] +((d[1]-d[0])/5 * 4))/total)})
				.attr("y", this.windowHelper.section1.bottom  - (this.barHeight*(k+1))-this.marginSize*k + fontSize)
				.text(function(d, i){return self.unique2[k]})
				//.attr("fill",function(d,i){return colorByIndex[i]})
				.style("font-size",fontSize+"px")
				.attr("text-anchor","middle").style("opacity",0.6).classed("labelText",true)
				.attr("visibility", function(d,i){if(i != self.order.length -1){return "hidden"}else{ return "true"}});

		}
		if(this.popDiff){
			 drawArrow(this.xScale(this.group1Proportion), this.xScale(this.group2Proportion), this.windowHelper.section1.bottom  - this.barHeight -this.marginSize/2, svg.select(".pop"), "popDiff", 1, "blue");
		}


		/*var lastElement = this.samples[0][this.samples[0].length -1];
		var total = lastElement[0] + lastElement[1];
		//this.xScale.domain([0,total]);
		svg.append("svg").attr("class", "pop");
		var g1Rect = svg.select(".pop").selectAll("g").data(this.samples[0]);
		var groups = g1Rect.enter().append("g");
		var fontSize = this.windowHelper.section1.height /9;
		groups.append("rect")
			.attr("height",this.barHeight)
			.attr("y",this.windowHelper.section1.bottom - this.barHeight)
			.attr("width", function(d){return self.xScale(d[1]/total) - self.radius})
			.attr("x",function(d){return self.xScale(d[0]/total)})
			.attr("fill",function(d,i){return colorByIndex[i]})
			.attr("fill-opacity","0.5");

		groups.append("text")
			.attr("x", function(d){return self.xScale((d[0] +(d[1]/2))/total)})
			.attr("y", this.windowHelper.section1.bottom - this.barHeight + fontSize*2)
			.text(function(d){return d[1]})
			.attr("fill",function(d,i){return colorByIndex[i]})
			.style("font-size", fontSize+"px")
			.attr("text-anchor","middle").style("opacity",0.6);
		groups.append("text")
			.attr("x", function(d){return self.xScale((d[0] +(d[1]/2))/total)})
			.attr("y", this.windowHelper.section1.bottom - this.barHeight + fontSize)
			.text(function(d, i){return self.order[i]})
			.attr("fill",function(d,i){return colorByIndex[i]})
			.style("font-size",fontSize+"px")
			.attr("text-anchor","middle").style("opacity",0.6);
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
	*/
	//	svg.append("line").attr("x1", this.populationStatistic).attr("y1", this.windowHelper.section1.bottom+20).attr("x2", this.populationStatistic).attr("y2", this.windowHelper.section1.bottom-20).style("stroke-width", 2).style("stroke", "black");
	
	}
	this.startAnim = function(repititions, goSlow, incDist){
		var self = this;
		if(repititions >999) this.resetLines();
		if(this.animationState == 0){
			this.transitionSpeed = this.baseTransitionSpeed-repititions*20;
			//this.animationState = 1;
			if(this.index > this.numSamples){
				this.index = this.index % this.numSamples;
				this.resetLines();
			}
			var start = this.index;
			var end = start + repititions;
			if(repititions > 100) this.transitionSpeed = 50;
			var jumps = 1;
			if(repititions > 20) jumps = 1;
			if(repititions == 1) this.transitionSpeed = 1000;
			if(repititions == 5) this.transitionSpeed = 500;
			if(repititions == 20) this.transitionSpeed = 100;
			if(repititions == 1000) this.transitionSpeed = 0;
			var settings = new Object();
			settings.goSlow = goSlow;
			settings.indexUpTo = start;
			settings.incDist = incDist;
			settings.end = end;
			settings.jumps = jumps;
			settings.delay = 1000;
			settings.pauseDelay = 1000;
			settings.fadeIn = 200;
			this.makeRects(settings);
			//self.stepAnim(start, end, goSlow, jumps);
		}
	}

		/*this.fadeIn = function(settings){
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
				if(settings.goSlow)settings.svg.select(".sampleLines").selectAll("g").remove();
				var circle = settings.svg.select(".pop").selectAll("circle").attr("cy", function(d, i){return d.yPerSample[0];}).style("fill", "#C7D0D5").attr("fill-opacity",0.2);
				settings.svg.select(".sampleLines").selectAll("line").style("stroke", "steelblue").style("opacity",0.5).attr("y2",this.windowHelper.section2.bottom - this.barHeight/2 );
				var powScale = d3.scale.pow();
				powScale.exponent(4);
				powScale.domain([0,settings.delay*2]);
				var pop = this.samples[0];
				var randSelection = [];
				for(var i =0; i< settings.sample.length;i++){
					randSelection.push([]);
					for(var k = 0; k< settings.sample[i][1];k++){
						cY = Math.random()*(100-(this.radius*2)) + this.radius;
						cX = Math.random()*(pop[i][1] - (this.radius*2)) + pop[i][0] + this.radius;
						var scale = i;
						randSelection[i].push([cX,cY, scale]);
					}
				}
				var allInSample = randSelection[0].concat(randSelection[1]);
				shuffle(allInSample);
				var g1Circles = settings.svg.select(".g1Circles").selectAll("circle").data(randSelection[0], function(d){return d});
				g1Circles.exit().remove();
				g1Circles.enter().append("circle");
				g1Circles.attr("cx",function(d){return self.xScale(d[0]/self.total)}).attr("cy",function(d){return self.windowHelper.section1.bottom - d[1]}).attr("r",self.radius).style("fill",colorByIndex[0]).attr("fill-opacity",0).attr("stroke-opacity",0);

				var g2Circles = settings.svg.select(".g2Circles").selectAll("circle").data(randSelection[1], function(d){return d});
				g2Circles.exit().remove();
				g2Circles.enter().append("circle");
				g2Circles.attr("cx",function(d){return self.xScale(d[0]/self.total)}).attr("cy",function(d){return self.windowHelper.section1.bottom - d[1]}).attr("r","5").style("fill",colorByIndex[1]).attr("fill-opacity",0).attr("stroke-opacity",0);

			var lastElement = settings.sample[1];
			var sampleTotal = lastElement[0] + lastElement[1];
			settings.sampleTotal = sampleTotal;
			var stat = lastElement[0]/sampleTotal;
			settings.stat = stat;
				var g1Scale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth*stat]).domain([0,pop[0][1]/this.total]);
				var g2Scale = d3.scale.linear().range([this.windowHelper.innerWidth*stat,this.windowHelper.innerWidth]).domain([pop[1][0]/this.total,1]);
				var scales = [g1Scale,g2Scale];
				settings.scales = scales;
				this.settings.scales = scales;
			    var fillInTime = this.transitionSpeed/this.baseTransitionSpeed;
			    this.settings.circleOverlay = circleOverlay;
			    this.settings.powScale = powScale;
			    this.settings.allInSample = allInSample;
			}else{
				var circleOverlay = this.settings.circleOverlay;
				var powScale = this.settings.powScale;
				var self = this;
			    var fillInTime = this.transitionSpeed/this.baseTransitionSpeed;
			    var allInSample = this.settings.allInSample;
			    var scales = this.settings.scales;
			    this.settings.restarting = false;
			}
			var sampleSelection = settings.svg.select(".sampleSelection").selectAll("circle");
			if(settings.goSlow){
				sampleSelection = sampleSelection.transition().delay(function(d,i){return settings.delay*2/allInSample.length * allInSample.indexOf(d)}).duration(100).attr("fill-opacity", 1)
				.transition().duration(function(d,i){return settings.delay*2/allInSample.length * (allInSample.length - allInSample.indexOf(d))})
				.transition().duration(settings.pauseDelay)
				.transition().duration(this.transitionSpeed).attr("cy",function(d){return self.windowHelper.section2.bottom -self.barHeight/2- d[1]}).attr("cx",function(d){
					return scales[d[2]](d[0]/self.total)}).each("end", function(d, i){
						var test = i;
						if(i==0){
							self.makeRects(settings);
						}
					});
			}else{
				sampleSelection = sampleSelection.attr("fill-opacity", 1).transition().duration(0).each("end", function(d,i){
					if(i==0){
						self.makeRects(settings);
					}
					});
			}
	} */

	this.makeRects = function(settings){
			if(this.animationState == -1) return;
			if(this.animationState == 2) return;
			this.animationState = 2;
			var self = this;
			settings.svg = d3.select(".svg");
			var svg = settings.svg;
			settings.sample = this.samples[settings.indexUpTo];
			this.settings= settings;
			if(!this.unique2){
				alert("wtf");
			}
			d3.select("#sampDiff").remove();
			this.marginSize = this.windowHelper.section2.height/5;
			this.barHeight = (this.windowHelper.section2.height*0.8 - this.marginSize*this.unique2.length) / this.unique2.length;
			if(!this.settings.restarting){
				var samp = [[[0,0],[0,0]],[[0,0],[0,0]]];
				var sampleRect = svg.select(".sampleLines").selectAll("g").data([]);
				sampleRect.exit().remove();
				sampleRect = svg.select(".sampleLines").selectAll("g").data(settings.sample);
				sampleRect.exit().remove();
				var groups = sampleRect.enter().append("g");
					groups.append("rect")
					.attr("height",this.barHeight)
					.attr("id",function(d,i){ return i+"sentinal"})
					.attr("y",function(d,i){ return self.windowHelper.section2.bottom - self.barHeight * (i+1) - self.marginSize *(i+1)})
					.attr("width", function(d){
						return self.xScale(d[0][1]/d[1][1]) - self.radius})
					.attr("x",function(d){
						return self.xScale(d[0][0]/d[1][1])})
					.attr("fill",function(d,i){return colorByIndex[0]})
					.style("opacity",0);
					groups.append("text")
					.attr("x", function(d){
						return self.xScale((d[0][0] +(d[0][1]/2))/d[1][1])})
					.attr("y", function(d,i){ return self.windowHelper.section2.bottom - self.barHeight * (i+1)- self.marginSize *(i+1) + self.barHeight/1.2})
					.text(function(d){return d[0][1]})
					.attr("fill",function(d,i){return colorByIndex[0].brighter([20])})
					.style("font-size",this.barHeight)
					.attr("text-anchor","middle")
					.style("opacity",0);

					groups.append("line").attr("x1", function(d){ return self.xScale(d[0][1]/d[1][1])}).attr("y1", function(d,i){ return self.windowHelper.section2.bottom - self.barHeight * (i) - self.marginSize *(i+1) + 20}).attr("x2", function(d){ return self.xScale(d[0][1]/d[1][1])}).attr("y2", function(d,i){ return self.windowHelper.section2.bottom - self.barHeight * (i+1) - self.marginSize *(i+1) - 20}).style("stroke-width", 2).style("stroke", "black").style("opacity",0);

					groups.append("rect")
					.attr("height",this.barHeight)
					.attr("y",function(d,i){ return self.windowHelper.section2.bottom - self.barHeight * (i+1)- self.marginSize *(i+1)})
					.attr("width", function(d){
						return self.xScale((d[1][1]-d[1][0])/d[1][1]) - self.radius})
					.attr("x",function(d){
						return self.xScale(d[1][0]/d[1][1])})
					.attr("fill",function(d,i){return colorByIndex[1]})
					.style("opacity",0);
					groups.append("text")
					.attr("x", function(d){
						return self.xScale((d[1][0] +((d[1][1]-d[1][0])/2))/d[1][1])})
					.attr("y", function(d,i){ return self.windowHelper.section2.bottom - self.barHeight * (i+1)- self.marginSize *(i+1) + self.barHeight/1.2})
					.text(function(d){return d[1][1]-d[0][1]})
					.attr("fill",function(d,i){return colorByIndex[1].brighter([20])})
					.style("font-size",this.barHeight)
					.attr("text-anchor","middle")
					.style("opacity",0);


				drawArrow(this.xScale(settings.sample[0][0][1]/settings.sample[0][1][1]), this.xScale(settings.sample[1][0][1]/settings.sample[1][1][1]), this.windowHelper.section2.bottom  - this.barHeight -this.marginSize/2 *3, svg.select(".sampleLines"), "sampDiff", 1, "red");

				//this.drawnSamples.push(settings.stat);
				//var meanLines = svg.select(".sampleLines").selectAll("line").data(this.drawnSamples);
				//meanLines.exit().remove();
				//meanLines.style("opacity",0.5).attr("y2",this.windowHelper.section2.bottom - this.barHeight/2 );
				//meanLines.enter().append("line").attr("x1", this.xScale(settings.stat)).attr("y1", this.windowHelper.section2.bottom).attr("x2", this.xScale(settings.stat)).attr("y2", this.windowHelper.section2.bottom - this.barHeight/2-20).style("stroke-width", 2).style("stroke", "black").style("opacity",0);
			
				this.settings.groups = groups;
				this.settings.meanLines = meanLines;
				this.settings.sampleRect = sampleRect;
			}else{
				var groups = this.settings.groups;
				var meanLines = this.settings.meanLines;
				var sampleRect = this.settings.sampleRect;
							    this.settings.restarting = false;
			}
		/*	if(settings.goSlow){
			sampleRect.selectAll("*").transition().duration(this.transitionSpeed).style("opacity",0.5).each("end", function(d, i){
			//meanLines.transition().duration(this.transitionSpeed).style("opacity",1)
				//if(d == self.drawnSamples[self.drawnSamples.length-1]){
				if(d3.select(this).attr("id") == "0sentinal"){
					if(settings.incDist){
							self.distDrop(settings);
					}else{
						self.animStepper(settings);
					}
				}

					});
			}else{ */
				sampleRect.selectAll("*").style("opacity",0.5).transition().duration(this.transitionSpeed).each("end", function(d,i){
				//meanLines.style("opacity",0.5).transition().duration(this.transitionSpeed)
				if(d3.select(this).attr("id") == "0sentinal"){
				//if(d == self.drawnSamples[self.drawnSamples.length-1]){
					if(settings.incDist){
							self.distDrop(settings);
					}else{
						self.animStepper(settings);
					}
				}

						}
						);

			//}

	}

	this.distDrop = function(settings){

		d3.select(".meanOfSamples").selectAll("g").remove();
		if(this.animationState == 3) return;
			this.animationState = 3;
		if(!this.settings.restarting){
			var sentFinish = false;
			var self = this;
				var middle = this.windowHelper.section2.bottom  - this.barHeight -this.marginSize/2 *3;
			var sampMean = this.samples.slice(settings.indexUpTo, settings.indexUpTo+settings.jumps);
			if(this.transitionSpeed > 200){
				var downTo = this.preCalculatedTStat[settings.indexUpTo].yPerSample[0];
				var redLine = settings.svg.select(".meanOfSamples").selectAll("g").data(sampMean).enter().append("g");
	
				var to = this.xScale(settings.sample[0][0][1]/settings.sample[0][1][1]);
				var from = this.xScale(settings.sample[1][0][1]/settings.sample[1][1][1]);
				if((to-from) != 0){
					var diff = (to-from) / Math.abs(to-from);
				}else{
					var diff = 0;
				}
				var yValue = middle;
				redLine.append("line").attr("x1", function(d){
					return to;
				}).attr("x2", function(d){
					return from;
				}).attr("y1", middle).attr("y2", middle).style("stroke-width", 2).style("stroke", "red").style("opacity",0).attr("id", "redlineMain");
				redLine.append("line").attr("x1", to).attr("x2", to - diff*20).attr("y1", middle).attr("y2", middle + diff*10).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
				redLine.append("line").attr("x1", to).attr("x2", to - diff*20).attr("y1", middle).attr("y2", middle - diff*10).style("stroke-width", 2).style("stroke", "red").style("opacity", 1).attr("class","arrowHead");
			}
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
				d3.select("#redlineMain").style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", downTo).attr("x2", this.xScale2(0)).attr("x1", acrossTo);
				d3.selectAll(".arrowHead").style("opacity",1).transition().duration(this.transitionSpeed*2).attr("y1", downTo).attr("y2", function(d,i){return downTo + Math.pow(-1, i)*self.settings.diff*10 }).attr("x1", acrossTo).attr("x2", acrossTo - self.settings.diff*20);

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
		
	}

		this.animStepper = function(settings){
		if(this.animationState == 4) return;
		this.animationState = 4;
		settings.indexUpTo += settings.jumps;
		this.index += settings.jumps;
		if(settings.indexUpTo >= settings.end || settings.indexUpTo>= this.numSamples){
			mainControl.doneVis();
			this.animationState = 0;
			return;
		}
		this.makeRects(settings);

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
			this.makeRects(this.settings);
		}
		if(this.pauseState == 3){
			this.animationState = 2;
			this.distDrop(this.settings);
		}

				//this.animationState = 0;
		d3.selectAll(".goButton").attr("disabled",null);
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
			if(goSlow){
				delay = 1000;
			}else{
				delay = 10;
			}
			var lastElement = sample[1];
			var sampleTotal = lastElement[0] + lastElement[1];
			//this.xScale.domain([0,total]);
			var pop = this.samples[0];
			var cY = 0;
			var cX = 0;
			var pauseDelay = 1000;
			if(goSlow){
				pauseDelay = 1000;
			}else{
				pauseDelay = 10;
			}

				var randSelection = [];
				for(var i =0; i< sample.length;i++){
					randSelection.push([]);
					for(var k = 0; k< sample[i][1];k++){
						cY = Math.random()*(100-(this.radius*2)) + this.radius;
						cX = Math.random()*(pop[i][1] - (this.radius*2)) + pop[i][0] + this.radius;
						var scale = i;
						randSelection[i].push([cX,cY, scale]);
					}
				}
				var allInSample = randSelection[0].concat(randSelection[1]);
				shuffle(allInSample);
				var g1Circles = svg.select(".g1Circles").selectAll("circle").data(randSelection[0], function(d){return d});
				g1Circles.exit().remove();
				g1Circles.enter().append("circle");
				g1Circles.attr("cx",function(d){return self.xScale(d[0]/self.total)}).attr("cy",function(d){return self.windowHelper.section1.bottom - d[1]}).attr("r",self.radius).style("fill",colorByIndex[0]).attr("fill-opacity",0).attr("stroke-opacity",0);

				var g2Circles = svg.select(".g2Circles").selectAll("circle").data(randSelection[1], function(d){return d});
				g2Circles.exit().remove();
				g2Circles.enter().append("circle");
				g2Circles.attr("cx",function(d){return self.xScale(d[0]/self.total)}).attr("cy",function(d){return self.windowHelper.section1.bottom - d[1]}).attr("r","5").style("fill",colorByIndex[1]).attr("fill-opacity",0).attr("stroke-opacity",0);




			var sampleRect = svg.select(".sampleLines").selectAll("g").data(sample, function(d){return d});
			sampleRect.exit().remove();
			var groups = sampleRect.enter().append("g");
			groups.append("rect")
			.attr("height","100")
			.attr("y",this.windowHelper.section2.bottom - 100)
			.attr("width", function(d){return self.xScale(d[1]/sampleTotal) - self.radius})
			.attr("x",function(d){return self.xScale(d[0]/sampleTotal)})
			.attr("fill",function(d,i){return colorByIndex[i]})
			.style("opacity",0);
			groups.append("text")
			.attr("x", function(d){return self.xScale((d[0] +(d[1]/2))/sampleTotal)})
			.attr("y", this.windowHelper.section2.bottom - this.barHeight)
			.text(function(d){return d[1]})
			.attr("fill",function(d,i){return colorByIndex[i]})
			.style("font-size","32px")
			.attr("text-anchor","middle")
			.style("opacity",0);

			var stat = lastElement[0]/sampleTotal;
			var g1Scale = d3.scale.linear().range([this.radius,this.windowHelper.innerWidth*stat]).domain([0,pop[0][1]/this.total]);
			var g2Scale = d3.scale.linear().range([this.windowHelper.innerWidth*stat,this.windowHelper.innerWidth]).domain([pop[1][0]/this.total,1]);
			var scales = [g1Scale,g2Scale];
			var meanLines = svg.select(".sampleLines").selectAll("line").data(sample);
			meanLines.exit().remove();
			meanLines.enter().append("line");
			meanLines.attr("x1", this.xScale(stat)).attr("y1", this.windowHelper.section2.bottom+20).attr("x2", this.xScale(stat)).attr("y2", this.windowHelper.section2.bottom-20).style("stroke-width", 2).style("stroke", "black").style("opacity",0);

			var meanCircles = svg.select(".meanOfSamples").selectAll("circle").filter(function(d, i){
				return (i>=indexUpTo) && (i <indexUpTo+jumps);
			});

			var sampleSelection = svg.select(".sampleSelection").selectAll("circle");
			if(goSlow){
				sampleSelection = sampleSelection.transition().delay(function(d,i){return delay*2/allInSample.length * allInSample.indexOf(d)}).duration(100).attr("fill-opacity", 1)
				.transition().duration(function(d,i){return delay*2/allInSample.length * (allInSample.length - allInSample.indexOf(d))})
				.transition().duration(pauseDelay)
				.transition().duration(this.transitionSpeed).attr("cy",function(d){return self.windowHelper.section2.bottom - d[1]}).attr("cx",function(d){
					return scales[d[2]](d[0]/self.total)});
			}else{
				sampleSelection = sampleSelection.attr("fill-opacity", 1);
			}

			if(goSlow){
			sampleRect.selectAll("*").transition().duration(this.transitionSpeed).delay(delay*2 + pauseDelay).style("opacity",0.5);
			meanLines.transition().delay(delay*2 + pauseDelay).duration(this.transitionSpeed).style("opacity",0.5);
			}else{
				sampleRect.selectAll("*").style("opacity",0.5);
				meanLines.transition().style("opacity",0.5);
			}

			if(this.transitionSpeed <= 100){
				meanCircles =meanCircles.attr("cy", function(d){return d.yPerSample[0]}).style("fill","red").transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").style("fill","#C7D0D5").each('end', function(d, i){ if(i == 0){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
			}else{
				if(goSlow){
					meanCircles = meanCircles.transition().delay(delay*2 + pauseDelay*2 +  this.transitionSpeed).attr("fill-opacity",(this.transitionSpeed * 0.001)).attr("stroke-opacity",(this.transitionSpeed * 0.001)).style("fill","#FF0000")
					.transition().duration(this.transitionSpeed).attr("fill-opacity",1).attr("stroke-opacity",1).style("stroke", "steelblue").attr("cy", function(d){return d.yPerSample[0]}).style("fill","#C7D0D5").each('end', function(d, i){ if(i == 0){self.stepAnim(indexUpTo+jumps, goUpTo, goSlow, jumps)}});
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
						d3.select(".svg").selectAll("*").transition().duration(20).attr("stop","true");
		this.index = 1;
		this.drawnSamples = [];
		var self = this;
		var svg = d3.select(".svg");
		svg.select(".sampleLines").selectAll("*").remove();
		svg.select(".g1Circles").selectAll("circle").remove();
		svg.select(".g2Circles").selectAll("circle").remove();
		var meanLines = svg.select(".sampleLines").selectAll("line").attr("y1", this.windowHelper.section1.bottom+20).attr("y2", this.windowHelper.section1.bottom-20).attr("x1", function(d){return self.xScale(d.value)}).attr("x2", function(d){return self.xScale(d.value)}).style("stroke-width", 2).style("stroke", "green").style("opacity", 0);

		var meanCircles = svg.select(".meanOfSamples").selectAll("circle")
		    .attr("cx", function(d, i) { 
		    	return d.xPerSample[0]; })
		    .attr("cy", function(d) {
		    	return d.yPerSample[0] - (self.windowHelper.section3.bottom- self.windowHelper.section2.bottom);
		    })
		    .attr("fill-opacity", 0)
		    .attr("stroke-opacity",0); 

		    this.animationState = 0;
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
		this.samples = [];
		this.preCalculatedTStat = [];		
		this.transitionSpeed = 1000;
		this.index = 1;
		this.statsDone = false;

		this.baseTransitionSpeed = 1000;
	}
}