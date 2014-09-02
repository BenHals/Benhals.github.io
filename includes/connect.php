<?php
	$connect = mysql_connect('localhost', 'bloodfox_user', 'FinnFace');
	if(!$connect){
		die('Could not connect to database'.mysql_error());
	
	}
	
	$db_selected  = mysql_select_db("bloodfox_First");
	if(!$db_selected){
		die('Could not connect to database'.mysql_error());
	
	}
?>
