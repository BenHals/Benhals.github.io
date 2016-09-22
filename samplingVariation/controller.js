function controller(){
	controllerBase.call(this);
}
controller.prototype = Object.create(controllerBase.prototype);
controller.prototype.constructor = controller;
controller.prototype.startVisFull = function(){
		this.model.destroy();
		var sampleSize = d3.select("#sampsize").property("value");
		this.model.display.setUpPopulation();
		this.model.display.setUpSamples(sampleSize);
		this.model.display.draw();
		this.view.finishSetUp();

	}

var oneMeanButton;
var twoMeanButton;
var dataScreen = null;
var mainControl = null;
window.onload = function(){
	//loadMain();
	//loadData();
	mainControl = new controller();
};