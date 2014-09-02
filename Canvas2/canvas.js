swid = 1000;
sheig = 1000;

function draw(){
	
	var x1 = 0;
	var y1 = sheig/2;
	 var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	
	 ctx.canvas.width = swid;
	ctx.canvas.height = sheig;
	 ctx.clearRect ( 0 , 0 , swid , sheig );

	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.strokeStyle="green"
	ctx.lineWidth = 2;
	for(var i =0; i<360;i++){
	   
		x1 = 2*i;
		y1 = (sheig/2) - 100*(Math.sin((x1/360)*(2*Math.PI)));
		//ctx.fillRect(x1,y1,50,50);
		ctx.lineTo(x1,y1);
		ctx.stroke();
		
	}
	
	ctx.stroke();
	
}

$(document).ready(function(){
	swid = $(window).width();
	sheig = $(window).height();
	draw();

});