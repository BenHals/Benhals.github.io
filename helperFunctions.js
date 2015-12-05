function setUpWindow(radius){
	var windowHelper = new Object();
	windowHelper.width = window.innerWidth*0.8;
	windowHelper.height = window.innerHeight*0.99;
	windowHelper.innerWidth = windowHelper.width - radius*2;
	windowHelper.margin = windowHelper.height/10;
	windowHelper.section1 = new Object();
	windowHelper.section2 = new Object();
	windowHelper.section3 = new Object();

	windowHelper.section1.height = windowHelper.height/3 - radius*2;
	windowHelper.section2.height = windowHelper.height/6 - radius*2;
	windowHelper.section3.height = windowHelper.height/2 - radius*4;

	windowHelper.section1.top = 0 + radius;
	windowHelper.section1.bottom = windowHelper.section1.top + windowHelper.section1.height;

	windowHelper.section2.top = windowHelper.section1.bottom + radius;
	windowHelper.section2.bottom = windowHelper.section2.top + windowHelper.section2.height;

	windowHelper.section3.top = windowHelper.section2.bottom + radius;
	windowHelper.section3.bottom = windowHelper.section3.top + windowHelper.section3.height;

	return windowHelper;
}

function heapYValues3(itemsToHeap, xScale, radius, sampleIndex, areaTopY, areaBottomY){
	var section = radius * 0.8;
	var buckets = {};
	var maxY = 0;
	for(var i = 0; i < itemsToHeap.length;i++){
		var thisItem = itemsToHeap[i];
		thisItem.xPerSample[sampleIndex] = xScale(thisItem.value);
		thisItem.yPerSample[sampleIndex] = 0;

		var nearest = Math.round(thisItem.xPerSample[sampleIndex] / section)*section;
		if(!(nearest in buckets)){
			buckets[nearest] = [];
		}
		thisItem.yPerSample[sampleIndex] = radius * buckets[nearest].length;
		buckets[nearest].push(thisItem);
		if(thisItem.yPerSample[sampleIndex] > maxY){
			maxY = thisItem.yPerSample[sampleIndex];
		}
	}
	yScale = d3.scale.linear().range([areaBottomY,Math.max(areaBottomY - maxY,areaTopY+radius*2)]);
	yScale.domain([0,maxY]);
	for(var l = 0; l<itemsToHeap.length;l++){
		itemsToHeap[l].yPerSample[sampleIndex] = yScale(itemsToHeap[l].yPerSample[sampleIndex]);
	}
}

function getStatistic(stat, items){
	if(stat =="mean"){
		var mean = 0;
		for(var i =0;i<items.length;i++){
			mean += items[i].value;
		}
		if(isNaN(mean)){
			alert("wat");
		}
		return mean/items.length;
	}
}

function item(value, id){
this.value = value;
this.id = id;
this.level = 1;
this.xPerSample = {};
this.yPerSample = {};
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function pickRand(numToPick, numFrom){
var indexs = [];
while(indexs.length < numToPick){
	var randomNumber = Math.ceil(Math.random()*numFrom) - 1;
	var found = false;
	for(var i =0;i<indexs.length;i++){
		if(indexs[i] == randomNumber){
			found = true;
			break;
		}
	}
	if(!found){
		indexs.push(randomNumber);
	}
}
return indexs;
}

function findMean(numbers){
var total = 0;
for(var i = 0;i<numbers.length;i++){
	total += numbers[i];
}
return total/numbers.length;
}
function findMeanItems(numbers){
var total = 0;
for(var i = 0;i<numbers.length;i++){
	total += numbers[i].value;
}
return total/numbers.length;
}

function makeSamples(population, numSamples, sampleSize){
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

var colorByIndex = ["blue","red"];
