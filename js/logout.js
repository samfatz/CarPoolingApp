$(document).one('pageinit', function () {
    $('.logout').one("click", function () {
        $.ajax({
            url: 'control/login-handler.php',
            data: "logout=true",
            type: "POST",
            success: function (data) {
                console.log(data);
                if(data === "success")
                    // $.mobile.navigate("login.html", {transition: "slide", forceReload: true}
                    window.location.href = "login.html";
            }

        });
    });
});