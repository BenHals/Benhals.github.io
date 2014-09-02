
function alertme(){
	
	alert("functioncalled");
	};
	
	function createRegForm(){
			$("#registerpopup").css('left', function(){
			return $("body").width()/2 - $(this).width()/2;
			});
			$("#registerpopup").show();
			$("#overlay").show();
	};
	function createLogForm(){
			$("#loginpopup").css('left', function(){
			return $("body").width()/2 - $(this).width()/2;
			});
			$("#loginpopup").show();
			$("#overlay").show();
	};
	function setusersname(name){
	$username = name;
	};
$(window).resize(function(){
$("img").width($(window).width() * 0.8);
$("img").height($(this).width() * (1/5.5));
$(".filtersearch").width($(window).width() * (1/10));
$(".filter").width($(window).width() * (1/20));
});
$(document).ready(function(){
$("img").width($(window).width() * 0.8);
$("img").height($(this).width() * (1/5.5));
$(".filtersearch").width($(window).width() * (1/10));
$(".filter").width($(window).width() * (1/20));
$("img").mouseenter(function(){
	$(this).fadeToggle(1000, function(){
		$(this).fadeToggle(1000);
		});
	});
	
	
	
	$("#login").click(function (){
		createLogForm();
		
		}); 
	$("#register").click(function (){
		createRegForm();
		
		}); 
		
		$("#cancelregister").click(function (){

			$("#registerpopup").hide();
			$("#overlay").hide();
			
			}); 
		$("#cancellogin").click(function (){

			$("#loginpopup").hide();
			$("#overlay").hide();
			
			}); 
$("#Logout").click(function (){
	
	$.get("Logout.php",function(data){
	});
			
}); 

	function getbooks(username, title, author, genre){
	$("#Bookwrapper").load("../includes/getBooks.php", {user:username, Stitle:title, Sauthor:author, Sgenre:genre}, function(){
	});
	}
			
	getbooks();
	
	$(".filtersearch").keyup(function(){
		user = $("#usersearch").val();
		title = $("#titlesearch").val();
		author = $("#authorsearch").val();
		genre = $("#genresearch").val();
		getbooks(user, title, author, genre);

	});
	
	$(document).on('mouseenter', '.Book',function(){

		if($(this).attr('id') == $username){
		$(this).children(".close").show();
		};
	});
});