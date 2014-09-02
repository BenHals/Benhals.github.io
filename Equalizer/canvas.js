swid = 1000;
sheig = 1000;
blueval = 0;
targetblueval = 0;

function draw(xl){
 var canvas = document.getElementById('canvas');
 var ctx = canvas.getContext('2d');
 var width = 50;
 ctx.canvas.width = swid;
 ctx.canvas.height = sheig;
 ctx.clearRect ( 0 , 0 , swid , sheig );
  if (blueval == targetblueval){
	targetblueval = Math.floor(Math.random()*255+1);
 }
 if (blueval < targetblueval){
	blueval++;
 }
 if (blueval > targetblueval){
	blueval--;
 }

 for(var j=0;j<(xl/width);j++){
		for( var i =0; i<Math.floor(Math.random()*(sheig/width)+1);i++){
		ctx.fillStyle = "rgb("+Math.floor(255/(sheig/width))*i+","+Math.floor(255/(swid/width))*j+"," + blueval+")";
		ctx.fillRect(width*j,width*i,width,width);
		};
	};
}

$(document).ready(function(){
var xlim;
	swid = $(window).width();
	sheig = $(window).height();
$(window).resize(function(){
	swid = $(window).width();
	sheig = $(window).height();
	
});
$("canvas").mousemove(function(e){
	 xlim = e.pageX;
	
});

setInterval(function(){draw(xlim);}, 100);
});