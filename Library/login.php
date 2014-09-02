<?php
$luname = "";
$lpword = "";
if(isset($_POST['lusername'])){
	$error = array();
	if(empty($_POST['lusername'])){
		$error[] = 'Please enter a lusername';
		}else if (ctype_alnum(str_replace($validchar, '', $_POST['lusername']))){
			$luname = mysql_real_escape_string($_POST['lusername']);
			
		}else{
		$error[] = 'username must be letters';
		}
		if(empty($_POST['lpassword'])){
			$error[] = 'Please enter a lpassword';
			}else if (ctype_alnum(str_replace($validchar, '',$_POST['lpassword']))){
				$lpword = mysql_real_escape_string($_POST['lpassword']);
					
			}else{
				$error[] = 'password must be letters';
		}
		
		if(empty($error)){
			$result = mysql_query("SELECT * FROM Users WHERE username = '$luname' AND password = '$lpword' ") or die();
			if(mysql_num_rows($result)==1){
				$_SESSION['name'] = $luname;
			}else{
				$error[] = 'Username or password wrong';
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

?>