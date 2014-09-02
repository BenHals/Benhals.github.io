
function changeColor(){

	$("li").each(function(){
		$(this).children("a").css("background", "#" +Math.floor(Math.random()*16777215).toString(16));
	});
	$("body").css("background", "#" +Math.floor((Math.random()*3618615)+13158600 ).toString(16));
}


$(document).ready(function(){
changeColor();
	$("li").mouseenter(function() {
		
	});
	setInterval(function() {changeColor();}, 10000);


});