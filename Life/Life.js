


window.onload = function(){
	var simSpeed = 500;
	document.onkeypress = function(e){
		e =e || window.event;
		if(e.keyCode == 119) simSpeed = simSpeed * 0.9;
		if(e.keyCode == 115) simSpeed = simSpeed * 1.1;
		if(e.keyCode == 32) startSim = true;
	}
	var start = null;
	var startSim = false;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var controls = document.getElementById("controls");
	controls.style.opacity = 0;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.addEventListener("mousedown",function(event){

		mouseX = event.pageX;
		mouseY=event.pageY;

		mouseXParticle = mouseX/marginX;
		mouseYParticle = mouseY/marginY;

		remainderX = mouseXParticle%1;
		remainderY = mouseYParticle%1;
		//alert(remainderX + " : " + remainderY);
		//alert(event.button);
		if(event.button ===0){
			 if((remainderX <= mouseDection+0.05 || remainderX >= 1-mouseDection+0.05) && (remainderY <= mouseDection+0.05 || remainderY >= 1-mouseDection+0.05)){
			 	curArray[Math.round(mouseXParticle)+(Math.round(mouseYParticle)*aX)].live = !curArray[Math.round(mouseXParticle)+(Math.round(mouseYParticle)*aX)].live;
			 	curArray[Math.round(mouseXParticle)+(Math.round(mouseYParticle)*aX)].valueLife = 1-curArray[Math.round(mouseXParticle)+(Math.round(mouseYParticle)*aX)].valueLife;
			 }
		 	//alert(curArray[mouseXParticle-remainderX+(mouseYParticle-remainderY)*aX].live)
		 	//drawLife();
			//alert(mouseXParticle);
		}
		if(event.button === 1){
			alert(checkLife(Math.round(mouseXParticle), Math.round(mouseYParticle)) + " : " + curArray[Math.round(mouseXParticle)+(Math.round(mouseYParticle)*aX)].live);
			//alert(curArray);
		} 
		if(event.button === 2){
			//updateLife();
			//drawLife();
			startSim = true;

		} 
		

	},false);	
	//Make the canvas occupy the full page
	var W = window.innerWidth, H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	
	//Painting the canvas black
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);

	var padding = 7;
	var aX = 50;
	var aY = 30;

	var marginX = (W-padding*2)/(aX-1);
	var marginY = (H-padding*2)/(aY-1);
	var mouseDection = 10/marginX;
	var curArray = Array();
	var nextArray = Array();

	for(var y = 0;y<aY;y++){
		for(var x = 0; x<aX;x++){
			curArray.push(new lifeParticle(x,y));
		}
	} 

	nextArray = curArray;

	requestAnimationFrame(step);
	function updateLife(){
		
		for(var y = 0;y<aY;y++){
			for(var x = 0; x<aX;x++){
				//alert(x + " : " + y)
				lifeValue = checkLife(x,y);
				//alert(lifeValue);
				if(curArray[x+y*aX].live){
					if(lifeValue > 3 || lifeValue < 2){
						curArray[x+y*aX].nextLife = false;
					}else{
						curArray[x+y*aX].nextLife = true;
					}
				}else{
					if(lifeValue == 3){
						curArray[x+y*aX].nextLife = true;
					}
				} 
			}
		}

		for(var y = 0;y<aY;y++){
			for(var x = 0; x<aX;x++){
				curArray[x+y*aX].live = curArray[x+y*aX].nextLife;
				if(curArray[x+y*aX].live){
					curArray[x+y*aX].valueLife = 1;
				}else{
					curArray[x+y*aX].valueLife = 0;
				}
				curArray[x+y*aX].nextLife = false;

			}
		}
	
	} 

	function checkLife(x,y){
		var arrayValue = x+y*aX;
		var topLeft = arrayValue-(aX+1);
		var topMiddle = arrayValue - aX;
		var topRight = arrayValue -(aX-1);
		var left = arrayValue -1;
		var right = arrayValue +1;
		var bottemLeft = arrayValue+(aX-1);
		var bottemMiddle = arrayValue + aX;
		var bottemRight = arrayValue +(aX+1);
		var touchingLiveValue = 0;
		if((y > 0 && y < aY-1) && (x>0 && x < aX-1)){
			touchingLiveValue = curArray[topLeft].valueLife
							  + curArray[topMiddle].valueLife
							  + curArray[topRight].valueLife
							  + curArray[left].valueLife
							  + curArray[right].valueLife
							  + curArray[bottemLeft].valueLife
							  + curArray[bottemMiddle].valueLife
							  + curArray[bottemRight].valueLife;
		}
		//alert(touchingLiveValue);
		return touchingLiveValue; 
	}
	function drawLife(){
		for(var i = 0; i < curArray.length;i++){
			var p = curArray[i];
			ctx.beginPath();
			if(!p.live){
				ctx.fillStyle = "#596380";
			}else{
				ctx.fillStyle = "#f7464a"
			}
			ctx.arc(p.x*marginX + padding, p.y*marginY + padding, 5, Math.PI*2, false);
			ctx.fill();
		}

	}
	function lifeParticle (x,y){
		this.x = x;
		this.y = y;
		this.live = false;
		this.valueLife = 0;
		this.nextLife = false;
}
function step(timestamp){
	if(startSim){
		if (start === null){
			start = timestamp;
		}

		current = timestamp - start;
		//alert(current);
		if(current > simSpeed){
			updateLife();
			start = timestamp;
			//alert("current");
		}
	}
	drawLife();

	requestAnimationFrame(step);

}
function copyArrays(from, to){
	for(var i = 0;i<from.length;i++){
		to[i] = from[i]
	}

	return to;
}


}

