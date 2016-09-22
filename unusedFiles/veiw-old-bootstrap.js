function view(controller){

	this.dataScreen = null;
	this.controller = controller;
	this.windowHelper = setUpWindow(5);
	d3.select("#module").text("module: Bootstrapping"+"; ");
	d3.select("#banner").text("Bootstrapping");

	this.visPreveiw = function(disp){
		d3.select("#visControls").remove();
		//d3.select("#startButton").style("background-color","#094b85");
	}
	this.leaveVis = function(){
		d3.select("#visControls1").remove();
		d3.select("#visControls2").remove();
	}
	this.setUpTab2 = function(){
		var tab2Top = d3.select("#tab2Top");
		tab2Top.selectAll("*").remove();
		tab2Top.append("input").attr("type","button").attr("value","< Back to Data Input").attr("class","bluebutton").attr("id","backTab2").attr("disabled",null).attr("onClick","mainControl.switchTab1()")
			.style("height","15%");
		//tab2Top.append("label").text("Sample Size");
		//tab2Top.append("input").attr("type","text").attr("value","20").attr("id","sampsize");

		tab2Top.append("label").text("Statistic");
		tab2Top.append("select").attr("id","statSelect").append("option").text("Select variable");
		var SSize = document.getElementById("sampsize");
		//SSize.onchange = function(e){
		//	controller.startVisPreveiw();
		//}
		var SS = document.getElementById("statSelect");
		SS.onchange = function(e){
			controller.statChanged(e);
		}
		tab2Top.append("input").attr("type","button").attr("value","Precalculate Display").classed("bluebutton", true).attr("id","Calculate").attr("disabled",null).attr("onClick","mainControl.startVisPressed()")
			.style("height","15%");
		//tab2Top.append("input").attr("type","button").attr("value","Pause").classed("bluebutton", true).attr("id","Pause").attr("disabled",true).attr("onClick","mainControl.pause()")
		//	.style("height","15%");
	}
	this.tSDisable = function(){
		d3.select("#cBoxLabel").classed("disabled", true);
		d3.select("#trackCBox").attr("disabled",true);
	}
	this.tSUnDisable = function(){
		d3.select("#cBoxLabel").classed("disabled", null);
		d3.select("#trackCBox").attr("disabled",null);
	}
	this.makeButtons = function(){
		d3.select("#stopButton").remove();
		d3.select("#tab2Top").append("input").attr("type","button").attr("value","Stop").classed("bluebutton", true).attr("id","stopButton").attr("disabled",null).attr("onClick","mainControl.stopPressed()")
			.style("height","15%");
		var tab2 = d3.select("#tab2");
		var vs = tab2.select("#tab2Mid").append("div").attr("id","visControls1");
		vs.append("label").text("Re-Sampling");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","1").attr("id","sampOne").attr("class","repSelect").attr("checked",true).text("1").attr("onClick","mainControl.view.tSUnDisable()");
		vs.append("label").attr("for","sampOne").attr("class","repLabel").text("1");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","5").attr("id","sampFive").attr("class","repSelect").text("5").attr("onClick","mainControl.view.tSDisable()");
		vs.append("label").attr("for","sampFive").attr("class","repLabel").text("5");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","20").attr("id","sampTwenty").attr("class","repSelect").text("20").attr("onClick","mainControl.view.tSDisable()");
		vs.append("label").attr("for","sampTwenty").attr("class","repLabel").text("20");
		vs.append("input").attr("type","radio").attr("name","Sampling").attr("value","1000").attr("id","sampThousand").attr("class","repSelect").text("1000").attr("onClick","mainControl.view.tSDisable()");
		vs.append("label").attr("for","sampThousand").attr("class","repLabel").text("1000");
		vs.append("label").attr("for","trackCBox").attr("id","cBoxLabel").text("Track sample").classed("disabled",null);
		vs.append("input").attr("type", "checkbox").attr("id","trackCBox").attr("value","trackCBox").attr("disabled",null);

		vs.append("input").attr("type","button").attr("value","Go").attr("class","bluebutton").classed("goButton",true).attr("id","startSampling").attr("disabled",null).attr("onClick","mainControl.startSampling(false)")
			.style("height","15%");

		vs = tab2.select("#tab2Bot").append("div").attr("id","visControls2");
		vs.append("label").text("Bootstrap Distribution");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","1").attr("id","distOne").attr("class","repSelect").attr("checked",true).text("1");
		vs.append("label").attr("for","distOne").attr("class","repLabel").text("1");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","5").attr("id","distFive").attr("class","repSelect").text("5");
		vs.append("label").attr("for","distFive").attr("class","repLabel").text("5");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","20").attr("id","distTwenty").attr("class","repSelect").text("20");
		vs.append("label").attr("for","distTwenty").attr("class","repLabel").text("20");
		vs.append("input").attr("type","radio").attr("name","Dist").attr("value","1000").attr("id","distThousand").attr("class","repSelect").text("1000");
		vs.append("label").attr("for","distThousand").attr("class","repLabel").text("1000");
		vs.append("input").attr("type","button").attr("value","Go").attr("class","bluebutton").classed("goButton",true).attr("id","distSampling").attr("disabled",null).attr("onClick","mainControl.startSampling(true)")
			.style("height","15%");
		tab2.select("#tab2Bot").append("input").attr("type","button").attr("value","Show CI").attr("class","bluebutton").classed("CIButton",true).attr("id","CIButton").attr("disabled",true).attr("onClick","mainControl.showCI()")
			.style("height","15%");
		tab2.select("#tab2Bot").append("input").attr("type","button").attr("value","Show CI for 10,000").attr("class","bluebutton").classed("CIButton",true).attr("id","CIButtonTenK").attr("disabled",true).attr("onClick","mainControl.showCITenk()")
			.style("height","15%");
		tab2.select("#tab2Bot").append("input").attr("type","button").attr("value","Fade On/Off").attr("class","bluebutton").classed("fadeButton",true).attr("id","fadeButton").attr("disabled",null).attr("onClick","mainControl.fadeToggle()")
			.style("height","15%");
		/*
		vs.append("input").attr("name", "do1").attr("type", "button").attr("value","1 sample").attr("onClick", "mainControl.startAnimation(1,true)");
		vs.append("input").attr("name", "do10").attr("type", "button").attr("value","10 samples").attr("onClick", "mainControl.startAnimation(10, false)");
		vs.append("input").attr("name", "do1000").attr("type", "button").attr("value","1000 samples").attr("onClick", "mainControl.startAnimation(1000, false)");
		vs.append("input").attr("name", "resetLines").attr("type", "button").attr("value","reset lines ").attr("onClick", "mainControl.resetScreen()");
		vs.append("input").attr("name", "stop").attr("type", "button").attr("value","stop ").attr("onClick", "mainControl.stopPressed()"); */
		//vs.append("input").attr("name", "back").attr("type", "button").attr("value","back ").attr("onClick", "mainControl.backPressed()");
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
		showHelp();
		d3.select(".controls").selectAll("*").remove();
		var tab1 = d3.select(".controls").append("div").attr("id","tab1").attr("class","tab");
		var tab2 = d3.select(".controls").append("div").attr("id","tab2").attr("class","tab");
		tab1.style("display","block");
		tab2.append("div").attr("class","tab2Divider").attr("id","tab2Top");
		tab2.append("div").attr("class","tab2Divider").attr("id","tab2Mid");
		tab2.append("div").attr("class","tab2Divider").attr("id","tab2Bot");
		var backToMain = tab1.append("a").attr("name", "backToMain").attr("class","bluebutton").attr("value","mainButton").attr("id","mainButton").attr("href","../index.html").text("< Back To Main Menu");

		var importFileB = tab1.append("input").attr("name", "importfiles").attr("type", "file").attr("value","import files").attr("id","importButton");
		var label = tab1.append("label").attr("for", "importButton").text("Choose a Local file").attr("class","bluebutton");

		//var importFromURL = tab1.append("input").attr("name", "importURL").attr("type", "button").attr("value","Data from URL").attr("id","importURL").attr("class","bluebutton").attr("onClick","mainControl.loadFromURL()");
		//var URLInput = tab1.append("input").attr("name", "URLInput").attr("type", "text").attr("placeholder","import data from...").attr("id","URLInput");

		var textInput = tab1.append("textarea").attr("name", "textInput").attr("type", "text").attr("placeholder","paste csv data here...").attr("id","textInput");
		var importFromText = tab1.append("input").attr("name", "importText").attr("type", "button").attr("value","Data from Text").attr("id","importText").attr("class","bluebutton").attr("disabled", "true");

		var usePreset = tab1.append("input").attr("class","bluebutton").attr("name", "dataPreset").attr("type", "button").attr("value","Use test data").attr("id","dataPreset").attr("onClick","mainControl.loadTestData()");
		var container = tab1.append("div").attr("id","inputContainer").attr("class","selectContainer");
		var focusContainer = tab1.append("div").attr("id","focusContainer").attr("class","selectContainer");
		var vSelectContainer = tab1.append("div").attr("id","vSelectContainer").attr("class","selectContainer");
		var IB = document.getElementById("importButton");
		IB.onchange = function(e){
			controller.impButPressed(e);
		}
		var selectMenu = d3.select("#inputContainer").append("select").attr("size",dataHeadings.length).attr("multiple","multiple").attr("id","selectMenu");
		var SM = document.getElementById("selectMenu");
		SM.onchange = function(e){
			controller.varSelected(e);
		}
		// var urlButton = document.getElementById("importURL");
		// urlButton.onchange = function(e){
		// 	controller.loadFromURL(document.getElementById("URLInput").value);
		// }
		// $("#importURL").click(function(){
		// 	controller.loadFromURL($("#URLInput").val());
		// })
		$("#importText").click(function(){
			var data = $("#textInput").val();
			controller.loadFromText(data);
		})
		$("#textInput").on('change keyup paste', function() {
			if(!$.trim($("#textInput").val())){
    			$("#importText").prop("disabled", true);
			}else{
				$("#importText").prop("disabled", false);
			}
		});

	}
	this.noVisAvail = function(){
		var svg = d3.select(".svg");

		svg.append("text")
			.attr("x", this.windowHelper.width/2)
			.attr("y", this.windowHelper.height/2)
			.text("No Visualisation Availiable")
			.attr("fill","grey")
			.style("font-size", this.windowHelper.height/20+"px")
			.attr("text-anchor","middle").style("opacity",0.6);
	}
	this.varSelected = function(e){
		d3.select("#helpBox").remove();
		d3.select("#startButton").attr("disabled", null);
		var vars = "";
		for(var i = 0; i<e.length;i++){
			vars = vars + " " +e[i].value;
		}
		d3.select("#variable").text("variable: " + vars+"; ");
	}
	this.focusSelector = function(headings, curCategory){
		headings.sort();
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
	this.makeVarSelector = function(cat1,cat2){
		var vSelectContainer = d3.select("#vSelectContainer");
		vSelectContainer.append("label").attr("for","vSelectContainer").text("Choose variable to split on.")
		var vSelectController = vSelectContainer.append("select").attr("size",2).attr("id","vSelectController");
		vSelectController.append("option").attr("value",cat1).text(cat1);
		vSelectController.append("option").attr("value",cat2).text(cat2);

		var SM = document.getElementById("vSelectController");
		SM.onchange = function(e){
			controller.varChanged(e);
		}
	}
	this.destroyFocus = function(){
		d3.select("#focusContainer").selectAll("*").remove();
	}
	this.destroyVSelect = function(){
		d3.select("#vSelectContainer").selectAll("*").remove();
	}

	this.finishSetUp = function(){
		//d3.select("#startButton").style("background-color","green");
		this.makeButtons();
		//var tab1 = d3.select("#tab1");
		//tab1.style("display","none");
	}
	this.setUpDataVeiw = function(dataHeadings){
		d3.select("#file").text("file: " + mainControl.model.fileName +"; ");
		var selectMenu = d3.select("#inputContainer select").attr("size",dataHeadings.length).attr("multiple","multiple");
		selectMenu.selectAll("*").remove();
		dataHeadings.forEach(function(e){
			selectMenu.append("option").attr("value",e).text(e[0]+" ("+e[1]+")");
		});

		d3.select("#startButton").remove();
		d3.select("#tab1").append("input").attr("type","button").attr("value","Analyse").attr("class","bluebutton").attr("id","startButton").attr("disabled","true").attr("onClick","mainControl.switchTab2()");
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
	this.unPause = function(incDist){
		if(incDist){
			var tab = d3.select("#visControls2");
		}else{
			var tab = d3.select("#visControls1");
		}
		tab.select(".goButton").attr("disabled",null);
	}
	this.startedVis = function(incDist){
		d3.selectAll(".goButton").attr("disabled","true");
		d3.select("#pauseButton").remove();
		if(incDist){
			var tab = d3.select("#visControls2");
		}else{
			var tab = d3.select("#visControls1");
		}
		tab.select(".goButton").style("display","none");
		tab.append("input").attr("type","button").attr("value","Pause").classed("bluebutton", true).attr("id","pauseButton").attr("disabled",null).attr("onClick","mainControl.pause()").style("height","15%");
	}
	this.doneVis = function(){
		d3.select("#pauseButton").remove();
		d3.selectAll(".goButton").attr("disabled",null).style("display","block");
	}
	this.fadeOn = function(){
		d3.select(".svg").append("rect").attr("id","fadeBox").attr("x",this.windowHelper.sampleSection-5).attr("y",this.windowHelper.section1.bottom + this.windowHelper.section1.height/10).attr("width", this.windowHelper.width).attr("height",this.windowHelper.height).style("opacity",0.8).style("fill","#F5F5F5");
	}
	this.fadeOff = function(){
		d3.select("#fadeBox").remove();
	}
}