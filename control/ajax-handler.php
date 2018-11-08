<?php
session_start();
include ("database.php");

if (isset($_GET['data']) && $_GET['data'] == "rides") {
    $rides = $conn->query("SELECT * FROM `rides` w");

    $rows = array();
    while ($r = $rides->fetch_array()) {
        $rows[] = $r;
    }
    for($i = 0; $i<sizeof($rows); $i++){
        $rows[$i]['time'] = date('d/m/Y H:i', $rows[$i]['time']);
    }
    print json_encode($rows);
}

if (isset($_GET['id']) && $_GET['data'] == "ride") {
    $ride = $conn->query("SELECT * FROM `rides` WHERE `id` = {$_GET['id']}");

    $rows = array();
    while ($r = $ride->fetch_array()) {
        $rows[] = $r;
    }

    print json_encode($rows);
}

if (isset($_GET['id']) && $_GET['data'] == "location") {
    $location = $conn->query("SELECT * FROM `locations` WHERE `id` = {$_GET['id']}");

    $rows = array();
    while ($l = $location->fetch_array()) {
        $rows[] = $l;
    }
    print json_encode($rows);
}

if(isset($_SESSION['userID']) && isset($_GET['data']) && $_GET['data'] == 'myrides'){
    $result = $conn->query("SELECT ride_id FROM passengers WHERE user_id = ".$_SESSION['userID']);
    $rideID = array();
    while ($row = $result->fetch_assoc()){
        $rideID[] = $row;
    }
    $rides = array();
    $result->close();
    foreach($rideID as $id){
        $result = $conn->query("SELECT `time`, setoff_location FROM rides WHERE id=".$id['ride_id']);
        while ($row = $result->fetch_assoc())
            $rides[] = $row;
    }
    $location = array();
    $result->close();
    foreach ($rides as $ride) {
        $result = $conn->query("SELECT address FROM locations WHERE id =".$ride['setoff_location']);
        while ($row = $result->fetch_assoc())
            $location[] = $row;
    }
    $data = array();
    for($i = 0; $i<sizeof($rides); $i++){
        $data[] = array('time' => date('d/m/Y H:i', $rides[$i]['time']), 'location' => $location[$i]['address']);
    }
    print json_encode($data);

}

if (isset($_GET['data']) && $_GET['data'] == "vehicles") {
    $rides = $conn->query("SELECT * FROM `vehicles` WHERE `owner` = {$_SESSION['userID']}");

    if ($rides->num_rows > 0) {
        $rows = array();
        while ($r = $rides->fetch_array()) {
            $rows[] = $r;
        }
        print json_encode($rows);
    } else {
        print "NONE-FOUND";
    }
}

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if(isset($_POST['locationID']) && $_POST['locationID'] != ''){
        $stmt = $conn->prepare("SELECT address FROM locations WHERE id = ?");
        $stmt->bind_param("s", $_POST['locationID']);
        $stmt->execute();
        $stmt->bind_result($id);
        $stmt->fetch();
        $stmt->close();
        echo $id;
    }

    if(isset($_POST['vehicleID']) && $_POST['vehicleID'] != ''){
        $stmt = $conn->prepare("SELECT seats FROM vehicles WHERE id = ?");
        $stmt->bind_param("s", $_POST['vehicleID']);
        $stmt->execute();
        $stmt->bind_result($seatsTotal);
        $stmt->fetch();
        $stmt->close();

        $stmt = $conn->prepare("SELECT id FROM passengers WHERE ride_id = ?");
        $stmt->bind_param("s", $_POST['vehicleID']);
        $stmt->execute();
        $stmt->store_result();
        $num = $stmt->num_rows;
        $stmt->close();

        echo $seatsTotal-$num;
    }

    if(isset($_POST['rideID']) && $_POST['rideID'] != ''){
        $rideID = $_POST['rideID'];
        $userID = $_SESSION['userID'];
        $result = $conn->query("SELECT * FROM passengers WHERE ride_id = $rideID && user_id = $userID");
        if($result->num_rows != 0)
            echo "fail";
        else
           $conn->query("INSERT INTO passengers (`id`, `ride_id`, `user_id`)
                                VALUES (null ,$rideID, $userID)");

    }

}


