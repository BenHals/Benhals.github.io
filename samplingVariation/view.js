function view(controller){
	viewBase.call(this, "sv", controller);
}
view.prototype = Object.create(viewBase.prototype);
view.prototype.constructor = view;

view.prototype.setUpTab2 = function(){
		var tab2Top = d3.select("#tab2Top");
		tab2Top.selectAll("*").remove();
		tab2Top.append("input").attr("type","button").attr("value","< Back to Data Input").attr("class","bluebutton").attr("id","backTab2").attr("disabled",null).attr("onClick","mainControl.switchTab1()")
			.style("height","15%");
		tab2Top.append("label").text("Sample Size");
		tab2Top.append("input").attr("type","text").attr("value","20").attr("id","sampsize");

		tab2Top.append("label").text("Statistic");
		tab2Top.append("select").attr("id","statSelect").append("option").text("Select variable");
		var SSize = document.getElementById("sampsize");
		SSize.onchange = function(e){
			controller.startVisPreveiw();
		}
		var SS = document.getElementById("statSelect");
		SS.onchange = function(e){
			controller.statChanged(e);
		}
		tab2Top.append("input").attr("type","button").attr("value","Precalculate Display").classed("bluebutton", true).attr("id","Calculate").attr("disabled",null).attr("onClick","mainControl.startVisPressed()")
			.style("height","15%");
		//tab2Top.append("input").attr("type","button").attr("value","Pause").classed("bluebutton", true).attr("id","Pause").attr("disabled",true).attr("onClick","mainControl.pause()")
		//	.style("height","15%");
	}