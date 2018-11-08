<?php
session_start();
include 'database.php';
/**
 * Created by IntelliJ IDEA.
 * User: Cammy
 * Date: 04/04/2018
 * Time: 21:09
 */

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if(isset($_POST['logout'])){
        unset($_SESSION['userID']);
        echo "success";
    }else{
        if(isset($_SESSION['userID'])){
            echo "already logged in";
        }else{
            if(isset($_POST['getLogin'])){
                echo "not logged in";
            }else{
                /* Login */
                $emailErr = $passwordErr = "";
                $email = $_POST['email'];
                $password = md5($_POST['password']);
                if(!isset($email) || empty($email))
                    $emailErr = "e0";
                if(!isset($password) || empty($password))
                    $passwordErr = "p0";

                if(empty($emailErr) && empty($passwordErr)){
                    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND password = ?");
                    $stmt->bind_param("ss", $email, $password);
                    $stmt->execute();
                    $stmt->bind_result($id);
                    $stmt->fetch();
                    $stmt->close();
                    if(!empty($id)) {
                        $_SESSION['userID'] = $id;
                        echo "success";
                    }else
                        echo "incorrect username/pass";
                }
            }

        }
    }



}