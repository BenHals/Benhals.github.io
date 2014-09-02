earthRadius = 300;
function setPosition(x, y){
	$("#solarsystem").css("left", x);
	$("#solarsystem").css("top", y);


};

$(document).ready(function(){
var mouseY;
var mouseX;
$(document).mousemove(function(e){
	mouseY = e.pageY-300;
	mouseX = e.pageX-300;
	setPosition(mouseX, mouseY);
});

});