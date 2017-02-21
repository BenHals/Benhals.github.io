
function changeColor(){

	$("li").each(function(){
		var randColor = Math.floor(Math.random()*16777215).toString(16);
		//$(this).children().css("background", "#" + randColor);
		$(this).children().children().css("background", "#" +randColor)
	});
	$("body").css("background", "#" +Math.floor((Math.random()*3618615) ).toString(16));
}


$(document).ready(function(){
changeColor();
	$("li").mouseenter(function() {
		
	});
	setInterval(function() {changeColor();}, 5000);


});