
$(document).ready(function(){

    // alert(app.name);
    app.getMenu().getMyInfo();
    $("#app_name").html(app.name);
    // alert(app.myInfo.userName);
});
$(".changeUserStatus").click(function(){
    alert(1);
});
function changeStatus(self) {
    var status = $(self).html();
    $("#userStatus").html(status);

};
function logOut(){
    app.logOut();
}
