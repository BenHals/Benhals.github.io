function model(controller){
	modelBase.call(this, controller);
	this.testingData ="x,y,BP,BP1,BP2,BP3,BP5,BP7,BP10,BP15,diet\n1,0,101,101,101,101,101,101,101,101,LowFat\n2,0,103.3,103.3,103.3,103.3,103.3,103.3,103.3,103.3,LowFat\n3,1,104.9,105.9,106.9,107.9,109.9,111.9,114.9,119.9,HiFat\n4,0,108,108,108,108,108,108,108,108,LowFat\n5,0,92.6,92.6,92.6,92.6,92.6,92.6,92.6,92.6,LowFat\n6,1,108.4,109.4,110.4,111.4,113.4,115.4,118.4,123.4,HiFat\n7,0,104,104,104,104,104,104,104,104,LowFat\n8,1,112.3,113.3,114.3,115.3,117.3,119.3,122.3,127.3,HiFat\n9,0,96.7,96.7,96.7,96.7,96.7,96.7,96.7,96.7,LowFat\n10,1,105.3,106.3,107.3,108.3,110.3,112.3,115.3,120.3,HiFat\n11,0,101.2,101.2,101.2,101.2,101.2,101.2,101.2,101.2,LowFat\n12,0,120.3,120.3,120.3,120.3,120.3,120.3,120.3,120.3,LowFat\n13,0,108.3,108.3,108.3,108.3,108.3,108.3,108.3,108.3,LowFat\n14,1,103.7,104.7,105.7,106.7,108.7,110.7,113.7,118.7,HiFat\n15,1,107.3,108.3,109.3,110.3,112.3,114.3,117.3,122.3,HiFat\n16,0,102.9,102.9,102.9,102.9,102.9,102.9,102.9,102.9,LowFat\n17,1,118.3,119.3,120.3,121.3,123.3,125.3,128.3,133.3,HiFat\n18,0,114.6,114.6,114.6,114.6,114.6,114.6,114.6,114.6,LowFat\n19,0,105.5,105.5,105.5,105.5,105.5,105.5,105.5,105.5,LowFat\n20,1,119.6,120.6,121.6,122.6,124.6,126.6,129.6,134.6,HiFat\n21,0,109.8,109.8,109.8,109.8,109.8,109.8,109.8,109.8,LowFat\n22,1,99.2,100.2,101.2,102.2,104.2,106.2,109.2,114.2,HiFat\n23,0,109.9,109.9,109.9,109.9,109.9,109.9,109.9,109.9,LowFat\n24,0,109,109,109,109,109,109,109,109,LowFat\n25,1,115,116,117,118,120,122,125,130,HiFat\n26,1,100.1,101.1,102.1,103.1,105.1,107.1,110.1,115.1,HiFat\n27,1,104.7,105.7,106.7,107.7,109.7,111.7,114.7,119.7,HiFat\n28,0,98.2,98.2,98.2,98.2,98.2,98.2,98.2,98.2,LowFat\n29,0,105.9,105.9,105.9,105.9,105.9,105.9,105.9,105.9,LowFat\n30,1,114,115,116,117,119,121,124,129,HiFat";
	this.visualisations = [{name:"oneMean", numeretical:1,categorical:0,stats:0,setupParams:function(num, cat, modelObj){return new oneMean(modelObj.inputData, num[0], modelObj.stats[0][0])}},
		{name:"twoMeans", numeretical:1,categorical:1,stats:0,setupParams:function(num, cat, modelObj){return new twoMeans(modelObj.inputData, cat[0], num[0], modelObj.stats[0][0])}}];
		//{name:"oneProportion", numeretical:0,categorical:1,stats:1,setupParams:function(num, cat, modelObj){var unique = modelObj.dataSplit[cat[0]].filter(onlyUnique); modelObj.controller.makeFocusSelector(unique, cat[0]);return new oneProportion(modelObj.inputData, cat[0], unique[0])}},
		//{name:"twoProportion", numeretical:0,categorical:2,stats:1,setupParams:function(num, cat, modelObj){var unique1 = modelObj.dataSplit[cat[0]].filter(onlyUnique); modelObj.controller.makeFocusSelector(unique1, cat[0]); modelObj.controller.makeVarSelector(cat[0],cat[1]);return new twoProportion(modelObj.inputData, cat[0], cat[1], unique1[0])}},
		//{name:"slope", numeretical:2,categorical:0,stats:2,setupParams:function(num, cat, modelObj){return new slope(modelObj.inputData, num[0], num[1])}}];

}
model.prototype = Object.create(modelBase.prototype);
model.prototype.constructor = model;