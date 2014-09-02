<?php
session_start();
$_SESSION['name'] = "guest";
$_SESSION['ID'] = 1;
header("Location: Library.php");
?>