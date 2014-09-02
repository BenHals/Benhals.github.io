swid = 1000;
sheig = 1000;
 i = 0;
function draw(){
	
	var x1 = 0;
	var y1 = sheig/2;
	 var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	 ctx.canvas.width = 500;
	ctx.canvas.height = 500;
	 ctx.clearRect ( 0 , 0 , swid , sheig );
	 
	ctx.translate(245,245);
	ctx.fillRect(0,0,10,10);
	ctx.rotate((i/360)*(2*Math.PI));
	i++;
	ctx.fillRect(0,100,10,10);
	
}

$(document).ready(function(){
	swid = $(window).width();
	sheig = $(window).height();
	setInterval(function(){draw();}, 100);

});