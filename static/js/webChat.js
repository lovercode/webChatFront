
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
$("#addGroup").click(function(){
    $("#addGroupModal").modal("show");
});
$("#addGroupCommit").click(function(){
    $("#addGroupModal").modal("hide");
    app.addGroup();

});
$("#sharkUser").click(function(){
    app.sharkUser();

})
$("#sendMsg").click(function(){
    app.sendMsgToUser();
});
$("#addFriend").click(function(){
    $("#addFriendModal").modal("show");
});
$("#addFriendBtn").click(function() {
    app.addFriend();
});
$(document).on("click",".addFriendBtnOk",function(){
    $("#addFriendInfoModal").modal("show");
    $("#addFriendId").val($(this).val());
    var html = '';
    for(var key in app.friends)
    {
        html += '<option value="'+app.friends[key].gFgroup.groupId+'">'+
            app.friends[key].gFgroup.groupName+
            '</option>';
    }
    $("#addFriendGroup").html(html);
});
$(document).on("click",".userClick",function(){
    app.chatDiv.html("");
    app.activeChatUserId = $(this).children(".userId").val();
    $("#activeUser").html($(this).children(".friendName").text());
});
$("#addFriendCommit").click(function(){
    app.addFriendOk();
    $("#addFriendModal").modal("hide");
    $("#addFriendInfoModal").modal('hide');
});
$("#chatInfo").on("scroll",function(){

    if(app.chatDiv.scrollTop() == 0)
    {
        alert("没有了");
    }
});
setInterval(function() {
    app.getMsgWithUser();
},2000);
