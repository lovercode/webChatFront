
$(document).ready(function(){
    // alert(app.name);
    app.getMenu().getMyInfo().getAllChatRoom();
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
//退出
function logOut(){
    app.logOut();
}
//添加分组
$("#addGroup").click(function(){
    $("#addGroupModal").modal("show");
});
//添加分组确认
$("#addGroupCommit").click(function(){
    $("#addGroupModal").modal("hide");
    app.addGroup();

});
//发送抖一抖
$("#sharkUser").click(function(){
    app.sharkUser();

});
//发送消息
$("#sendMsg").click(function(){
    app.sendMsgToUser();
});
//添加朋友显示
$("#addFriend").click(function(){
    $("#addFriendModal").modal("show");
});
//搜索朋友
$("#addFriendBtn").click(function() {
    app.addFriend();
});
//添加朋友，显示分组
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
//开始和朋友聊天
$(document).on("click",".userClick",function(){
    app.chatType = 1;
    app.chatDiv.html("");
    app.activeChatUserId = $(this).children(".userId").val();
    $("#activeUser").html($(this).children(".friendName").text());
});
//处理朋友weidu消息
$(document).on("click",".userMsgNeedDeal",function(){
    app.chatType = 1;
    app.chatDiv.html("");
    app.activeChatUserId = $(this).find(".id").text();
    $("#activeUser").html($(this).find(".name").html());
});
$(document).on("click",".chatRoomMsgNeedDeal",function(){
    app.chatType = 2;
    app.chatDiv.html("");
    app.activeChatRoomId = $(this).find(".id").text();
    $("#activeUser").html($(this).find(".name").html());
});
//开始群聊
$(document).on("click",".chatRoomClick",function(){
    app.chatType = 2;
    app.chatDiv.html("");
    app.activeChatRoomId = $(this).children(".chatRoomId").val();
    $("#activeUser").html($(this).children(".chatRoomName").text());
});
//添加朋友确认
$("#addFriendCommit").click(function(){
    app.addFriendOk();
    $("#addFriendModal").modal("hide");
    $("#addFriendInfoModal").modal('hide');
});
//聊天记录滚动到最上面
$("#chatInfo").on("scroll",function(){

    if(app.chatDiv.scrollTop() == 0)
    {
        alert("没有了");
    }
});
//定时获取当前和朋友的聊天消息
setInterval(function() {
    app.getMsgWithUser();
},2000);
//定时获取群聊消息
setInterval(function() {
    app.getMsgWithRoom();
},3000);

setInterval(function() {
    app.getNeedDealMsg();
},2000);


//单独聊天
$("#userGroup").click(function(){
    app.getMenu();
    $("#allChatRoomDiv").hide();
    $("#groupFriend").show();
});
//群聊
$("#allChatRoomBtn").click(function(){
    app.getAllChatRoom();
    $("#allChatRoomDiv").show();
    $("#groupFriend").hide();
})
