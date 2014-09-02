<?php
function topRightLinks(){
	if($_SESSION['name']=="guest"){
		echo '<a  id = "register">Register</a> | <a  id = "login">Login</a> ';

}else{
	echo 'Welcome '.$_SESSION['name'].$_SESSION['ID'];
}
}
ob_start();
session_start();
include("../includes/connect.php");
$error = array();

$validchar = array('-', '_', ' ', '.');
if(isset($_POST['submit'])){
	
	
	$rating = $_POST['rating'];
	if(empty($_POST['title'])){
		$error[] = 'Please enter a title';
		}else if (ctype_alnum(str_replace($validchar, '', $_POST['title']))){
			$title = mysql_real_escape_string($_POST['title']);
			
		}else{
		$error[] = 'title must be letters';
		}
		if(empty($_POST['author'])){
			$error[] = 'Please enter a author';
			}else if (ctype_alnum(str_replace($validchar, '',$_POST['author']))){
				$author = mysql_real_escape_string($_POST['author']);
					
			}else{
				$error[] = 'author must be letters';
		}
		if(empty($_POST['genre'])){
			$error[] = 'Please enter a Genre';
			}else if (ctype_alnum(str_replace($validchar, '',$_POST['genre']))){
				$genre = mysql_real_escape_string($_POST['genre']);	
			}else{
				$error[] = 'Genre must be letters';
		}
		if(empty($_POST['color'])){
			$error[] = 'Please enter a Hexidecimal value for color';
			}else if (preg_match('/^[a-f0-9]{6}$/i', $_POST['color'])){
				$color = $_POST['color'];
									
			}
			else{
				$error[] = 'Color must be a hex code';
		}
		
		if(empty($error)){
		$uid = $_SESSION['ID'];
		mysql_query("INSERT INTO Books (title, author, genre, rating, color, Userid) 
					VALUES
					('$title', '$author', '$genre', '$rating', '$color', '$uid')") or die();
		while (ob_get_status()) 
		{
			ob_end_clean();
		}
		header( "Location: Library.php" );
		}else{
	$error_message = '<span class = "error">';
	foreach($error as $key => $values){
		$error_message .= "$values";
	}
	$error_message .= "</span><br/><br/>";

}
}
?>


<html>
<head>
		<link rel = "stylesheet" href = "main.css">
		<script src="jquery-2.0.3.js"></script>
		<script src="add.js"></script>
	
	</head>

	<body>
		<div class = "rounded">
			<div id = "title">
			<div id="loginbox">
			<?php topRightLinks(); ?>
				</div>
<a href = "index.php">	<img src = "../Images/Library title2.png" width = "1440px" height = "259px" /> </a> </a>
			</div>	
			<nav>
			</nav>
			<form name = "input" action = "addBook.php" method = "post" id = "addform">
			<?php echo $error_message; ?>
				<h2> Add new book </h2>
				<label> Title: </label> <input type = "text" name = "title" class = "field"/>
				<label> Author: </label> <input type = "text" name = "author" class = "field"/>
				<label> Genre: </label> <input type = "text" name = "genre" class = "field"/>
				<label> Rating: </label> 
					<input type = "radio" name = "rating" value = "1" class = "field"/> 
					<input type = "radio" name = "rating" value = "2" class = "field"/> 
					<input type = "radio" name = "rating" value = "3" class = "field"/> 
					<input type = "radio" name = "rating" value = "4" class = "field"/> 
					<input type = "radio" name = "rating" value = "5" class = "field"/> 
				<label> Color: </label> <input type = "text" name = "color" maxlength = "6" class = "field" id = "colorfield"  value = "heloo" />
				<p class = "hint"> Input hex color code (Without #) </p>
				<div id = "colorprev"> </div>
				
				<input type="submit" name = "submit" value="Submit" id = "submit">
			</form>
				<script type="text/javascript">
					document.forms['addform'].elements["title"].value = "<?php echo $title; ?>";
					document.forms['addform'].elements["author"].value = "<?php echo $author; ?>";
					document.forms['addform'].elements["genre"].value = "<?php echo $genre; ?>";
					document.forms['addform'].elements["rating"].value = "<?php echo $rating; ?>";
					document.forms['addform'].elements["color"].value = "<?php echo $color; ?>";
				</script>
		</div>
	</body>


</html>