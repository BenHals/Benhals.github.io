var oneMeanButton;
var twoMeanButton;
var dataScreen = null;
window.onload = function(){
	loadMain();
	loadData();
};
function twoMeanPressed(){
	dataScreen = startTwoMeans();
	makeButtons();
}
function visPreveiw(disp){
	d3.select("#visControls").remove();
	d3.select("#startButton").style("background-color","#094b85");
	dataScreen = disp;
	dataScreen.setUpPopulation();
	dataScreen.drawPop();
}
function leaveVis(){
	dataScreen.destroy();
	d3.select("#visControls").remove();
}
function makeButtons(){
	dataScreen.destroy();
	var vs = d3.select(".controls").append("div").attr("id","visControls");
	vs.append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "dataScreen.startAnim(1,true)");
	vs.append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "dataScreen.startAnim(10, false)");
	vs.append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "dataScreen.startAnim(1000, false)");
	vs.append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "dataScreen.resetLines()");
	vs.append("input").attr("name", "stop").attr("type", "button").attr("value","stop ").attr("onClick", "dataScreen.stop()");
	vs.append("input").attr("name", "back").attr("type", "button").attr("value","back ").attr("onClick", "leaveVis()");

	//oneMeanButton.remove();
	//twoMeanButton.remove();
	//oneProportionButton.remove();
	var sSize = d3.select("#sampsize").property("value");
	dataScreen.setUpPopulation();
	dataScreen.setUpSamples(sSize);
	dataScreen.draw();
}
function oneMeanPressed(){
	dataScreen = startOneMean();
	makeButtons();
	
}
function oneProportionPressed(){
	dataScreen = startOneProportion();
	makeButtons();
	
}
function slopePressed(){
	dataScreen = startSlope();
	makeButtons();
	
}
function loadMain(){
	dataScreen = null;
	d3.select(".controls").selectAll("*").remove();
	var importFileB = d3.select(".controls").append("input").attr("name", "importfiles").attr("type", "file").attr("value","import files").attr("id","importButton");
	var label = d3.select(".controls").append("label").attr("for", "importButton").text("Choose a file").attr("class","bluebutton");
	var usePreset = d3.select(".controls").append("input").attr("name", "dataPreset").attr("type", "button").attr("value","Use test data").attr("id","dataPreset").attr("onClick","loadPresetData()");
	var container = d3.select(".controls").append("div").attr("id","inputContainer").attr("class","selectContainer");
	var focusContainer = d3.select(".controls").append("div").attr("id","focusContainer").attr("class","selectContainer");



	var IB = document.getElementById("importButton");
	IB.onchange = function(e){
		getFile(e);
	}
	var selectMenu = d3.select("#inputContainer").append("select").attr("size",dataHeadings.length).attr("multiple","multiple").attr("id","selectMenu");
	var SM = document.getElementById("selectMenu");
	SM.onchange = function(e){
		destroyFocus();
		varSelected(e.target.selectedOptions);
	}
	//oneMeanButton = d3.select(".controls").append("input").attr("name", "oneMean").attr("type", "button").attr("value","Calculate one mean").attr("onClick", "oneMeanPressed()");
	//twoMeanButton = d3.select(".controls").append("input").attr("name", "twoMean").attr("type", "button").attr("value","Calculate two mean").attr("onClick", "twoMeanPressed()");
	//oneProportionButton = d3.select(".controls").append("input").attr("name", "oneProportion").attr("type", "button").attr("value","Calculate one Proportion").attr("onClick", "oneProportionPressed()");
	//slopeButton = d3.select(".controls").append("input").attr("name", "slope").attr("type", "button").attr("value","Calculate slope").attr("onClick", "slopePressed()");

}
function focusSelector(headings, curCategory){
	var focusContainer = d3.select("#focusContainer");
	focusContainer.append("label").attr("for","focusController").text("Choose Category to focus on.")
	var focusController = focusContainer.append("select").attr("size",headings.length).attr("id","focusController");
		headings.forEach(function(e){
		focusController.append("option").attr("value",e).text(e);
	});
	var SM = document.getElementById("focusController");
	SM.onchange = function(e){
		var changeTo = e.target.value;
		dataScreen.destroy();
		dataScreen = startOneProportion(curCategory, changeTo);
		visPreveiw(dataScreen);
	}
}
function destroyFocus(){
	d3.select("#focusContainer").selectAll("*").remove();
}

function finishSetUp(){
	d3.select("#startButton").style("background-color","green");
	makeButtons();
}