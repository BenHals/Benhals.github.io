<?php
include("connect.php");
	if(isset($_POST['user'])){
	$username = $_POST['user'];
	$usertext = ' Username LIKE \'%'.$username.'%\'';
	}else{
	$usertext = ' Username LIKE \'%\'';
	}
	if(isset($_POST['Stitle'])){
	$title = $_POST['Stitle'];
	$titletext = ' title LIKE \'%'.$title.'%\'';
	}else{
	$titletext = ' title LIKE \'%\'';
	}
	if(isset($_POST['Sauthor'])){
	$author = $_POST['Sauthor'];
	$authortext = ' author LIKE \'%'.$author.'%\'';
	}else{
	$authortext = ' author LIKE \'%\'';
	}
	if(isset($_POST['Sgenre'])){
	$genre = $_POST['Sgenre'];
	$genretext = ' genre LIKE \'%'.$genre.'%\'';
	}else{
	$genretext = ' genre LIKE \'%\'';
	}
	$result = mysql_query("SELECT * FROM Books LEFT JOIN Users ON Books.Userid=Users.User_id WHERE $usertext  AND $titletext AND $authortext AND $genretext" ) or die(mysql_error());
	while($Book = mysql_fetch_assoc($result)){
		echo "<li class = \"Book\" id = \"".$Book['username']."\" style = \"background-color:#" . $Book["color"] . ";\"> 
					<div class = \"booktitle\">
						" . $Book["title"] . "
					</div> 
					<div class = \"hoverbox\" > ". $Book["genre"] . " <br/> Rating: " .$Book["rating"] . " </div>
					<div class = \"author\">
						" . $Book["author"] . "
					</div>
					
						<a class = \"close\" href = \"deleteBook.php?id=" . $Book["id"] . " \" ></a>
					
					
				</li>
			";
	}
?>