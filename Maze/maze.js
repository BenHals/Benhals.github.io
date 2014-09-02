


window.onload = function(){
	var useColor = false;
	var lineWidth = 10;
	document.onkeypress = function(e){
		e =e || window.event;
		if(e.keyCode == 32) load(useColor, lineWidth);
		if(e.keyCode == 13) useColor = true;
		if(e.keyCode == 115){
			lineWidth--;
		}
		if(e.keyCode == 119) lineWidth++;
	}
	var controls = document.getElementById("controls");
	controls.style.opacity = 0;
	load(useColor, lineWidth);
}

function load(useColor, lineWidth){
		var margin = 0;
	var width = 800;
	var height = 800;
	var gridWidth = 25;
	var gridHeight = 25;
	var cornerArray = new Array();
	var oldPositions = new Array();
	var index = 0;
	var corner = null;
	var randIndex = null;
	var newDirection = null;

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var W = window.innerWidth, H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	width = W-margin;
	height = H-margin;
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';

	//drawGrid(width,height,gridWidth,gridHeight,ctx,margin);
	var majorInfo = drawMajorLine(width,height,gridWidth,gridHeight,ctx,margin);
	cornerArray = cornerArray.concat(majorInfo[0]);
	oldPositions = oldPositions.concat(majorInfo[1]);
	while(index <= 100 && cornerArray.length > index){
		corner = cornerArray[index];
		if(corner.exits > 0){
			randIndex = Math.floor(Math.random()*(corner.exits.length));
			newDirection = corner.exits.splice(randIndex,1)[0][0];
			majorInfo = drawBranchLine(width,height,gridWidth,gridHeight,ctx,corner.x,corner.y,newDirection, oldPositions,margin, useColor)
			cornerArray = cornerArray.concat(majorInfo[0]);
			oldPositions = oldPositions.concat(majorInfo[1]);
		}
		index++;
	}
}
	function drawGrid(width,height,gridWidth,gridHeight,ctx,margin){
		ctx.strokeStyle='#596380';
		var lineWidth = 10
		ctx.lineWidth=lineWidth;
		for(i=0; i<=gridHeight;i++){
			ctx.beginPath();
			ctx.moveTo(margin-(lineWidth/2),margin + i*(height/gridHeight));
			ctx.lineTo(margin+width + (lineWidth/2), margin + i*(height/gridHeight));
			ctx.stroke()
		}
		for(i=0; i<=gridWidth;i++){
			ctx.beginPath();
			ctx.moveTo(margin + i*(width/gridWidth),margin);
			ctx.lineTo( margin + i*(width/gridWidth),margin+height);
			ctx.stroke()
		}
				
		
	}

function drawMajorLine(width,height,gridWidth,gridHeight,ctx,margin){
	var startX = Math.floor(Math.random() * (gridWidth-1) + 1);
	var startY = 0;
	var pos = [startX, startY];
	var newpos = null;
	var direction = '2';
	var corners = new Array();
	var curCorner = null;
	var randIndex = null;
	var newDirection = null;
	var oldPos = new Array();
	var isNewPos = false;
	var indexPos = null;
	ctx.strokeStyle='#ffffff';
	ctx.beginPath();
	ctx.moveTo(margin + (width/gridWidth)*startX,margin + (height/gridHeight)*startY);
	
	pos = moveCursor(direction, pos[0], pos[1]);
	ctx.lineTo(margin + (width/gridWidth)*pos[0],margin + (height/gridHeight)*pos[1]);
	ctx.stroke();
	curCorner = new Corner(true, pos[0],pos[1],gridWidth,gridHeight,direction);
	corners.push(curCorner);
	oldPos.push(pos);
	while(pos[0] != 0 && pos[0] != gridWidth && pos[1] !=0 && pos[1] != gridHeight){
		isNewPos = true;
		for(index=0;index<oldPos.length;index++){
			if(oldPos[index] == pos){
				isNewPos = false;
				curCorner = corners[index];
			}
		}
		if(isNewPos){

				curCorner = new Corner(true, pos[0],pos[1],gridWidth,gridHeight,direction);
				corners.push(curCorner);
				oldPos.push(pos);
			}

		randIndex = Math.floor(Math.random()*(curCorner.exits.length));
		newDirection = curCorner.exits.splice(randIndex,1)[0][0];
		if((parseInt(direction) +2) % 4 == parseInt(newDirection)){
			randIndex = Math.floor(Math.random()*(curCorner.exits.length));
			curCorner.exits.push(newDirection);
			newDirection = curCorner.exits.splice(randIndex,1)[0][0];
		}
		direction = newDirection;

		ctx.beginPath();
		ctx.moveTo(margin + (width/gridWidth)*pos[0],margin + (height/gridHeight)*pos[1]);
		newpos = moveCursor(direction, pos[0], pos[1]);
		indexPos = -1;
		for(i=0;i<oldPos.length;i++){
			if(oldPos[i].compare(newpos))
				indexPos = i;
		}
		if( indexPos !=-1){
			if(corners[indexPos].exits.indexOf((parseInt(direction)+2) % 4) != -1){
				alert('hit');
			}
		}
		pos = newpos;
		ctx.lineTo(margin + (width/gridWidth)*pos[0],margin + (height/gridHeight)*pos[1]);
		ctx.stroke();

	}
	return [corners,oldPos];
	 

}

