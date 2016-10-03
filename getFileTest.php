 <?php
 	header("Access-Control-Allow-Origin: *");
 	$file = $_GET["fn"];
 	//$file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $file);
	//$file = mb_ereg_replace("([\.]{2,})", '', $file);
	$basepath = './data/';
	$realBase = realpath($basepath);

	$userpath = $basepath . $_GET['fn'];
	$realUserPath = realpath($userpath);

	if ($realUserPath === false || strpos($realUserPath, $realBase) !== 0) {
	    //Directory Traversal!
	} else {
	    $dir = "./data/".$file;
 		echo file_get_contents($dir);
	}


 ?>