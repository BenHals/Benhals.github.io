function view(controller){

	this.dataScreen = null;
	this.controller = controller;

	this.visPreveiw = function(disp){
		d3.select("#visControls").remove();
		d3.select("#startButton").style("background-color","#094b85");
	}
	this.leaveVis = function(){
		d3.select("#visControls").remove();
	}
	this.makeButtons = function(){
		var vs = d3.select(".controls").append("div").attr("id","visControls");
		vs.append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "controller.startAnimation(1,true)");
		vs.append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "controller.startAnimation(10, false)");
		vs.append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "controller.startAnimation(1000, false)");
		vs.append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "controller.resetScreen()");
		vs.append("input").attr("name", "stop").attr("type", "button").attr("value","stop ").attr("onClick", "controller.stopPressed()");
		vs.append("input").attr("name", "back").attr("type", "button").attr("value","back ").attr("onClick", "controller.backPressed()");
	}
	/*this.twoMeanPressed = function(){
		this.dataScreen = startTwoMeans();
		this.makeButtons();
	}
	this.oneMeanPressed = function(){
		dataScreen = startOneMean();
		makeButtons();
		
	}
	this.oneProportionPressed = function(){
		dataScreen = startOneProportion();
		makeButtons();
		
	}
	this.slopePressed = function(){
		dataScreen = startSlope();
		makeButtons();
		
	}*/
	this.loadMain = function(dataHeadings){
		d3.select(".controls").selectAll("*").remove();
		var importFileB = d3.select(".controls").append("input").attr("name", "importfiles").attr("type", "file").attr("value","import files").attr("id","importButton");
		var label = d3.select(".controls").append("label").attr("for", "importButton").text("Choose a file").attr("class","bluebutton");
		var usePreset = d3.select(".controls").append("input").attr("name", "dataPreset").attr("type", "button").attr("value","Use test data").attr("id","dataPreset").attr("onClick","mainControl.loadTestData()");
		var container = d3.select(".controls").append("div").attr("id","inputContainer").attr("class","selectContainer");
		var focusContainer = d3.select(".controls").append("div").attr("id","focusContainer").attr("class","selectContainer");

		var IB = document.getElementById("importButton");
		IB.onchange = function(e){
			controller.impButPressed(e);
		}
		var selectMenu = d3.select("#inputContainer").append("select").attr("size",dataHeadings.length).attr("multiple","multiple").attr("id","selectMenu");
		var SM = document.getElementById("selectMenu");
		SM.onchange = function(e){
			controller.varSelected(e);
		}

	}
	this.varSelected = function(){
		d3.select("#startButton").attr("disabled", null);
	}
	this.focusSelector = function(headings, curCategory){
		var focusContainer = d3.select("#focusContainer");
		focusContainer.append("label").attr("for","focusController").text("Choose Category to focus on.")
		var focusController = focusContainer.append("select").attr("size",headings.length).attr("id","focusController");
			headings.forEach(function(e){
			focusController.append("option").attr("value",e).text(e);
		});
		var SM = document.getElementById("focusController");
		SM.onchange = function(e){
			controller.focusSelected(e);
		}
	}
	this.destroyFocus = function(){
		d3.select("#focusContainer").selectAll("*").remove();
	}

	this.finishSetUp = function(){
		d3.select("#startButton").style("background-color","green");
		this.makeButtons();
	}
	this.setUpDataVeiw = function(dataHeadings){
		var selectMenu = d3.select("#inputContainer select").attr("size",dataHeadings.length).attr("multiple","multiple");
		selectMenu.selectAll("*").remove();
		dataHeadings.forEach(function(e){
			selectMenu.append("option").attr("value",e).text(e[0]+" ("+e[1]+")");
		});

		d3.select(".controls").append("label").text("Sample Size");
		d3.select(".controls").append("input").attr("type","text").attr("value","20").attr("id","sampsize");

		d3.select(".controls").append("label").text("Statistic");
		d3.select(".controls").append("select").attr("id","statSelect").append("option").text("Select variable");
		var SSize = document.getElementById("sampsize");
		SSize.onchange = function(e){
			controller.startVisPreveiw();
		}
		var SS = document.getElementById("statSelect");
		SS.onchange = function(e){
			controller.statChanged(e);
		}

		d3.select(".controls").append("input").attr("type","button").attr("value","startVis").attr("class","bluebutton").attr("id","startButton").attr("disabled","true").attr("onClick","controller.startVisPressed");
	}
	this.setUpStatSelection = function(category){
		var statSelection = d3.select("#statSelect");
		statSelection.selectAll("*").remove();
		var selectFirst = true;
		category.forEach(function(c){
			var nO = statSelection.append("option").attr("value",c).text(c);
			if(selectFirst){
				nO.attr("selected","selected");
				selectFirst=false;
			}
		});
	}
}