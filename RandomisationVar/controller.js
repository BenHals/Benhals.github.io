function controller(){
	controllerBase.call(this);
}
controller.prototype = Object.create(controllerBase.prototype);
controller.prototype.constructor = controller;
var oneMeanButton;
var twoMeanButton;
var dataScreen = null;
var mainControl = null;
window.onload = function(){
	//loadMain();
	//loadData();
	mainControl = new controller();
};