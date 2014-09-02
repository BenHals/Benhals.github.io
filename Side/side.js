$(document).ready(function(){
var xval = 50;
	$(document).bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta >= 0){
			xval += 10;
			$('#page').css("left", xval + "px");
			$('#wheel').css("-webkit-transform", "rotateZ(" + xval +"deg)");
			//alert("up")
		}else{
			xval -= 10;
			$('#page').css("left", xval + "px");
			$('#wheel').css("-webkit-transform", "rotateZ(" + xval +"deg)");
			//alert("down");
		}
		
	});
});