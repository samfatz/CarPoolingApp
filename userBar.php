<?php
session_start();
include 'control/database.php';
if(isset($_SESSION['userID']) && $_SERVER['REQUEST_METHOD'] == 'GET'){
    if($stmt = $conn->prepare("SELECT email FROM users WHERE id = ?"))
        if($stmt->bind_param('s', $_SESSION['userID']))
            if($stmt->execute())
                if($stmt->bind_result($email))
                    if($stmt->fetch())
                        echo $email;
    $stmt->close();

}
?>