 <?php
 	header("Access-Control-Allow-Origin: *");
	$dir    = './data';
	$files = array_diff(scandir($dir), array('.', '..'));
	echo json_encode(array_values($files));
?>