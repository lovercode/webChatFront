var webChat = {
    //app 名字
    name:"webChat",
    //所有朋友和分组
    friends:"",
    //我的信息
    myInfo:"",
    //聊天编辑器
    editor:"",
    //聊天div
    chatDiv:"",
    //当前聊天的人
    activeChatUserId:"",
    //当前聊天记录加载的页数
    activeChatPageNum:0,
    //所有群聊
    allChatRoom:"",
    chatType:0,
    //获取朋友列表
    getMenu: function () {
        var self = this;
        Ajax("GET","friend",null,function(res){
            self.friends = res.data;
            self.showMenu();
            // self.menu = res.data;
        });
        return self;
    },
    //获取自己信息
    getMyInfo: function(){
        var self = this;
        Ajax("GET","user",null,function(res) {
            self.myInfo = res.data;
            self.showMyInfo();
        });
        return self;
    },
    //显示朋友
    showMenu:function() {
        var data = [];
        var html = "";
        var mao = "";
        for(var key in this.friends)
        {
            html += '<div style="clear:both">'+
                '<div style="width:40%;float:left;margin:0px;padding:0px;"><hr style="height:20px;"/></div>'+
                '<div style="width:20%;float:left;text-align:center"><a name="'+this.friends[key].gFgroup.groupId+'">'+this.friends[key].gFgroup.groupName+'</a></div>'+
                '<div style="width:40%;float:right;margin:0px;padding:0px;"><hr style="height:20px;"/></div>'+
                '</div>';
            mao += '<li><a href="#'+this.friends[key].gFgroup.groupId+'">'+this.friends[key].gFgroup.groupName+'</a></li>';
            var friend = "";
            for(var key1 in this.friends[key].friends)
            {
                friend += '<div class="well well-xs userClick" style="clear:both;cursor:pointer;">'+
                        '<input type="hidden" class="userId" value="'+this.friends[key].friends[key1].friendId+'">'+
                        '<div class="col-sm-3">'+
                        '<div class="btn-group">'+
                            '<button type="button" id="userStatus" class="btn btn-primay btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                '<img src="img/bak.jpg" style="height:30px;">'+
                            '</button>'+
                            '<ul class="dropdown-menu">'+
                                '<li><a onclick="changeStatus(this)" >查看信息&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+
                                '<li><a onclick="changeStatus(this)" >删除好友&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                                '<li><a onclick="changeStatus(this)" >拉黑好友&nbsp;&nbsp;<span class="glyphicon glyphicon-remove-sign"></a></li>'+
                            '</ul>'+
                        '</div>'+

                        '</div>'+
                        '<strong class="friendName">'+this.friends[key].friends[key1].friendInfo.userName+

                        '</strong>'+
                        '<p>'+
                        this.friends[key].friends[key1].friendInfo.userWord
                        '</p>'+

                        '</div>';
            }
            html += friend;

        }
        $("#allGroup").html(mao);
        $("#allFriend").html(html);
        return this;
    },
    //显示自己信息
    showMyInfo:function() {
        $("#userName").html(this.myInfo.userName);
        $("#userEmail").html(this.myInfo.userEmail);
        $("#userWord").html(this.myInfo.userWord);

        $("#userEmail").attr("href","mailto:"+this.myInfo.userEmail);
        $("#userWordName").html(this.myInfo.userName);

    },
    //改变状态
    changeStatus:function(status){

    },
    //退出
    logOut:function(){
        Ajax("GET","user/logout",null,function(res) {
            $("#showInfo").showMsg(res.msg);
        });
    },
    //添加分组
    addGroup: function() {
        var self = this;
        Ajax(
            "POST","fgroup",
            $("#groupInfo").serializeJson(),
            function(res){
                $("#showInfo").showMsg(res.msg);
                self.getMenu();
            }
        );
    },
    //戳一戳
    shake:function() {
        for(var j=0; j<3; j++)
        {
            for(var i=0; i<10; i++)
            {
                $("#main").animate({left:'+='+i*2+'px'},i);
            }
            for(var i=0; i<10; i++)
            {
                $("#main").animate({left:'-='+i*2+'px'},i);
            }
        }
    },
    //搜索朋友
    addFriend:function() {
        Ajax(
            "POST","user/search",
            {key:$("#addFriendKey").val()},
            function(res){
                if(res.code != 200)
                {
                    $("#addFriendModal").modal("hide");
                }
                var html = '';
                for(var key in res.data){
                    html += '<div class="well well-xs row">'+
                                '<div class="col-sm-3">'+
                                    '<div class="btn-group">'+

                                        '<img src="'+res.data[key].userImg+'" style="height:30px;">'+

                                    '</div>'+

                                '</div>'+
                                '<div class="col-sm-3">'+
                                    '<strong>'+res.data[key].userName+
                                    '</strong>'+
                                '</div>'+
                                '<div class="col-sm-3">'+
                                    '<button type="button" id="userStatus" value="'+res.data[key].userId+'" class="btn btn-danger btn-xs addFriendBtnOk">加好友'+
                                    '</button>'+
                                '</div>'+
                            '</div>';
                }
                $("#searchFriendRes").html(html);
            }
        )
    },
    //添加、好友
    addFriendOk:function() {
        Ajax(
            "POST","friend",
            $("#addFriendInfo").serializeJson(),
            function(res) {
                $("#showInfo").showMsg(res.msg);
            }
        )
    },
    //获取当前聊天对象的未读消息
    getMsgWithUser: function(){
        if(app.chatType == 1 && app.activeChatUserId != ""){
            Ajax(
                "POST",
                "chat/getByUser",
                {userId:app.activeChatUserId},
                function(res) {
                    for(var key in res.data){
                        if(res.data[key].chatType == "抖一抖"){
                            app.addMsgToDiv('<p style="color:red">对方抖了你一下</p>',"left");
                            app.shake();
                        }else{
                            app.addMsgToDiv(res.data[key].chatInfo,"left");
                        }
                    }

                }
            )
        }
    },
    //添加信息到聊天框
    addMsgToDiv:function(msg,direction) {
        var html = '<div class="well well-sm col-sm-6" style="float:'+
                    direction
                    +'">'+
                    msg+
                    '</div>'+
                    '<div  style="clear:both;" >';
        app.chatDiv.append(html);
        app.chatDiv.scrollTop(app.chatDiv.position().top+app.chatDiv.scrollTop());

    },
    //发送消息
    sendMsgToUser:function(){
        var self = this;
        if(app.chatType == 1 && app.activeChatUserId != ""){
            Ajax(
                "POST",
                "chat",
                {
                    chatInfo:app.editor.txt.html(),
                    chatTo:app.activeChatUserId
                },
                function(res) {
                    self.addMsgToDiv(app.editor.txt.html(),"right");
                }
            )
        }else {
            $("#showInfo").showMsg("请先选择聊天的好友");
        }
    },
    //发送抖一抖消息
    sharkUser: function(){
        var self = this;
        if(app.chatType == 1 && app.activeChatUserId != ""){
            Ajax(
                "POST",
                "chat/sharkUser",
                {
                    chatTo:app.activeChatUserId
                },
                function(res) {
                    self.addMsgToDiv('<p style="color:red">你抖了对方一下</p>',"right");
                    self.shake();
                }
            )
        }else {
            $("#showInfo").showMsg("请先选择聊天的好友");
        }
    },
    //获取所有群聊
    getAllChatRoom:function(){
        var self = this;
        Ajax(
            "GET",
            "chatRoom",
            null,
            function(res){
                app.allChatRoom = res.data;
                self.showAllChatRoom();
            }
        )
        return this;
    },
    //显示所有群聊
    showAllChatRoom:function(){
        var html = '';
        for(var key in this.allChatRoom){
            html += '<div class="well well-xs chatRoomClick" style="clear:both;cursor:pointer;">'+
                    '<input type="hidden" class="chatRoomId" value="'+this.allChatRoom[key].roomId+'">'+
                    '<div class="col-sm-3">'+
                    '<div class="btn-group">'+
                        '<button type="button" id="userStatus" class="btn btn-primay btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                            '<img src="img/bak.jpg" style="height:30px;">'+
                        '</button>'+
                        '<ul class="dropdown-menu">'+
                            '<li><a onclick="changeStatus(this)" >退出群聊&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+
                            '<li><a onclick="changeStatus(this)" >查看成员&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                        '</ul>'+
                    '</div>'+

                    '</div>'+
                    '<strong class="friendName">'+this.allChatRoom[key].roomName+

                    '</strong>'+
                    '</div>';
        }
        $("#allChatRoom").html(html);
    }

};
var app = Object.create(webChat);
