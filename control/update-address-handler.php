<?php
session_start();
include ("database.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST)) {
        $longitude = $_POST['longitude'];
        $latitude = $_POST['latitude'];
        $address = $_POST['address'];

        $conn->query("UPDATE `locations` SET `address` = '$address' WHERE `longitude` = $longitude AND `latitude` = $latitude");
    }

}