
function sParticle (x,y,angle,v, color){
this.x = x;
this.y = y;
this.angle = angle;
this.v = v;
this.color = color;
this.vx = Math.cos(this.angle)* this.v;
this.vy = Math.sin(this.angle)* this.v;
this.oldx;
this.oldy;
}

$(document).ready(function(){
	$("#controls").css("opacity", "0");
	document.oncontextmenu = function() {return false;};
	var rebound = 0;
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	
	var particles = [];
	var force = false;
	var mx = 0;
	var my = 0;
	var gravity = true;
	var trails = true;
	var decay = false;
	var swid = $(window).width();
	 var sheig = $(window).height();
	  ctx.canvas.width = swid;
		ctx.canvas.height = sheig;
$(window).resize(function(){
	swid = $(window).width();
	sheig = $(window).height();

});
$(window).keypress(function(e){
//alert(e.keyCode);
if(e.keyCode == 32){
	if(rebound == 2){
		rebound = 0;
	}else{
		rebound++;
	}
}
if(e.keyCode == 97){
	//alert(particles.length);
	gravity = !gravity;
}
if(e.keyCode == 115){
	
	trails = !trails;
}
if(e.keyCode == 100){
	
	decay = !decay;
}
});
$(document).mousedown(function(e){ 
    if( e.button == 2 ) { 
	
      force = true;
	 
      return false; 
    } 
    return true; 
  }); 
 $(document).mouseup(function(e){ 
    if( e.button == 2 ) { 
      force = false;
      return false; 
    } 
    return true; 
  });
  
$(document).mousemove(function(e){
	mx = e.pageX;
	my = e.pageY;
});

	function create(mx ,my){
	for (i=0;i<Math.floor((Math.random()*50))+25;i++){
	
	/*	particles.push({
			x:mx,
			y:my,
			angle: Math.random() *360,
			v:Math.random()*10 +1,
			vx: (10*0.1),
			vy: (10*0.1),
			color: Math.floor(Math.random()*16777215).toString(16)}); */
			
		particles.push( new sParticle(mx, my, Math.random() *360, Math.random()*10 +1, Math.floor(Math.random()*16777215).toString(16)));
			
	} 
	
	}
	function update(){
	var particle;
	
	
	for(i=0; i <particles.length; i++){
	
		//particle = particles[i];
		if(particles[i].x <0 || particles[i].x >swid){
			if(rebound == 0){
				 particles.splice(i,1);
				 i--;
			 }else{
				particles[i].vx = particles[i].vx *-0.8;
				particles[i].x += 3*particles[i].vx;
				if (gravity){
					particles[i].vy += 0.1;
				}
				particles[i].x += particles[i].vx;
				particles[i].y += particles[i].vy;

			 }
			 
		}else if(particles[i].y <0|| particles[i].y>(sheig-5) ){
		
			if(rebound == 2){
				particles[i].vy = particles[i].vy *(-0.8);
				particles[i].y += 3*particles[i].vy;
				particles[i].x += particles[i].vx;
				particles[i].y += particles[i].vy;
				 
			 }else{
				 particles.splice(i,1);
				 i--;
			 }
		}
		else{
			if (gravity){
				particles[i].vy += 0.1;
			}
				if(force == true){
					
					var x = mx - particles[i].x;
					var y = my - particles[i].y;
					var forcemag = 100 / (x*x + y*y);
					//if (forcemag > 5){
						//forcemag = 2;
					//}
					//if (forcemag < -10){
						//alert("under");
					//}
					
					var theta = Math.atan(y/x);
					//particles[i].vx += Math.cos(theta) * forcemag;
					//particles[i].vy += Math.sin(theta) * forcemag;
					if(mx / particles[i].x < 1.05 && mx / particles[i].x > 0.95 && my / particles[i].y < 1.05 && my / particles[i].y > 0.95){
						x = my - particles[i].y;
						y = mx - particles[i].x;
						
						particles[i].vx += x * 0.1;
						particles[i].vy += y* 0.1;
						//alert("close");
					}else{
						particles[i].vx += x * 100 / (x*x + y*y);
						particles[i].vy += y* 100 / (x*x + y*y);
					}
				}
				if(decay){
				particles[i].vy = particles[i].vy * 0.99;
				particles[i].vx = particles[i].vx * 0.99;
				}
			particles[i].oldx = particles[i].x;
			particles[i].oldy = particles[i].y;
			particles[i].x += particles[i].vx;
			particles[i].y += particles[i].vy;
		}
	}
	
}
function draw(){
	var particle;
	if(trails){
	ctx.fillStyle = "rgba(0,0,0,0.2)";
	}else {
		ctx.fillStyle = "rgba(0,0,0,1)";
	}
	ctx.fillRect(0,0,swid,sheig);
	ctx.fillStyle = "#000000";
	for(i=0; i <particles.length; i++){
		particle = particles[i];
		ctx.fillStyle = '#' + particle.color;
		ctx.strokeStyle = '#' + particle.color;
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.moveTo(particle.oldx, particle.oldy);
		ctx.lineTo(particle.x, particle.y);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.strokeStyle = '#ff0000';
		ctx.moveTo((particle.x + particle.vx*10), (particle. y+ particle.vy*10));
		ctx.lineTo(particle.x, particle.y);
		ctx.fillRect(particle.x-2.5, particle.y-2.5, 5,5);
		ctx.closePath();
		ctx.stroke();
	}
}

function updateall(){

update();
draw();
webkitRequestAnimationFrame (updateall);
}
	create(500,500);
	updateall();
	
$("#canvas").click(function(e){
	create(e.pageX, e.pageY);

});
});