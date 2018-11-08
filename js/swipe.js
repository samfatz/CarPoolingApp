$(document).one('pageinit', function () {
    $('#findcontent').off("swipeleft").one("swipeleft", function () {
        $.mobile.changePage("myrides.html");
    });

    $('#findcontent').off("swiperight").one("swiperight", function () {
        window.location.href = "create-ride.html";
    });

    $('#my-rides-content').off("swiperight").one("swiperight", function () {
        $.mobile.changePage("findride.html");
    });

    $('#createcontent').off("swipeleft").one("swipeleft" ,function () {
        $.mobile.changePage("findride.html");

    });

    $('.footer').off("click").one("click", function () {
        $.mobile.changePage("account.html", {transition: "slideup"});
    });

    $('#dismissAcc').off("click").one("click", function () {
       history.back();
    });
});