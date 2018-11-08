$(document).one('pageinit', function () {
    $.ajax({
        type: 'POST',
        url: 'control/login-handler.php',
        data: 'getLogin=true',
        success: function (data) {
            if (data !== 'already logged in') {
                window.location.href = "login.html";
            }
        }
    });
});