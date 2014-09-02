function card (val, player){
	this.id = val;
	this.nosuit = (this.id%13) +1;
	this.value = this.nosuit;
	if(this.nosuit == 11 || this.nosuit == 12 || this.nosuit == 13){
		this.value = 10;
	}
	this.htmldisc = " ";
	if(player){
		this.disc = this.value;
	}else {this.disc = " "; }
	if(this.nosuit == 1){
		this.htmldisc = "<li id = 'ace'>" +this.disc+" </li>";
	}else{
		this.htmldisc = "<li >" +this.disc+" </li>";
	}
}
$(document).ready(function(){
		//number of games played without refresh
		var games = 0;
		// is game playing
		var playing = false;
		//current place in deck
		var location = 0;
		//players total score
		var Ptotal = 0;
		//AI total score
		var Atotal = 0;
		//AI total score using ace as 11
		var Aacetotal = 0;
		//number of cards player has
		var numcardsP = 0;
		//width of players cards
		var cardwidthP = 160;
		var numcardsA = 0;
		var cardwidthA = 160;
		// set the score indicator
		$('#playerscore').html("<p>"+Ptotal+"</p>");
		var money = 100;
		$('#money').html("<p>"+money+"</p>");
		var deck = new Array(52);
	function main(){
	
		playing = true;
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
			deck[i] = new card(i, true);
		}
	}
	function shuffledeck(){
		//Fisher-Yates Shuffle
		//start at last card, -1 as the array starts at 0
		var n = deck.length -1;
		var i = 0;
		var t = 0;
		//iterate backwards
		while (n > 0){
			// set i to random card below current
			i = Math.floor(Math.random() * n);
			//set t to current card
			t = deck[n];
			//switch current with random
			deck[n] = deck[i];
			//switch random with current
			deck[i] = t;
			//move down
			n--;
		}
	}
	function checkwinner(){
			playing = false;
			while(Atotal <= 16){
				AImove();
			}
			$('#winscreen').css("display", "block");
			var winner = "";
			var reason = "";
			if(Ptotal > Atotal && Ptotal <= 21){
				winner = "you win!";
				reason = "you got a higher score";
				money += 25;
			}
			if(Ptotal < Atotal && Atotal <= 21){
				winner = "you lose!";
				reason = "dealer got a higher score";
				money -= 25;
			}
			if(Ptotal == Atotal){
				winner = "game tied!";
				reason = "both you and the dealer got the same score";
			}
			if(Ptotal > 21){
				winner = "you lose!";
				reason = "you got bust";
				money -= 25;
			}
			if(Atotal > 21){
				winner = "you win!";
				reason = "dealer bust";
				money += 25;
			}
			if(Ptotal > 21 && Atotal > 21){
				winner = "game tied!";
				reason = "both you and the dealer went bust";
			}
			$('#money').html("<p>"+money+"</p>");
			$('#winscreen').append('<p>you got ' + Ptotal+', dealer got ' + Atotal +'. Since ' + reason + ', ' + winner + '</p>');
	}
	function AImove(){
	
		if(Atotal <= 16){
			$("#AIcards").append("<li> </li>");
			Atotal += deck[location].value;
				location++;
				numcardsA++;
				if(numcardsA % 4 == 0){
					cardwidthA /= 2;
				}
				$('#AIcards li').css("width", cardwidthA);
				$('#AIcards li').css("height", cardwidthA*(3/2));
		}
	}
	$("#deal").click(function(){
		if(playing){
			if(location < 52){
				$("#playercards").append(deck[location].htmldisc);
				Ptotal += deck[location].value;
				$('#playerscore').html("<p>"+Ptotal+"</p>");
				location++;
				numcardsP++;
				//stops cards overflowing by reducing size
				if(numcardsP % 4 == 0){
					cardwidthP /= 2;
				}
				$('#playercards li').css("width", cardwidthP);
				$('#playercards li').css("height", cardwidthP*(3/2));
				AImove();
			}else{
				checkwinner();
			}
		}
	});
	$("#fold").click(function(){
		if(playing){
			checkwinner();
		}
	});
	$(document.body).on('click', '#reset', function(){
		$('#playercards').html("");
		$('#AIcards').html("");
		
		$('#winscreen').css("display", "none");
		games++;
		//resets win screen so it doesnt overflow
		if(games%9 == 0){
			$('#winscreen').html("<div id = 'reset'> </div>");
		}
		main();
	});
	$(document.body).on('click', '#ace', function(){
	//lets player switch aces between 1 and 11
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