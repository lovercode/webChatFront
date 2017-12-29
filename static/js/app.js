var webChat = {
    name:"webChat",
    menu:"",
    friends:"",
    myInfo:"",
    otherInfo:"",
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
    showMenu:function() {
        var data = [];
        var html = "";
        for(var key in this.friends)
        {
            html += '<div style="clear:both">'+
                '<div style="width:40%;float:left;margin:0px;padding:0px;"><hr style="height:20px;"/></div>'+
                '<div style="width:20%;float:left;text-align:center">'+this.friends[key].gFgroup.groupName+'</div>'+
                '<div style="width:40%;float:right;margin:0px;padding:0px;"><hr style="height:20px;"/></div>'+
                '</div>';
                var friend = "";
                for(var key1 in this.friends[key].friends)
                {
                    friend += '<div class="well well-xs" style="clear:both;">'+
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
                            '<strong>'+this.friends[key].friends[key1].friendId+

                            '</strong>'+
                            '</div>';
                }
                html += friend;

        }
        // this.menu = data;
        // console.log(data);
        $("#allFriend").html(html);
        return this;
    },
    showMyInfo:function() {
        $("#userName").html(this.myInfo.userName);
        $("#userEmail").html(this.myInfo.userEmail);
        $("#userEmail").attr("href","mailto:"+this.myInfo.userEmail);
        $("#userWordName").html(this.myInfo.userName);

    },
    changeStatus:function(status){

    },
    logOut:function(){
        Ajax("GET","user/logout",null,function(res) {
            $("#showInfo").showMsg(res.msg);
        });
    }
};
var app = Object.create(webChat);
