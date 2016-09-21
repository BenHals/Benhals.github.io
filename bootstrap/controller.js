

function controller(){
	this.view = new view(this);
	this.model = new model(this);
	this.model.loadData();
	this.view.loadMain(this.model.dataHeadings);
	this.paused = false;
	this.going = false;
	this.fadeOn = false;
	this.startAnimation = function(numReps, goSlow, incDist){
		this.model.display.startAnim(numReps, goSlow, incDist);
	}
	this.resetScreen = function(){
		this.model.display.resetLines();
	}
	this.startVisFull = function(){
		this.model.destroy();
		//var sampleSize = d3.select("#sampsize").property("value");
		var sampleSize = this.model.inputData.length;
		this.view.finishSetUp();
		this.model.display.setUpPopulation();
		this.model.display.setUpSamples(sampleSize);
		this.model.display.draw();


	}
	this.notImplemented = function(){

	}
	this.loadFromText = function(text){
		this.model.loadFromText(text);
	}
	this.startVisPreveiw = function(){
		d3.select("#Calculate").attr("disabled", null);
		d3.select("#tab2Mid").selectAll("*").remove();
		d3.select("#tab2Bot").selectAll("*").remove();
		this.view.visPreveiw();
		this.model.display.setUpPopulation();
		this.model.display.drawPop();

		if(this.model.display.implemented == false){
			d3.select("#Calculate").attr("value","Visualisation not implemented").attr("disabled",true);
		}
	}
	this.impButPressed = function(e){
		this.view.destroyFocus();
		this.view.destroyVSelect();
		this.model.getFile(e);
	}
	this.loadTestData = function(){
		this.view.destroyFocus();
		this.view.destroyVSelect();
		this.model.loadPresetData();
	}
	this.varSelected = function(e){
		d3.select(".svg").selectAll("text").remove();
		this.view.destroyFocus();
		this.view.destroyVSelect();
		this.model.varSelected(e.target.selectedOptions);
		this.view.varSelected(e.target.selectedOptions);
	}
	this.noVisAvail = function(){
		this.view.noVisAvail();
	}
	this.focusSelected = function(e){
		var changeTo = e.target.value;
		//this.model.destroy();
		this.model.switchFocus(changeTo);
		this.startVisPreveiw();
	}
	this.backPressed = function(){
		this.model.destroy();
		this.view.leaveVis();
	}
	this.stopPressed = function(){
		this.model.display.stop();
		this.view.doneVis();
		this.paused = false;
	}
	this.statChanged = function(e){
		this.model.display.changeStat(e.target.value);
		this.startVisPreveiw();
	}
	this.startVisPressed = function(){
		//this.view.finishSetUp();
		this.startVisFull();
		d3.select("#Calculate").attr("disabled", true);
		d3.select("#Pause").attr("disabled", null);
	}
	this.setUpDataVeiw = function(csv){
		var self = this;
		this.model.setUpDataVeiw(csv, function(h){self.view.setUpDataVeiw(h)});
		
	}
	this.setUpStatSelection = function(category){
		this.view.setUpStatSelection(category);
	}
	this.makeFocusSelector = function(unique, cat){
		this.view.focusSelector(unique, cat);
	}
	this.makeVarSelector = function(cat1,cat2){
		this.view.makeVarSelector(cat1,cat2);
	}
	this.varChanged = function(e){
		var changeTo = e.target.value;
		this.view.destroyFocus();
		this.model.switchVar(changeTo);
		this.startVisPreveiw();
	}
	this.switchTab2 = function(){
		d3.select("#tab1").style("display","none");
		d3.select("#tab2").style("display","block");
		this.view.setUpTab2();
		if(this.model.display.sampleSize != 20){
			d3.select("#sampsize").attr("value",String(this.model.display.sampleSize));
		}
		this.setUpStatSelection(this.model.stats[this.model.currentCategory])
		if(this.model.display.implemented == false){
			d3.select("#Calculate").attr("value","Visualisation not implemented").attr("disabled",true);
		}
	}
	this.switchTab1 = function(){
		d3.select("#tab1").style("display","block");
		d3.select("#tab2").style("display","none");
		this.view.leaveVis();
		//this.view.makeButtons();
		//this.setUpStatSelection(this.model.stats[this.model.currentCategory])
	}
	this.startSampling = function(incDist){
		var name = "Sampling";
		if(incDist) name = "Dist";
		var radios = document.getElementsByName(name);
		var numRepitions = 0;
		for(var i =0; i<radios.length;i++){
			if(radios[i].checked){
				numRepitions = parseInt(radios[i].value,10);
				break;
			}
		}
		var goSlow = false;
		if(numRepitions < 10 && !(incDist && numRepitions == 5)){
			goSlow = true;
		}
		this.going = true;
		this.view.startedVis(incDist);
		this.startAnimation(numRepitions, goSlow, incDist);
	}
	this.pause = function(){
		if(!this.paused){
			this.model.display.pause();
			d3.select("#pauseButton").attr("value","Restart");
			this.paused = true;
		}else{
			if(this.model.display.pauseCalled) return;
			this.model.display.unPause();
			this.view.unPause(this.model.display.incDist);
			d3.select("#pauseButton").attr("value","Pause");
			this.paused = false;
		}
	}
	this.doneVis = function(){
		this.view.doneVis();
	}
	this.showCI = function(){
		this.model.display.showCI("1");
	}
	this.showCITenk = function(){
		this.model.display.showCI("10");
	}
	this.fadeToggle = function(){
		if(!this.fadeOn){
			this.view.fadeOn();
			this.fadeOn = true;
		}else{
			this.view.fadeOff();
			this.fadeOn = false;
		}
	}
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