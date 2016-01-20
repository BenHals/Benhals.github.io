

function controller(){
	this.view = new view(this);
	this.model = new model(this);
	this.model.loadData();
	this.view.loadMain(this.model.dataHeadings);
	this.paused = false;
	this.going = false;
	this.startAnimation = function(numReps, goSlow, incDist){
		this.model.display.startAnim(numReps, goSlow, incDist);
	}
	this.resetScreen = function(){
		this.model.display.resetLines();
	}
	this.startVisFull = function(){
		this.model.destroy();
		var sampleSize = d3.select("#sampsize").property("value");
		this.model.display.setUpPopulation();
		this.model.display.setUpSamples(sampleSize);
		this.model.display.draw();
		this.view.finishSetUp();
	}
	this.startVisPreveiw = function(){
		d3.select("#Calculate").attr("disabled", null);
		d3.select("#tab2Mid").selectAll("*").remove();
		d3.select("#tab2Bot").selectAll("*").remove();
		this.view.visPreveiw();
		this.model.display.setUpPopulation();
		this.model.display.drawPop();
	}
	this.impButPressed = function(e){
		this.model.getFile(e);
	}
	this.loadTestData = function(){
		this.model.loadPresetData();
	}
	this.varSelected = function(e){
		this.view.destroyFocus();
		this.model.varSelected(e.target.selectedOptions);
		this.view.varSelected();
	}
	this.focusSelected = function(e){
		var changeTo = e.target.value;
		this.model.destroy();
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
	this.switchTab2 = function(){
		d3.select("#tab1").style("display","none");
		d3.select("#tab2").style("display","block");
		this.view.setUpTab2();
		if(this.model.display.sampleSize != 20){
			d3.select("#sampsize").attr("value",String(this.model.display.sampleSize));
		}
		this.setUpStatSelection(this.model.stats[this.model.currentCategory])
	}
	this.switchTab1 = function(){
		d3.select("#tab1").style("display","block");
		d3.select("#tab2").style("display","none");
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
			this.model.display.unPause();
			d3.select("#pauseButton").attr("value","Pause");
			this.paused = false;
		}
	}
	this.doneVis = function(){
		this.view.doneVis();
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