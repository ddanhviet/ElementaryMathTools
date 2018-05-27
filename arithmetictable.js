$(document).ready(function() {
	
		convertToB10 = function(base, num) {
			var result = 0;
			var inVal = num.toString();
			for (var i=0; i < inVal.length; i++)
				result = base*result+parseInt(inVal.substr(i,1));
			return result;
		}
    
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
	
		Calculate = function(input1_BU, operation, input2_BU, base) {
			var whole_part, remainder, 
			input1_B10 = convertToB10(base, input1_BU),
			input2_B10 = convertToB10(base, input2_BU);
			var result = 0;
		 
			switch(operation) {
				case '+':
					result = input1_B10+input2_B10;
					break;
				case '-':
					result = input1_B10-input2_B10;
					break;
				case 'x':
					result = input1_B10*input2_B10;
					break;
				case '/':
					result = input1_B10/input2_B10;
					var whole_part = Math.floor(result);
					if (whole_part !== result)
						remainder = input1_B10-whole_part*input2_B10;
					break;
			}
			if (remainder)
				result = convertFromB10(base, whole_part) + 'R' + convertFromB10(base, remainder);
			else
				result = convertFromB10(base, result)+'';
			return result;
    }

		/*init
		*/
		
		//input base
		$("#inputb option").prop('selected', function() {
			return this.defaultSelected;
		});
		
		var base = document.getElementById("inputb").value;
    
    inittable = function() {
	    var stringaddtable="<tr>";
	    stringaddtable += "<th> + </th>";
	    var stringmultitable="<tr>";
	    stringmultitable +="<th> x </th>";
	    for (var c=0;c<base;c++) {
	    	stringaddtable+= "<th>" + c + "</th>";
	    	stringmultitable+= "<th>" + c + "</th>";
	    }
	    stringaddtable+= "</tr>";
	    stringmultitable+= "</tr>";
	    $("#addtable").append(stringaddtable);
	    $("#addresult").append(stringaddtable);
	    $("#multitable").append(stringmultitable);
	    $("#multiresult").append(stringmultitable);
	    
	    stringaddtable="";
	    stringmultitable="";
	    var stringaddresult="";
	    var stringmultiresult="";
	    for (var r=0;r<base;r++) {
	    	stringaddtable+= "<tr>";
	    	stringaddresult+= "<tr>";
	    	stringmultitable+="<tr>";
	    	stringmultiresult+="<tr>";
	    	for (var c=0;c<=base;c++) {
	    		if (c==0) {
	    			stringaddtable+="<th>" + r + "</th>";
	    			stringaddresult+="<th>" + r + "</th>";
	    			stringmultitable+="<th>" + r + "</th>";
	    			stringmultiresult+="<th>" + r + "</th>";
	    		}
	    		else {
	    			stringaddtable+="<td></td>";
	    			cell = Calculate(r, "+", c-1, base);
	    			stringaddresult+="<td>" + cell + "</td>";
	    			//multi tables
	    			stringmultitable+="<td></td>";
	    			cell = Calculate(r, "x", c-1, base);
	    			stringmultiresult+="<td>" + cell + "</td>";
	    		}	
	    	}
	    	stringaddtable+="</tr>";
	    	stringaddresult+="</tr>";
	    	stringmultitable+="</tr>";
	    	stringmultiresult+="</tr>";
	    }
	    $("#addtable").append(stringaddtable);
	    $("#addresult").append(stringaddresult);
	    $("#addresult").hide();
	    $("#multitable").append(stringmultitable);
	    $("#multiresult").append(stringmultiresult);
	    $("#multiresult").hide();
			
			$("#addtable").find("td").html("<input class='fromtable' type='text' />");
			$("#addtable").find("td").addClass("cellEditing");
			$("#multitable").find("td").html("<input class='fromtable' type='text' />");	
			$("#multitable").find("td").addClass("cellEditing");
    }//init table
    
    inittable();
    
		$("#resetbase").click(function() {
			base = document.getElementById("inputb").value;
			$("#addtable").empty();
			$("#multitable").empty();
			$("#addresult").empty();
			$("#multiresult").empty();
			inittable();
		});
		
		
		
		//create editable cell
		$("#addtable td, #multitable td").click(function () {
        var OriginalContent = $(this).text();
       
        $(this).addClass("cellEditing");
        $(this).html("<input class='fromtable' type='text' value='" + OriginalContent + "' />");
        $(this).children().first().focus();
        $(this).children().first().keypress(function (e) {
            if (e.which == 13) {       
            		//$(this).parent().nextUntil(".cellEditing").css("border", "red");     	
                $(this).parent().next().children().first().focus();
                var newContent = $(this).val();                
                $(this).parent().removeClass("cellEditing");
                $(this).parent().css("color", "black");
                $(this).parent().text(newContent);                               
            }
        });
        /*
   			$(this).children().first().blur(function(){
   				var newContent = $(this).val();
   				$(this).parent().css("color", "black");
        	$(this).parent().text(newContent);
        	$(this).parent().removeClass("cellEditing");
    		});*/
        $(this).find('input').click(function(e){
            e.stopPropagation(); 
        });
    });
    
    
    $("#addtable td input, #multitable td input").focus(function() {
    	$(this).parent().addClass("cellEditing");
    	$(this).keypress(function (e) {
            if (e.which == 13) {
            		//$(this).parent().next().css("border-color", "red");
                $(this).parent().next().children().first().focus();
                var newContent = $(this).val();                
                $(this).parent().removeClass("cellEditing");
                $(this).parent().css("color", "black");
                $(this).parent().text(newContent);                                 
            }
        });
    });
		
		//Buttons for addition
    $("#addans").click(function() {
    	$("#addresult").toggle();
    	if ($("#addresult").is(":visible")) {
    		$("#addans").val("Hide Answer");
    	}
    	else {
    		$("#addans").val("Show Answer");
    	}
    });    
    $("#addcheck").click(function() {    	
    	//$rresult is the same with #addtable tr each
    	//$cresult is the same with $(this).children('td')
    	var r=0;    	
    	$('#addtable tr').each(function(i){
    		$rresult = $('#addresult tr').eq(r);
    		var c=0;    		
    		$(this).children('td').each(function(j) {
    			$cresult = $rresult.children('td').eq(c);    			
    			if ($(this).text() != $cresult.text())
    				$(this).css("color", "red");
    			
    			c++;	
    		});    		
    		r++;	
    	});
    	
    	//for (var indexrow=0; indexrow<$('#addresult tr').length; indexrow++) {
    		//$rowresult = $('#addresult tr').eq(indexrow);
    		//$rowresult.css("color", "red");
    		//for (var indexcell=0;indexcell<$rowresult.children('td').length;indexcell++) {
    			//$cellresult = $rowresult.children('td').eq(indexcell);
    			//$cellresult.css("color", "red");
    		//}
    	//}   	
    });
    
    $("#multians").click(function() {
    	$("#multiresult").toggle();
    	if ($("#multiresult").is(":visible")) {
    		$("#multians").val("Hide Answer");
    	}
    	else {
    		$("#multians").val("Show Answer");
    	}
    });
    $("#multicheck").click(function() {    	
    	//$rresult is the same with #multitable tr each
    	//$cresult is the same with $(this).children('td')
    	var r=0;    	
    	$('#multitable tr').each(function(i){
    		$rresult = $('#multiresult tr').eq(r);
    		var c=0;    		
    		$(this).children('td').each(function(j) {
    			$cresult = $rresult.children('td').eq(c);    			
    			if ($(this).text() != $cresult.text())
    				$(this).css("color", "red");
    			
    			c++;	
    		});    		
    		r++;	
    	});
    });
});