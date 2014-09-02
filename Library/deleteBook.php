<?php
include("../includes/connect.php");
$Id = $_GET["id"];
mysql_query("DELETE FROM Books WHERE id = '$Id'")
				 or die();
	while (ob_get_status()) 
{
    ob_end_clean();
}
header( "Location: Library.php" );

?>

