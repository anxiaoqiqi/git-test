$(function () {
  let dz_url = window.location.href.split("?")
    if(dz_url.length>1){
      var opt = decodeURIComponent(dz_url[1]);
      var cs_arr = opt.split('&');                       //参数字符串分割为数组
       var cs={};
       for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
           cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
       }
      var id = cs.id; 
      var customer = cs.customer; 
      var programType = cs.programType
    };
      // var id = '8d541ecb2f6d462894c1a694bbd95b72'; 
      // var customer = '1603026872477795239608848384'; 
      // var programType = "{fenxiao}"
  var $cards = $(".box li"),//所有卡牌
      $maskCard = $("#mask-card"),//翻牌遮罩
      length = $cards.length,
      index = length,//轮流滚动的卡牌下标
      data = {count: 5},//次数
      rem = 75,
      initArr = [[34 / rem, 0], [273 / rem, 0], [512 / rem, 0], [34 / rem, 268 / rem], [273 / rem, 268 / rem], [512 / rem, 268 / rem]],//卡牌位置数组
      clickTime = 0,
      bool = false,//首次点击时不能在卡牌归位期间
      timer;//轮流提示定时器

  init();
  function init() {
      //卡牌归位动画
      for (var i = 0; i < length; i++) {
          (function (i) {
              var seat = setTimeout(function () {
                  $cards.eq(i).css({
                      left: initArr[i][0] + "rem",
                      top: initArr[i][1] + "rem"
                  });
                  clearTimeout(seat);
              }, 300 * i);
          })(i);
      }

      //卡牌轮流选中动画
      setTimeout(function () {
          timer = setInterval(function () {
              bool = true;//卡牌归位，可以点击
              $cards.eq(index - 1).removeClass("active");
              index %= 6;
              $cards.eq(index).addClass("active");
              index++;
          }, 1000);
      }, 1000);
  }

  //点击卡牌翻转
  $(".box").on("click", "li", function () {
      if (new Date() - clickTime > 2000 && bool) {//两次点击的间隔不能小于2秒
        $.post("https://www.suki.shop/api-RibbonManager/small/activitySettings/drawSettings/LuckDraw",{
          drawSettingsId: id,
          programType:programType,
          customerId:customer
        }, (data) => {
            if (data.code == 200) {
              $maskCard.show();
              clearInterval(timer);//清除轮流选中动画
              $cards.removeClass("active");//清除轮流滚动类名
              $(this).addClass("open-card");//添加翻牌动画

              //动画监听
              $(this).on("animationend", function () {
                $(this).removeClass("open-card");//移除翻牌动画
                $cards.css({//所有卡牌放到右下角
                    left: 512 / rem + "rem",
                    top: 268 / rem + "rem"
                });
                $maskCard.hide();
                win();
                $(this).off("animationend");//解绑动画监听
              });
            } else {
              $("#error_rule").show();
              setTimeout(function(){$("#error_rule").hide()},2000);
              $(".error_mark p").html(data.msg)
            }
        });
      }
  });

  //中奖信息提示
  $("#close,.win,.btn").click(function () {
      clickTime = new Date();//时间更新
      index = length;//卡牌选中重新从第一张开始
      init();
  });

  //奖品展示
  // var show = new Swiper(".swiper-container", {
  //     direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
  //     loop: true,//是否循环
  //     // 自动播放时间
  //     autoplay:true,
  //     // 播放的速度
  //     speed:2000,
  //     slidesPerView: "auto"//自动根据slides的宽度来设定数量
  // });
  var $maskRule = $("#mask-rule"),//规则遮罩层
    $mask = $("#mask"),//红包遮罩层
    $winning = $(".winning"),//红包
    $card = $("#card"),
    $close = $("#close");
    //link = false;//判断是否在链接跳转中

//规则
// $(".rule").click(function () {
//     $maskRule.show();
// });
// $("#close-rule").click(function () {
//     $maskRule.hide();
// });

/*中奖信息提示*/
function win() {
    //遮罩层显示
    $mask.show();
    $winning.addClass("reback");
    setTimeout(function () {
        $card.addClass("pull");
    }, 500);

    //关闭弹出层
    $("#close,.win,.btn").click(function () {
    //$close.click(function () {
        $mask.hide();
        $winning.removeClass("reback");
        $card.removeClass("pull");
    });
    /*$(".win,.btn").click(function () {
        link = true;
    });*/
  }
  //此处可以在commonjs中合并
function queryString(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results === null) {
      return "";
  }
  else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}
});










