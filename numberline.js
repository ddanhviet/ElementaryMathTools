$(document).ready(function() {
	c = document.getElementById("numberlineCanvas");
	c2 = document.getElementById("layer2");
	startX = 10;
	drawing = function() {
		
		canvasW = 1020; canvasH = 400;
		line = c.getContext("2d");
		canvasText = c.getContext("2d");
		
		drawText = function(textOut, X, Y) {
			canvasText.font = "Times New Roman";
			canvasText.fillText(textOut, X, Y);
		}
		
		drawLine = function(startX, startY, endX, endY) {			
			line.beginPath();
			line.moveTo(startX, startY);
			line.lineTo(endX, endY);
			line.stroke();
		}
		ticmark = function(X, Y, markH) {
			drawLine(X, Y-markH, X, Y+markH);
		}
		//variables
		
		endX = canvasW-10;
		numypos = canvasH/2+20;
		
		//main line
		drawLine(0, canvasH/2, canvasW, canvasH/2);
		//arrows
		drawLine(0, canvasH/2, 5, canvasH/2+5);
		drawLine(0, canvasH/2, 5, canvasH/2-5);
		drawLine(canvasW, canvasH/2, canvasW-5, canvasH/2+5);
		drawLine(canvasW, canvasH/2, canvasW-5, canvasH/2-5);
		//draw 0 mark
		ticmark(startX, canvasH/2, 10);
		drawText("0", 8, numypos);
		//calculating functions
		powertothex = parseInt(document.getElementById("powerx").value);
		base = parseInt(document.getElementById("inputb").value);
		convertFromB10 = function(base, inVal) {
			var remaining=inVal, remainder, result='';
			if (remaining ==0) result='0';
			while (remaining != 0) {
				remainder = remaining%base;
				remaining = (remaining-remainder)/base;
				result = remainder+result; //add string to string
			}
			return result;
		}
		convertToB10 = function(base, num) {
			var result = 0;
			var inVal = num.toString();
			for (var i=0; i < inVal.length; i++)
				result = base*result+parseInt(inVal.substr(i,1));
			return result;
		}
		
		maxX = function(base, powertothex) {
			theotherend = base;
			for (i = 1; i<powertothex; i++) {
				theotherend *= base;
			}
			return theotherend;
		}
		maxmark = maxX(base, powertothex);
		//variables
		adjustXpos = function(len) {
			adjusted = (len/2)*6;
			return adjusted;
		}		
		
		//draw end mark
		ticmark(endX, canvasH/2, 10);
		adjustnumXpos = adjustXpos(powertothex+1);
		maxmarkpos = canvasW - 15 - adjustnumXpos;
		maxmarkb = convertFromB10(base, maxmark);
		drawText(maxmarkb, maxmarkpos, numypos);
		//draw other marks
		posX = endX;
		adjustnumXpos = adjustXpos(powertothex);
		nummark = maxmark;		
		distance = (endX - startX);
		for (x = base; x>1; x--) {
			posX = posX - (distance / base);
			ticmark(posX, canvasH/2, 10);			
			nummark = nummark - (maxmark / base);
			markToText = convertFromB10(base, nummark);
			drawText(markToText, posX - adjustnumXpos, numypos);
		}
		posX = startX;
		nummark = 0;
		for (x = 1; x < base*base; x++) {			
			posX = posX + (distance / (base*base));
			ticmark(posX, canvasH/2, 5);			
			//nummark = nummark + maxmark * 0.01;
			//drawText(nummark, posX - adjustnumXpos, numypos);
		}
		
		//number to place into number line
		numb = document.getElementById("numberGo").value;
		numb10 = parseInt(convertToB10(base, numb));				
		posX = startX + ((numb10/maxmark) * distance);
		ticmark(posX, canvasH/2, 15);
		adjustnumXpos = adjustXpos(numb.length);
		drawText(numb, posX - adjustnumXpos, numypos-40);		
		
	}//drawing
	
	$("#submit").click(function() {
		context = c.getContext('2d');
		context.clearRect(0, 0, c.width, c.height);
		context.font = "14pt Times New Roman";
		context.fillStyle = 'black';		
		drawing();
	});
	
	writeMessage = function(c, message) {
        var context = c.getContext('2d');
        context.clearRect(0, 0, c.width, c.height);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
  }
  getMousePos = function(c, evt) {
      var rect = c.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
  }
  
  fillArray = function(value, len) {
	  var arr = [];
	  for (var i = 0; i < len; i++) {
	    arr.push(value);
	  }
	  return arr;
	}
  green = fillArray(0, 100);
   
  var redline = c2.getContext('2d');  
  drawRedline = function(startpos, endpos) {
  	redline.clearRect(0, 0, c.width, c.height);
  	redline.beginPath();
  	redline.strokeStyle = "#FF0000";
  	redline.moveTo(startpos, canvasH/2);
  	redline.lineTo(endpos, canvasH/2);
  	redline.stroke();
  }

  c.addEventListener('mousemove', function(evt) {
      var mousePos = getMousePos(c, evt);
      //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      //writeMessage(c, message);
      var lineposX = mousePos.x;
      if (mousePos.y<(canvasH/2+30) && mousePos.y>(canvasH/2-30)) {
	      var startline = Math.floor(lineposX/10) * 10;
	      if (green[(startline-startX)/10] == 0) {
		      var endline = startline + 10;
		      drawRedline(startline, endline);
	    	}
    	}
    	else {
    		redline.clearRect(0, 0, c.width, c.height);
    	}
  }, false);
  
  var greenline = c2.getContext('2d');
  drawGreenline = function(startpos, endpos) {  	
  	greenline.beginPath();
  	greenline.strokeStyle = "#009900";
  	greenline.moveTo(startpos, canvasH/2);
  	greenline.lineTo(endpos, canvasH/2);
  	greenline.stroke();
  }
  clearGreenline = function(startpos, endpos) {
  	greenline.clearRect(startpos, canvasH/2, endpos, canvasH/2);
  }
  
  c.addEventListener('click', function(evt) { 	
  	var mousePos = getMousepos(c2, evt);  	
  	drawLine(10, 10, 10, 20);
  	var lineposX = mousePos.x;
  	if (mousePos.y<(canvasH/2+10) && mousePos.y>(canvasH/2-10)) {
  		var startline = Math.floor(lineposX/10) * 10;
  		if (green[(startline-startX)/10] == 0) {
  			var endline = startline + 10;
  			drawGreenline(startline, endline);
  			green[(startline-startX)/10] = 1;
  		}
  	}
  }, false);
});