<?php
session_start();
include("../includes/connect.php");

if(!isset($_SESSION['name'])){
$_SESSION['name'] = "guest";
$_SESSION['ID'] = 1;
}else{
	$UN = $_SESSION['name'];
	$result = mysql_query("SELECT * FROM Users WHERE username = '$UN'");
	$row= mysql_fetch_array($result);
	$_SESSION['ID'] = $row['User_id'];
}

function topRightLinks(){
	if($_SESSION['name']=="guest"){
		echo '<a  id = "register">Register</a> | <a  id = "login">Login</a> ';

}else{

	echo 'Welcome '.$_SESSION['name'].' | <a href="Logout.php" id = "Logout">Logout</a>';
}
}
$uname = "";
$pword = "";

$validchar = array('-', '_', ' ', '.');
$error = array();
if(!empty($_POST['submit'])){
	
	if(empty($_POST['username'])){
		$error[] = 'Please enter a username';
		}else if (ctype_alnum(str_replace($validchar, '', $_POST['username']))){
			$uname = mysql_real_escape_string($_POST['username']);
			
		}else{
		$error[] = 'username must be letters';
		}
		if(empty($_POST['password'])){
			$error[] = 'Please enter a password';
			}else if (ctype_alnum(str_replace($validchar, '',$_POST['password']))){
				$pword = mysql_real_escape_string($_POST['password']);
					
			}else{
				$error[] = 'password must be letters';
		}
		
		if(empty($error)){
			$result = mysql_query("SELECT * FROM Users WHERE username = '$uname' ") or die();
			if(mysql_num_rows($result)==0){
				mysql_query("INSERT INTO Users (username, password) 
							VALUES
							('$uname', '$pword')") or die();
			}else{
				$error[] = 'Username taken';
			}
		}
		
		if(!empty($error)){
	$error_message = '<span class = "error">';
	foreach($error as $key => $values){
		$error_message .= "$values";
	}
	$error_message .= "</span><br/><br/>";

}

}
$luname = "";
$lpword = "";
if(!empty($_POST['lsubmit'])){
	$lerror = array();
	if(empty($_POST['lusername'])){
		$lerror[] = 'Please enter a lusername';
		}else if (ctype_alnum(str_replace($validchar, '', $_POST['lusername']))){
			$luname = mysql_real_escape_string($_POST['lusername']);
			
		}else{
		$lerror[] = 'username must be letters';
		}
		if(empty($_POST['lpassword'])){
			$lerror[] = 'Please enter a password';
			}else if (ctype_alnum(str_replace($validchar, '',$_POST['lpassword']))){
				$lpword = mysql_real_escape_string($_POST['lpassword']);
					
			}else{
				$lerror[] = 'password must be letters';
		}
		
		if(empty($lerror)){
			$result = mysql_query("SELECT * FROM Users WHERE username = '$luname' AND password = '$lpword' ") or die();
			if(mysql_num_rows($result)==1){
				$_SESSION['name'] = $luname;
				$row = mysql_fetch_array($result);
				$_SESSION['ID'] = $row['User_id'];
			}else{
				$lerror[] = 'Username or password wrong';
			}
		}
		
		if(!empty($lerror)){
	$lerror_message = '<span class = "error">';
	foreach($lerror as $key => $values){
		$lerror_message .= "$values";
	}
	$lerror_message .= "</span><br/><br/>";

}
}
?>



<html>
<head>
		<link rel = "stylesheet" href = "main.css">
		<script src="jquery-2.0.3.js"></script>
		<script src="main.js"></script>
	
	</head>

	<body>
		 <?php echo "<script type = \"text/javascript\"> setusersname('".$_SESSION['name']."'); </script>"; ?>
		<div class = "rounded">
		
			<div id = "title">
			<div id="loginbox">
			<?php topRightLinks(); ?>
				</div>
				<img src = "../Images/Library title2.png" width = "1440px" height = "259px" /> 
			</div>	
			
				
			<nav>
				<label class = "filter"> User: </label><input type = "text" id = "usersearch" name = "usersearch" class = "filtersearch" >
				<label class = "filter"> Title: </label><input type = "text" id = "titlesearch" name = "titlesearch" class = "filtersearch">
				<label class = "filter"> Author: </label><input type = "text" id = "authorsearch" name = "authorsearch" class = "filtersearch">
				<label class = "filter"> Genre: </label><input type = "text" id = "genresearch" name = "genresearch" class = "filtersearch">
				<a href = "addBook.php"><div id = "newbutton"> </div> </a>
			</nav>
			<ul id = "Bookwrapper">
				
			</ul>
		</div>
		
		<div id="registerpopup" >
			<div id="registertitle">
				Register
			</div>
		<form action="Library.php" method="post">
		<?php echo $error_message; ?>
				<label> Username: </label> <input type = "text" name = "username" class = "field"/>
				<label> Password: </label> <input type = "text" name = "password" class = "field"/>
				<input type="submit" name = "submit" value="Submit" id = "submit">
		</form>
		<div id="cancelregister">Cancel</div>
		</div>
		<div id="overlay" >
		hello
		</div>
		<?php if(!empty($error)){ echo "<script type = \"text/javascript\"> createRegForm(); </script>";}; ?>
				
		<div id="loginpopup" >
			<div id="logintitle">
				Log in
			</div>
		<form action="Library.php" method="post" id = "login">
		<?php echo $lerror_message; ?>
				<label> Username: </label> <input type = "text" name = "lusername" class = "field"/>
				<label> Password: </label> <input type = "text" name = "lpassword" class = "field"/>
				<input type="submit" name = "lsubmit" value="Submit" id = "submit">
		</form>
		<div id="cancellogin">Cancel</div>
		</div>
		<?php if(!empty($lerror)){ echo "<script type = \"text/javascript\"> createLogForm(); </script>";}; ?>
	</body>


</html>