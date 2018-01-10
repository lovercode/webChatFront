function Ajax(type, url, data, success, failed){
    // 创建ajax对象
    var pre_url = "http://127.0.0.1:8080/webChat/";
    $.ajax({
            type: type,
            url: pre_url+url,
            data: JSON.stringify(data),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            xhrFields: {
                      withCredentials: true
             },
            crossDomain: true,
            success: function(res){
                if(res.code == 200)
                {

                }else if(res.code==302){
                    window.location.href="http://127.0.0.1/webChat/index.html";
                }else {
                    $("#showInfo").showMsg(res.msg);
                }
                success(res);

            },
            error:function(res){
                $("#showInfo").showMsg("服务器错误");
            }

    });
}

(function ($) {
      $.fn.serializeJson = function () {
          var serializeObj = {};
          $(this.serializeArray()).each(function () {
              serializeObj[this.name] = this.value;
          });
          return serializeObj;
      };

})(jQuery);
$.fn.showMsg = function (msg) {
    $(this).modal("show");
    $(this).find(".modal-title").html(msg);
};
(function($) {
  $.extend({
    myTime: {
      /**
       * 当前时间戳
       * @return <int>    unix时间戳(秒)
       */
      CurTime: function(){
        return Date.parse(new Date())/1000;
      },
      /**
       * 日期 转换为 Unix时间戳
       * @param <string> 2014-01-01 20:20:20 日期格式
       * @return <int>    unix时间戳(秒)
       */
      DateToUnix: function(string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
            )).getTime() / 1000;
      },
      /**
       * 时间戳转换日期
       * @param <int> unixTime  待时间戳(秒)
       * @param <bool> isFull  返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
       * @param <int> timeZone  时区
       */
      UnixToDate: function(unixTime, isFull, timeZone) {
        if (typeof (timeZone) == 'number')
        {
          unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
        }
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += time.getUTCFullYear() + "-";
        ymdhis += (time.getUTCMonth()+1) + "-";
        ymdhis += time.getUTCDate();
        if (isFull === true)
        {
          ymdhis += " " + time.getUTCHours() + ":";
          ymdhis += time.getUTCMinutes() + ":";
          ymdhis += time.getUTCSeconds();
        }
        return ymdhis;
      }
    }
  });
})(jQuery);
