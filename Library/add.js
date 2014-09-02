$(document).ready(function(){
$("#colorfield").val(function(){
return Math.floor(Math.random()*16777215).toString(16);
});
$("#colorprev").css("background-color", "#" +$("#colorfield").val());

$("#colorfield").keyup(function(){
	$("#colorprev").css("background-color", "#" +$("#colorfield").val());
});
});