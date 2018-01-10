
$(document).ready(function(){
    // alert(app.name);
    app.getMenu().getMyInfo().getAllChatRoom();
    $("#app_name").html(app.name);



    // alert(app.myInfo.userName);
});
$(".changeUserStatus").click(function(){
    alert(1);
});
function changeStatus(self,status) {
    var statusHtml = $(self).html();
    // $("#userStatus").html(status);
    app.chengeStatus(status,statusHtml);

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
$("#addChatRoomUserBtn").click(function() {
    app.addChatRoomUserFind();
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
$(document).on("dblclick",".chatRoomClick",function(){
    app.chatType = 2;
    app.chatDiv.html("");
    app.activeChatRoomId = $(this).children(".chatRoomId").val();
    $("#activeUser").html($(this).children(".chatRoomName").text());
});
$(document).on("click",".agreeAddFriend",function(){
    app.validateUserId = $(this).val();
    var html = '';
    for(var key in app.friends)
    {
        html += '<option value="'+app.friends[key].gFgroup.groupId+'">'+
            app.friends[key].gFgroup.groupName+
            '</option>';
    }
    $("#dealValidateGroup").html(html);
    $("#dealValidateModal").modal("show");
});
$(document).on("click",".disAgreeAddFriend",function(){
    app.validateUserId = $(this).val();
    app.dealValidateMsg(-1);
});
//添加群聊成员
$(document).on("click",".addChatRoomUser",function(){
    app.addChatRoomUserRoomId = $(this).find(".roomId").text();
    $("#addChatRoomUserModal").modal("show");
});
$(document).on("click",".exitChatRoom",function(){
    var id = $(this).find(".roomId").text();
    app.exitChatRoom(id);
    app.chatType = 0;
});
$(document).on("click",".roomUserInfo",function(){
    var id = $(this).find(".roomId").text();
    $("#chatRoomUserInfoModal").modal("show");
    app.getRoomUserInfo(id);
});
function viewFriend(id){
    $("#viewFriendModal").modal('show');
    app.viewFriend(id);
}
function deleteFriend(id){
    app.deleteFriend(id);
}

//添加成员到群
$(document).on("click",".addChatRoomUserOk",function(){

    app.addChatRoomUser($(this).val());
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
        $("#showInfo").showMsg("没有了,要看更多请查看历史消息");
    }
});
$("#historyMsgDiv").on("scroll",function(){

    if($("#historyMsgDiv").scrollTop() == 0)
    {
        app.activeChatPageNum++;
        if(app.chatType == 1){
            app.getHistoryMsgUser();
        }else if(app.chatType == 2){
            app.getRoomHistoryMsgUser();
        }
    }
});
$("#historyMsgView").click(function(){

    app.getHistoryMsg();
})
//定时获取当前和朋友的聊天消息
setInterval(function() {
    app.getMsgWithUser();
},2000);
//定时获取群聊消息
setInterval(function() {
    app.getMsgWithRoom();
},3000);
//获取待处理消息
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
});
//发送处理请求
$("#agreeValidateBtn").click(function(){
    app.dealValidateMsg(1);
});
//添加群的modal
$("#addChatRoom").click(function(){
    $("#addChatRoomModal").modal("show");
})
//添加群
$("#addChatRoomBtn").click(function(){
    app.addChatRoom();
})
$("#uploadFile").click(function(){
    $('#inputFile').trigger('click');
})
$("#inputFile").change(function() {
    var formData = new FormData($( "#fileUp" )[0]);
     $.ajax({
          url: 'http://127.0.0.1:8080/webChat/chat/upload' ,
          type: 'POST',
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function (res) {
              var url = res.data;
              app.editor.txt.append('<a href="'+url+'"><img src="img/file.png" style="width:20px;height20px">文件</a>');
          },
          error: function (returndata) {
              alert(returndata);
          }
     });
})
$("#updateMyInfo").click(function(){
    $("#updateMy").modal('show');
})
$("#userImgBtn").click(function(){
    $('#inputFile1').trigger('click');
});
$("#inputFile1").change(function() {
    var formData = new FormData($( "#fileUp1" )[0]);
     $.ajax({
          url: 'http://127.0.0.1:8080/webChat/chat/upload' ,
          type: 'POST',
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function (res) {
              $("#userImgBtn").attr("src",res.data);
              $("#uuserImg").val(res.data);
          },
          error: function (returndata) {
              alert(returndata);
          }
     });
})
$("#commit").click(function(){
        Ajax(
            "POST","user/updateMyInfo",
            $("#userInfo").serializeJson(),
            function(res){
                $("#updateMy").modal('hide');
                $("#showInfo").showMsg(res.msg);
                app.getMyInfo();
            }
        );
});

$("#userImg").click(function(){
    $("#updateMy").modal('show');

})

function deleteGroup(id){
    app.deleteGroup(id);
}
