
$(document).ready(function(){

    $.ajax({
        type: 'POST',
        url: 'control/login-handler.php',
        success: function (data) {
            if(data === 'already logged in'){
                $.mobile.changePage("findride.html", {transition: "slide", reloadPage: true});
            }
        }
    });

    $('#login').on("click", function () {
        event.preventDefault();
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var errors = document.getElementById("errors");
        var pErr = document.getElementById("pErr");

        //* Resetting errors *//
        errors.innerHTML = "";
        pErr.innerHTML = "";

        var errorsExist = false;
        if(email === ""){
            errors.append("Email cannot be blank");
            errorsExist = true;
        }
        if(password === ""){
            pErr.append("Password cannot be blank");
            errorsExist = true;
        }
        /* Popup */
        if(errorsExist){
            $('#pTrigger')[0].click();
        }
        else{
            var data = "email=" + email + "&password=" + password;
            $.ajax({
                type: 'POST',
                url: 'control/login-handler.php',
                data: data,
                success: function (data) {
                    console.log(data);
                    if(data === "success"){
                        $.mobile.navigate("findride.html");
                    }
                    else {
                        errors.append("Incorrect email or password");
                        $('#pTrigger')[0].click();

                    }
                }
            });
        }
    })


});
