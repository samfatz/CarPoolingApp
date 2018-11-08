<?php
$servername = "devweb2017.cis.strath.ac.uk";
$username = "mad3_r";
$password = "Thookiqu3Aet";
$dbname = $username;

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " .$conn->connect_error);
}