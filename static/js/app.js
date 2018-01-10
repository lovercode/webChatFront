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
    activeChatPageNum:-1,
    //所有群聊
    allChatRoom:"",
    //当前聊天群
    activeChatRoomId:"",
    //聊天类型，群聊还是单独
    chatType:0,
    //当前正在处理的用户请求id
    validateUserId:"",
    //添加群聊成员的群id
    addChatRoomUserRoomId:"",
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
                '<div style="width:20%;float:left;text-align:center">'+
                    '<div class="btn-group">'+

                        '<a class="dropdown-toggle" style="cursor:pointer;" data-toggle="dropdown" name="'+this.friends[key].gFgroup.groupId+'">'+this.friends[key].gFgroup.groupName+'</a>'+
                        '<ul class="dropdown-menu">'+
                            '<li><a style="cursor:pointer;" onclick="deleteGroup(\''+this.friends[key].gFgroup.groupId+'\')">删除分组&nbsp;&nbsp;<span class="glyphicon glyphicon-remove-sign"></span></a></li>'+
                            // '<li><a onclick="deleteFriend(\''+this.friends[key].friends[key1].friendId+'\')">删除好友&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                            // '<li><a onclick="changeStatus(this)" >拉黑好友&nbsp;&nbsp;<span class="glyphicon glyphicon-remove-sign"></a></li>'+
                        '</ul>'+
                    '</div>'+

                '</div>'+
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
                                // '<button type="button" id="userStatus" class="btn btn-primay btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                    '<img class="dropdown-toggle" data-toggle="dropdown" src="'+this.friends[key].friends[key1].friendInfo.userImg+'" style="width:50px;height:50px;border-radius:50%;">'+
                                // '</button>'+
                                '<ul class="dropdown-menu">'+
                                    '<li><a onclick="viewFriend(\''+this.friends[key].friends[key1].friendId+'\')">查看信息&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+
                                    '<li><a onclick="deleteFriend(\''+this.friends[key].friends[key1].friendId+'\')">删除好友&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                                    // '<li><a onclick="changeStatus(this)" >拉黑好友&nbsp;&nbsp;<span class="glyphicon glyphicon-remove-sign"></a></li>'+
                                '</ul>'+
                            '</div>'+

                        '</div>'+
                        '<strong class="friendName">'+this.friends[key].friends[key1].friendInfo.userName+
                        '('+this.friends[key].friends[key1].friendInfo.userStatus+')'+
                        '</strong>'+
                        '<p>'+
                        this.friends[key].friends[key1].friendInfo.userWord+
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
        $("#myImg").attr("src",this.myInfo.userImg);
        $("#userEmail").attr("href","mailto:"+this.myInfo.userEmail);
        $("#userWordName").html(this.myInfo.userName);
        $("#userStatus").text(this.myInfo.userStatus);

        $("#uuserName").val(this.myInfo.userName);
        $("#uuserAge").val(this.myInfo.userAge);
        $("#uuserRealName").val(this.myInfo.userRealName);
        $("#uuserQq").val(this.myInfo.userQq);
        $("#uuserWord").val(this.myInfo.userWord);
        $("#userImgBtn").attr("src",this.myInfo.userImg);
        $("#uuserImg").val(this.myInfo.userImg);



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
                    var newDate = new Date();

                    for(var key in res.data){
                        newDate.setTime(res.data[key].chatTime);
                        if(res.data[key].chatType == "抖一抖"){
                            app.addMsgToDiv('<p style="color:red">对方抖了你一下</p>',"left",newDate.toLocaleString());
                            app.shake();
                        }else{
                            app.addMsgToDiv(res.data[key].chatInfo,"left",newDate.toLocaleString());
                        }
                    }

                }
            )
        }
    },
    //获取当前群聊对象的未读消息
    getMsgWithRoom: function(){
        if(app.chatType == 2 && app.activeChatRoomId != ""){
            Ajax(
                "POST",
                "chat/getByRoom",
                {roomId:app.activeChatRoomId},
                function(res) {
                    var newDate = new Date();
                    for(var key in res.data){
                        newDate.setTime(res.data[key].chatTime);
                        var html =
                        '<div class="btn-group">'+

                                '<img class="dropdown-toggle" data-toggle="dropdown" src="'+res.data[key].fromUserInfo.userImg+'" style="width:40px;height:40px;border-radius:50%;">&nbsp;&nbsp;&nbsp;'+

                            '<ul class="dropdown-menu">'+
                                '<li><a onclick="viewFriend(\''+res.data[key].chatFrom+'\')">查看信息&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+
                                '<li><a onclick="deleteFriend(\''+res.data[key].chatFrom+'\')">删除好友&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                            '</ul>'+
                        '</div><b>'+
                        res.data[key].fromUserInfo.userName+
                        '</b>&nbsp;&nbsp;&nbsp;<button type="button" value="'+res.data[key].chatFrom+'" class="btn btn-primary btn-xs addFriendBtnOk"><span class="glyphicon glyphicon-plus"></span>'+
                        '</button>'+
                        "<br><br>";
                        app.addMsgToDiv(html+res.data[key].chatInfo,"left",newDate.toLocaleString());
                    }

                }
            )
        }
    },
    //添加信息到聊天框
    addMsgToDiv:function(msg,direction,time) {
        var html = '<div class="well well-sm col-sm-6" style="float:'+
                    direction
                    +'">'+
                    '<p style="font-size:10px">'+time+'</p>'+
                    msg+
                    '</div>'+
                    '<div  style="clear:both;" >';
        app.chatDiv.append(html);
        app.chatDiv.scrollTop(app.chatDiv.position().top+app.chatDiv.scrollTop());

    },
    //历史消息显示
    addHistoryMsg:function(msg,direction,time){
        var html = '<div class="well well-sm col-sm-6" style="float:'+
                    direction
                    +'">'+
                    '<p style="font-size:10px">'+time+'</p>'+
                    msg+
                    '</div>'+
                    '<div  style="clear:both;" >';
        // $("#historyMsgDiv").append(html);
        $($("#historyMsgDiv").children("div").get(0)).before(html);
    },
    //发送消息
    sendMsgToUser:function(){
        var self = this;
        // var timestamp = Date.parse(new Date());
        if(app.chatType == 1 && app.activeChatUserId != ""){
            Ajax(
                "POST",
                "chat",
                {
                    chatInfo:app.editor.txt.html(),
                    chatTo:app.activeChatUserId
                },
                function(res) {
                    self.addMsgToDiv(app.editor.txt.html(),"right",new Date());
                }
            )
        }else if(app.chatType == 2 && app.activeChatRoomId != ""){
            Ajax(
                "POST",
                "chat/sendMsgToChatRoom",
                {
                    chatInfo:app.editor.txt.html(),
                    chatTo:app.activeChatRoomId
                },
                function(res) {
                    if(res.code == 200){

                        self.addMsgToDiv(app.editor.txt.html(),"right",new Date());
                    }
                }
            )
        }else {
            $("#showInfo").showMsg("请先选择聊天对象");
        }
    },
    //发送抖一抖消息
    sharkUser: function(){
        var self = this;
        if(app.chatType == 1){
            if(app.activeChatUserId != ""){
                Ajax(
                    "POST",
                    "chat/sharkUser",
                    {
                        chatTo:app.activeChatUserId
                    },
                    function(res) {
                        self.addMsgToDiv('<p style="color:red">你抖了对方一下</p>',"right",new Date());
                        self.shake();
                    }
                )
            }else{
                $("#showInfo").showMsg("请先选择好友");
            }
        }else if(app.chatType == 2){
            $("#showInfo").showMsg("群消息无法发送抖一抖");
        }else{
            $("#showInfo").showMsg("请先选择好友");
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
            html += '<div class="well well-xs chatRoomClick row" style="clear:both;cursor:pointer;">'+
                    '<input type="hidden" class="chatRoomId" value="'+this.allChatRoom[key].roomId+'">'+
                    '<div class="col-sm-3">'+
                    '<div class="btn-group">'+
                        // '<button type="button" id="userStatus" class="btn btn-primay btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                            '<img class="dropdown-toggle" data-toggle="dropdown"  src="img/bak.jpg" style="height:50px;width:50px;border-radius:50%;">'+
                        // '</button>'+
                        '<ul class="dropdown-menu">'+
                            '<li class="addChatRoomUser"><span style="display:none" class="roomId">'+
                            this.allChatRoom[key].roomId+
                            '</span><a>添加成员&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+

                            '<li class="exitChatRoom"><span style="display:none" class="roomId">'+
                            this.allChatRoom[key].roomId+
                            '</span><a>退出群聊&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+

                            '<li class="roomUserInfo"><span style="display:none" class="roomId">'+
                            this.allChatRoom[key].roomId+
                            '</span><a>查看成员&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                        '</ul>'+
                    '</div>'+

                    '</div>'+
                    '<strong class="chatRoomName">'+this.allChatRoom[key].roomName+

                    '</strong>'+
                    '</div>';
        }
        $("#allChatRoom").html(html);
    },
    //获取未处理消息
    getNeedDealMsg:function(){
        Ajax(
            "POST",
            "chat/getNoReadMsg",
            null,
            function(res){
                var sum = 0;
                // sum = eval(res.data.userMsg).length+
                //     eval(res.data.chatRoomMsg).length+
                //     eval(res.data.userDouMsg).length+
                //     eval(res.data.validateMsg).length;

                html = '';
                for(var key in res.data.userMsg)
                {
                    html += '<li class="userMsgNeedDeal" style="cursor:pointer;"><p class="id" hidden>'+
                            res.data.userMsg[key].chatFrom+'</p><a><span class="badge">好友</span>&nbsp;<span class="name">'+
                            res.data.userMsg[key].fromUserInfo.userName+
                            '</span>&nbsp;&nbsp;<span class="badge" id="needDealSum">'+
                            res.data.userMsg[key].sum+
                            '</span></a></li>';
                    sum += res.data.userMsg[key].sum;
                }
                for(var key in res.data.chatRoomMsg)
                {
                    html += '<li class="chatRoomMsgNeedDeal" style="cursor:pointer;"><p class="id" hidden>'+
                            res.data.chatRoomMsg[key].chatTo+'</p><a><span class="badge">群</span>&nbsp;<span class="name">'+
                            res.data.chatRoomMsg[key].chatRoom.roomName+
                            '</span>&nbsp;&nbsp;<span class="badge" id="needDealSum">'+
                            res.data.chatRoomMsg[key].sum+
                            '</span></a></li>';
                    sum += res.data.chatRoomMsg[key].sum;
                }
                for(var key in res.data.validateMsg)
                {
                    html += '<li class="validateMsgNeedDeal" style="cursor:pointer;"><p class="id" hidden>'+
                            res.data.validateMsg[key].userId+'</p><a><span class="badge">好友请求</span>&nbsp;<span class="name">'+
                            res.data.validateMsg[key].friendInfo.userName+
                            '</span>&nbsp;&nbsp;<span class="badge" id="needDealSum">'+
                            res.data.validateMsg[key].validateInfo+
                            '</span>'+
                            '&nbsp;&nbsp;<button type="button" class="btn btn-primary btn-xs agreeAddFriend" value="'+
                            res.data.validateMsg[key].userId+
                            '">同意</button>'+
                            '&nbsp;&nbsp;<button type="button" class="btn btn-danger btn-xs disAgreeAddFriend" value="'+
                            res.data.validateMsg[key].userId+
                            '">拒绝</button>'+
                            '</a></li>';
                }
                for(var key in res.data.userDouMsg)
                {
                    app.chatType = 1;
                    app.chatDiv.html("");
                    app.activeChatUserId = res.data.userDouMsg[key].chatFrom;
                    $("#activeUser").html(res.data.userDouMsg[key].fromUserInfo.userName);
                    // html += '<li class="userDouMsgNeedDeal" style="cursor:pointer;"><p class="id" hidden>'+
                    //         res.data.userDouMsg[key].chatFrom+'</p><a><span class="name">'+
                    //         res.data.userDouMsg[key].fromUserInfo.userName+
                    //         '</span>&nbsp;&nbsp;<span class="badge" id="needDealSum">'+
                    //         res.data.userDouMsg[key].sum+
                    //         '</span></a></li>';
                    // sum += res.data.userDouMsg[key].sum;
                }
                sum += eval(res.data.validateMsg).length;
                // alert(sum);
                $("#needDealSum").text(sum);
                $("#allNeedDealMsg").html(html);
                // for(var key in res.data){
                //
                // }
            }
        )
    },
    //处理验证消息
    dealValidateMsg:function(status){
        Ajax(
            "POST",
            "friend/dealValidate",
            {
                status:status,
                groupId:$("#dealValidateGroup").val(),
                friendId:app.validateUserId
            },
            function(res){
                if(res.code == 200){
                    $("#showInfo").showMsg(res.msg);
                    $("#dealValidateModal").modal("hide");
                    app.getMenu().getMyInfo().getAllChatRoom();
                }
            }
        )
    },
    //添加群
    addChatRoom:function(){
        Ajax(
            "POST",
            "chatRoom",
            $("#chatRoomFrom").serializeJson(),
            function(res){
                $("#addChatRoomModal").modal("hide");
                $("#showInfo").showMsg(res.msg);
                app.getMenu().getMyInfo().getAllChatRoom();
            }
        )
    },
    //
    addChatRoomUserFind:function(){
        Ajax(
            "POST","user/search",
            {key:$("#addChatRoomUserKey").val()},
            function(res){
                if(res.code != 200)
                {
                    $("#addChatRoomUserModal").modal("hide");
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
                                    '<button type="button" id="userStatus" value="'+res.data[key].userId+'" class="btn btn-danger btn-xs addChatRoomUserOk">添加该用户'+
                                    '</button>'+
                                '</div>'+
                            '</div>';
                }
                $("#addChatRoomUserRes").html(html);
            }
        )
    },
    //添加群成员
    addChatRoomUser:function(userId){
        Ajax(
            "POST",
            "chatRoom/addChatRoomUser",
            {
                userId:userId,
                roomId:app.addChatRoomUserRoomId
            },
            function(res){
                $("#addChatRoomUserModal").modal("hide");
                $("#showInfo").showMsg(res.msg);
            }
        )
    },
    //退出群聊
    exitChatRoom:function(id){
        Ajax(
            "POST",
            "chatRoom/exitChatRoom",
            {
                roomId:id
            },
            function(res) {
                $("#showInfo").showMsg(res.msg);
                app.getMenu().getMyInfo().getAllChatRoom();
            }
        )
    },
    getRoomUserInfo:function(id){
        Ajax(
            "POST",
            "chatRoom/chatRoomUser",
            {
                roomId:id
            },
            function(res){
                var html = '';
                var i = 1;
                for(var key in res.data){
                    html += '<tr>'+
                        '<td>'+(i++)+'</td>'+
                        '<td>'+res.data[key].userName+'</td>'+
                        '<td>'+res.data[key].userType+'</td>'+
                        '<td>'+
                        '<button type="button" class="btn btn-danger addFriendBtnOk" value="'+res.data[key].userId+'" data-dismiss="modal">加好友</button>'+'</td>'+
                    '</tr>';
                }
                $("#roomUserInfo").html(html);
            }
        )
    },
    getHistoryMsgUser:function(){
        Ajax(
            "POST",
            "chat/findHistoryMsg",
            {
                userId:app.activeChatUserId,
                pageNum:app.activeChatPageNum
            },
            function(res) {
                for(var key in res.data){
                    var newDate = new Date();
                    newDate.setTime(res.data[key].chatTime);
                    if(res.data[key].chatFrom == app.myInfo.userId){
                        app.addHistoryMsg(res.data[key].chatInfo,"right",newDate.toLocaleString());
                    }else{
                        app.addHistoryMsg(res.data[key].chatInfo,"left",newDate.toLocaleString());
                    }
                }
                if(eval(res.data).length == 0){
                    $("#showInfo").showMsg("没有了");
                    $("#historyMsgModal").modal("hide");
                }
            }
        )
    },
    getRoomHistoryMsgUser:function(){
        Ajax(
            "POST",
            "chat/findRoomHistoryMsg",
            {
                roomId:app.activeChatRoomId,
                pageNum:app.activeChatPageNum
            },
            function(res) {
                for(var key in res.data){
                    var newDate = new Date();
                    newDate.setTime(res.data[key].chatTime);
                    // var html = '<img src="'+res.data[key].fromUserInfo.userImg+'" style="width:30px;height:30px;border-radius:50%;">&nbsp;&nbsp;&nbsp;'+res.data[key].fromUserInfo.userName+":<br><br>";
                    var html =
                    '<div class="btn-group">'+

                            '<img class="dropdown-toggle" data-toggle="dropdown" src="'+res.data[key].fromUserInfo.userImg+'" style="width:40px;height:40px;border-radius:50%;">&nbsp;&nbsp;&nbsp;'+

                        '<ul class="dropdown-menu">'+
                            '<li><a onclick="viewFriend(\''+res.data[key].chatFrom+'\')">查看信息&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open"></span></a></li>'+
                            '<li><a onclick="deleteFriend(\''+res.data[key].chatFrom+'\')">删除好友&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-close"></a></li>'+
                        '</ul>'+
                    '</div><b>'+
                    // '<img src="'+res.data[key].fromUserInfo.userImg+'" style="width:30px;height:30px;border-radius:50%;">&nbsp;&nbsp;&nbsp;<b>'+
                    res.data[key].fromUserInfo.userName+
                    '</b>&nbsp;&nbsp;&nbsp;<button type="button" value="'+res.data[key].chatFrom+'" class="btn btn-primary btn-xs addFriendBtnOk"><span class="glyphicon glyphicon-plus"></span>'+
                    '</button>'+
                    "<br><br>";
                    if(res.data[key].chatFrom == app.myInfo.userId){
                        app.addHistoryMsg(html+res.data[key].chatInfo,"right",res.data[key].fromUserInfo.userName+":"+newDate.toLocaleString());
                    }else{
                        app.addHistoryMsg(html+res.data[key].chatInfo,"left",res.data[key].fromUserInfo.userName+":"+newDate.toLocaleString());
                    }
                }
                if(eval(res.data).length == 0){
                    $("#showInfo").showMsg("没有了");
                    $("#historyMsgModal").modal("hide");
                }
            }
        )
    },
    getHistoryMsg:function(){
        $("#historyMsgDiv").html('<div style="display:none"></div>');
        app.activeChatPageNum = 0;
        if(app.chatType == 1){
            $("#historyMsgModal").modal('show');
            app.getHistoryMsgUser();
        }else if(app.chatType == 2){
            $("#historyMsgModal").modal('show');
            app.getRoomHistoryMsgUser();

        }else {
            $("#showInfo").showMsg("请先选择聊天对象");
        }
    },
    deleteFriend(id){
        Ajax(
            "POST",
            "friend/deleteFriend",
            {
                friendId:id
            },
            function(res){
                $("#showInfo").showMsg(res.msg);
                app.getMenu().getMyInfo().getAllChatRoom();
            }

        )
    },
    viewFriend:function(id){
        Ajax(
            "POST",
            "friend/getFriendById",
            {
                friendId:id
            },
            function(res){
                $("#friendImg").attr("src",res.data.userImg);
                $("#friendName").html(res.data.userName);
                $("#friendEmail").text(res.data.userEmail);
                $("#friendEmail").attr("href","mailto:"+res.data.userEmail);
                $("#friendWord").html(res.data.userWord);
                $("#friendWordName").html(res.data.userName);
                $("#friendAge").html(res.data.userAge);
                $("#friendStatus").html(res.data.userStatus);
                $("#friendRealName").html(res.data.userRealName);
            }
        )
    },
    deleteGroup:function(id){
        Ajax(
            "POST",
            "fgroup/delete",
            {
                groupId:id
            },
            function(res){
                $("#showInfo").showMsg(res.msg);
            }
        )
    },
    chengeStatus:function(status,html){
        Ajax(
            "POST","user/updateMyInfo",
            {
                userStatus:status
            },
            function(res){
                if(res.code == 200){
                    $("#userStatus").html(html);
                }
                app.getMyInfo();
            }
        );
    }


};
var app = Object.create(webChat);