function drawBranchLine(width,height,gridWidth,gridHeight,ctx,x,y,direction, oldPositions,margin,useColor){
	var pos = [x, y];
	var newPos = null;
	var corners = new Array();
	var curCorner = null;
	var randIndex = null;
	var newDirection = null;
	var oldPos = new Array();
	var isNewPos = false;
	var indexPos = null;
	
	ctx.strokeStyle='#ffffff';
	if(useColor){
		ctx.strokeStyle= "#" +Math.floor((Math.random()*3618615)+13158600 ).toString(16);
	}
	ctx.beginPath();
	ctx.moveTo(margin + (width/gridWidth)*x,margin + (height/gridHeight)*y);
	
	pos = moveCursor(direction, pos[0], pos[1]);
	ctx.lineTo(margin + (width/gridWidth)*pos[0],margin + (height/gridHeight)*pos[1]);
	ctx.stroke();
	curCorner = new Corner(true, pos[0],pos[1],gridWidth,gridHeight,direction);
	corners.push(curCorner);
	oldPos.push(pos);
	while(pos[0] > 1 && pos[0] < gridWidth-1 && pos[1] > 1 && pos[1] < gridHeight-1){
		if(oldPositions.indexOf(pos) != -1)
			return [corners, oldPos];
		isNewPos = true;
		for(index=0;index<oldPos.length;index++){
			if(oldPos[index] == pos){
				isNewPos = false;
				curCorner = corners[index];
			}
		}
		if(isNewPos){

				curCorner = new Corner(true, pos[0],pos[1],gridWidth,gridHeight,direction);
				corners.push(curCorner);
				oldPos.push(pos);
			}
		if(curCorner.exits.length == 0)
			return [corners, oldPos];
		randIndex = Math.floor(Math.random()*(curCorner.exits.length));
		newDirection = curCorner.exits.splice(randIndex,1)[0];
		if((parseInt(direction) +2) % 4 == parseInt(newDirection)){
			randIndex = Math.floor(Math.random()*(curCorner.exits.length));
			curCorner.exits.push(newDirection);
			newDirection = curCorner.exits.splice(randIndex,1)[0];
		}
		direction = newDirection;

		ctx.beginPath();
		ctx.moveTo(margin + (width/gridWidth)*pos[0],margin + (height/gridHeight)*pos[1]);
		newPos = moveCursor(direction, pos[0], pos[1]);
		indexPos = -1;
		for(i=0;i<oldPos.length;i++){
			if(oldPos[i].compare(newPos))
				indexPos = i;
		}
		if( indexPos !=-1){
			if(corners[indexPos].exits.indexOf((parseInt(direction)+2) % 4) != -1){
				alert('hit2');
				return [corners, oldPos];

			}
		}
		pos = newPos;
		ctx.lineTo(margin + (width/gridWidth)*pos[0],margin + (height/gridHeight)*pos[1]);
		ctx.stroke()

	}
	 ctx.stroke();
	 return [corners, oldPos];

	}



function moveCursor(direction,x,y){
	if(direction == '0')
		y -= 1;
	if(direction == '1')
		x += 1;
	if(direction == '2')
		y += 1;
	if(direction == '3')
		x -= 1;

	return [x,y]


}

function Corner(isMajor, x, y, gridWidth, gridHeight, entryDirection){
	this.x = x;
	this.y = y;
	this.name = 'hello';
	this.directions = ['3','2','1','0'];
	this.directions = shuffle(this.directions);
	this.exits = new Array();
	this.entry = this.directions.splice(this.directions.indexOf((parseInt(entryDirection)+2)%4),1)[0];
	if(isMajor){
		this.numExits = Math.floor(Math.random()*(3) + 1);
		for(var i = 0;i<this.numExits;i++){
			this.randIndex = Math.floor(Math.random()*(this.directions.length));
			this.exits.push(this.directions.splice(this.randIndex,1)[0]);
		}
	}else{
		this.numExits = Math.floor(Math.random()*(3));
		for(var i = 0;i<this.numExits;i++){
			this.randIndex = Math.floor(Math.random()*(this.directions.length));
			this.exits.push(this.directions.splice(this.randIndex,1)[0]);
		}
	}
}
// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
