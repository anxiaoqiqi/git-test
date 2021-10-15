
  var app = new Vue({
        el: '#wrap',
        data: {
            list:[],
            message: 'Hello Vue!',
            startUrl: 'https://www.suki.shop/api-RibbonManager',
            id:"",//8d541ecb2f6d462894c1a694bbd95b72
            customer:"",//1603026872477795239608848384
            parentId:"",
            programType:"",//{fenxiao}
            listCard:{},
            cardShow:false,
        },
        mounted() {
          let getTimestamp=new Date().getTime();
          let dz_url = window.location.href.split("?")
          if(dz_url.length>1){
             var opt = decodeURIComponent(dz_url[1]);
             var cs_arr = opt.split('&');                    //参数字符串分割为数组
             var cs={};
             for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
                 cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
             }
            if(cs.timestamp){
              this.id = cs.id; 
              this.customer =cs.customer; 
              this.parentId = cs.parentId; 
              this.programType =cs.programType
              this.logins()
              this.initSwiper()
            }else{
              let new_url=window.location.href+"&timestamp="+getTimestamp
              location.replace(new_url)
            }
          }else{
            wx.miniProgram.navigateTo({url: '/pages/login/main'})
          }
        },
        methods: {
     
          goList(){
            let that = this;
            $.post(that.startUrl + "/drawSettingsLuckDraw/recordList",{
              drawSettingsId: that.id,
              customerId:that.customer
            }, (data) => {
                if (data.code != 200) {
                  that.listCard={}
                  $("#error_rule").show();
                  setTimeout(function(){$("#error_rule").hide()},2000);
                  $(".error_mark p").html(data.msg)
                } else {
                  that.listCard=data.data[0]
                  that.cardShow=true;
                }
            });
          },
          goMy(){
            wx.miniProgram.navigateTo({url: '/pages/orderPackages/couponCenter/main'})
          },
          goHistory(){
            window.location.href = 'list.html?id='+this.id+"&customer="+encodeURI(this.customer)+"&programType="+encodeURI(this.programType);

          },
          close(){
            this.cardShow=false;
          },
          logins() {
              let that = this
              $.post(that.startUrl + "/small/drawSettings/findByIdForGame",{id: that.id}, (data) => {
                  if (data.code != 200) {
                    that.$message(data.msg);
                  } else {
                    that.list=data.details
                  }
              });
          },
          initSwiper(){
            setTimeout(()=>{
            var mySwiper = new Swiper ('.swiper-container', {
            loop: true,
            direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
            loop: true,//是否循环
            // 自动播放时间
            autoplay:true,
            // 播放的速度
            speed:2000,
            slidesPerView: "auto",//自动根据slides的宽度来设定数量
            autoplay :{
                 //防止拖拽后无法自动滑动
                 disableOnInteraction:false,
                 delay:4000
            },
            // //防止拖拽后无法自动滑动
            // observer:true,
            // observeParents:true,
            // observeSlideChildren:true,
            })  
            },300)
          
          }
        }
    })   
