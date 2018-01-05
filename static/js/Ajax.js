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
