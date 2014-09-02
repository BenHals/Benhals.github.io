


$(document).ready(function(){
		var games = 0;
		var playing = false;
		var location = 0;
		var Ptotal = 0;
		var Pacetotal = 0;
		var Atotal = 0;
		var Aacetotal = 0;
		var numcardsP = 0;
		var cardwidthP = 160;
		var numcardsA = 0;
		var cardwidthA = 160;
		$('#playerscore').html("<p>"+Ptotal+"</p>");
		var deck = new Array(52);
	
	
	function main(){
		location = 0;
		Ptotal = 0;
		Pacetotal = 0;
		Atotal = 0;
		Aacetotal = 0;
		numcardsP = 0;
		cardwidthP = 160;
		numcardsA = 0;
		cardwidthA = 160;
		$('#playerscore').html("<p>"+Ptotal+"</p>");
		genDeck();
		shuffledeck();
		
		playing = true;
	}
	function genDeck(){
		for(var i = 0; i < deck.length; i++){
			deck[i] = i;
		}
	}
	function shuffledeck(){
		var n = deck.length -1;
		var i = 0;
		var t = 0;
		while (n > 0){
			i = Math.floor(Math.random() * n);
			t = deck[n];
			deck[n] = deck[i];
			deck[i] = t;
			
			n--;
		}
		
		
	}

	function getvalueP(val){
		var nosuit = val % 13 +1;
		var addedtotal = nosuit;
		if (nosuit == 11){ nosuit = "jack"; addedtotal = 10;}
		if (nosuit == 12) {nosuit = "queen";addedtotal = 10;}
		if (nosuit == 13) {nosuit = "king";addedtotal = 10;}
		
		
		Ptotal += addedtotal;
		$('#playerscore').html("<p>"+Ptotal+"</p>");
		if(nosuit != 1){
			return '<li>'+nosuit+'</li>';
		}else{
			return '<li id = "ace">'+nosuit+'</li>';
		}
	}
	function getvalueA(val){
		var nosuit = val % 13 +1;
		var addedtotal = nosuit;
		if (nosuit == 11){ nosuit = "jack"; addedtotal = 10;}
		if (nosuit == 12) {nosuit = "queen";addedtotal = 10;}
		if (nosuit == 13) {nosuit = "king";addedtotal = 10;}
		
		if (nosuit == 1) {nosuit = "ace";
		Aacetotal = Atotal;
		Aacetotal += 11;
		$("#AIcards").append('<li></li>');
		}else{
		$("#AIcards").append('<li></li>');
		}
		
		
		Atotal += addedtotal;
		//$('#deck').html("<p>"+Atotal+"</p>");
		return nosuit;
	}
	
	
	$("#deal").click(function(){
	
		if(playing){
		
			if(location < 52){
				//$("#playercards").append('<li>'+getvalueP(deck[location]) +' ' +deck[location] +'</li>');
				$("#playercards").append(getvalueP(deck[location]));
				location++;
				numcardsP++;
				if(numcardsP % 4 == 0){
					//var cardwidth = (700 - (numcardsP+1)*15)/numcardsP;
					cardwidthP /= 2;
					
				}
				$('#playercards li').css("width", cardwidthP);
				$('#playercards li').css("height", cardwidthP*(3/2));
				
				
				var h = getvalueA(deck[location]);
				location++;
				numcardsA++;
				if(numcardsA % 4 == 0){
					//var cardwidth = (700 - (numcardsP+1)*15)/numcardsP;
					cardwidthA /= 2;
					
				}
				$('#AIcards li').css("width", cardwidthA);
				$('#AIcards li').css("height", cardwidthA*(3/2));
			}else{
				playing = false;
			$('#winscreen').css("display", "block");
			var winner = "";
			var reason = "";
			
			if(Ptotal > Atotal){
				winner = "you win!";
				reason = "you got a higher score";
			}
			if(Ptotal < Atotal){
				winner = "you lose!";
				reason = "dealer got a higher score";
			}
			if(Ptotal == Atotal){
				winner = "game tied!";
				reason = "both you and the dealer got the same score";
			}
			if(Ptotal > 21){
				winner = "you lose!";
				reason = "you got bust";
			}
			if(Atotal > 21){
				winner = "you win!";
				reason = "dealer bust";
			}
			if(Ptotal > 21 && Atotal > 21){
				winner = "game tied!";
				reason = "both you and the dealer went bust";
			}
			
			$('#winscreen').append('<p>you got ' + Ptotal+', dealer got ' + Atotal +'. Since ' + reason + ', ' + winner + '</p>');
			}
		}
	});
	
	$("#fold").click(function(){
		if(playing){
			playing = false;
			$('#winscreen').css("display", "block");
			var winner = "";
			var reason = "";
			if((21- Aacetotal) < (21 - Atotal) && Aacetotal < 21){
				Atotal = Aacetotal;
			}
			if(Ptotal > Atotal){
				winner = "you win!";
				reason = "you got a higher score";
			}
			if(Ptotal < Atotal){
				winner = "you lose!";
				reason = "dealer got a higher score";
			}
			if(Ptotal == Atotal){
				winner = "game tied!";
				reason = "both you and the dealer got the same score";
			}
			if(Ptotal > 21){
				winner = "you lose!";
				reason = "you got bust";
			}
			if(Atotal > 21){
				winner = "you win!";
				reason = "dealer bust";
			}
			if(Ptotal > 21 && Atotal > 21){
				winner = "game tied!";
				reason = "both you and the dealer went bust";
			}
			
			$('#winscreen').append('<p>you got ' + Ptotal+', dealer got ' + Atotal +'. Since ' + reason + ', ' + winner + '</p>');
		}
	});
	
	$(document.body).on('click', '#reset', function(){
		$('#playercards').html("");
		$('#AIcards').html("");
		
		$('#winscreen').css("display", "none");
		games++;
		if(games%9 == 0){
			$('#winscreen').html("<div id = 'reset'> </div>");
			
		}
		
		main();
	});
	
	$(document.body).on('click', '#ace', function(){
		if($(this).html() == 1){
			$(this).html(11);
			Ptotal += 10;
			$('#playerscore').html("<p>"+Ptotal+"</p>");
		}else{
			$(this).html(1);
			Ptotal -= 10;
			$('#playerscore').html("<p>"+Ptotal+"</p>");
		}
	
	});
	
	main();
});