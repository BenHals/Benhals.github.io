

$(document).ready(function(){
	document.oncontextmenu = function() {return false;};
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	var swid = $(window).width();
	var sheig = $(window).height();
	 ctx.canvas.width = swid;
	ctx.canvas.height = sheig;
	
	var mx = 0;
	var my= 0;
	var x = swid/2;
	var y = sheig/2;
	var dx = 0;
	var dy = 0;
	var vx = 0;
	var vy = 0;
	var theta = 0;
	var Ox = 0;
	var Oy = 0;
	var T = 0;
	var acceleration;
$(window).resize(function(){
	swid = $(window).width();
	sheig = $(window).height();

});


  
$(document).mousemove(function(e){
	mx = e.pageX;
	my = e.pageY;
});


	
	
	function update(){
	dx = mx - x;
	dy = my - y;
	
	Ox = 50 * Math.cos( (T*Math.PI)/180)
	Oy = 50 * Math.sin( (T*Math.PI)/180)
	T += 5;
	theta = Math.atan(dy/dx);
	if(dx <0 && dy <0){
		theta = theta + Math.PI;
		//alert("stop");
	} else if (dx <0){
		theta = theta + Math.PI;
	}
	
	var radius = 100/(dx*dx + dy*dy);
	vy = vy +(radius * Math.sin(theta));
	vx = vx + (radius * Math.cos(theta));
	x = x+vx;
	y = y+vy;
	acceleration = 1 * (1/radius);

}
function draw(){
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,swid,sheig);
	ctx.fillStyle = "#ff0000";
	ctx.strokeStyle = '#00ff00';
	ctx.fillRect(x-5,y-5,10,10);
	ctx.strokeStyle = '#0000ff';
	ctx.fillRect(Ox + mx-5,Oy + my-5,10,10);
	
	ctx.beginPath();
	ctx.strokeStyle = '#0000ff';
		ctx.lineWidth = 5;
		ctx.moveTo(x,y);
		ctx.lineTo(x + dx,y);
		ctx.lineTo(x + dx, y+dy);
		ctx.moveTo(x,y);
		ctx.arc(x,y,30,0,theta, true);
		
		ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.moveTo(x,y);
		ctx.strokeStyle = '#00ffff';
		ctx.lineTo(x + vx, y +vy);
		ctx.stroke();
	ctx.closePath();
}

function updateall(){

update();
draw();
webkitRequestAnimationFrame (updateall);
}
	updateall();
	
$("#canvas").click(function(e){
	create(e.pageX, e.pageY);

});
});