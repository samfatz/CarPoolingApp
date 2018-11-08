<?php
session_start();
include ("database.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST)) {
        $registration = strip_tags($_POST['registration']);
        $model = strip_tags($_POST['model']);
        $seats = $_POST['seats'];


        $create_vehicle = $conn->query("INSERT INTO `vehicles` (`owner`, `seats`, `type`, `reg`) VALUES ({$_SESSION['userID']}, $seats, '$model', '$registration')");

        print $conn->insert_id;
    }
    else
    {
        print "0";
    }

}