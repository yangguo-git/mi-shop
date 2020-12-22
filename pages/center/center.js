var httpUtil = require('../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    avator:'../../img/photo.png',
    name:'',
    isDisabled:false,
    isfukuan:false,
    isfukuanChang:false,
    fukuanNum:'',
    isfaHuo:false,
    isfaHuoChang:false,
    fahuoNum:'',
    isshouHuo:false,
    isshouHuoChang:false,
    shouhuoNum:'',
    iswanCheng:false,
    iswanChengChang:false,
    wanchengNum:'',
    isshouHou:false,
    isshouHouChang:false,
    shouhouNum:''
  },
  nav_xuni_orderList(e){
    const orderStatus =  e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/member/xuni_orderList/xuni_orderList?orderStatus='+orderStatus,
    })
  },
  selectOrder:function(e){
    const status =  e.currentTarget.dataset.status;
    let infoAccess = wx.getStorageSync('infoAccess');
    switch(status*1){
      case 1:
          wx.navigateTo({
            url: "/pages/member/orderList/orderList?id=1111"
          })
        break;
      case 2:
          wx.navigateTo({
            url: "/pages/member/unpaidList/unpaidList"
          })
        break;
      case 3:
          wx.navigateTo({
            url: "/pages/member/receiptList/receiptList"
          })
        break;
      case 4:
          wx.navigateTo({
            url: "/pages/member/aftersaleList/aftersaleList"
          })
        break;
      case 5:
          wx.navigateTo({
            url: "/pages/member/addressManage/addressManage?isCenter=2"
          })
        break;
        case 12:
          wx.navigateTo({
            url: "/pages/member/waitSend/waitSend"
          })
        break;
        case 16:
          wx.navigateTo({
            url: "/pages/member/finishOrder/finishOrder"
          })
        break;
        case 8:
        if(infoAccess){
          wx.showToast({
            title:'该功能暂未开放',
            icon: 'none',
            duration: 1000
          })
        }else{
          wx.showToast({
            title:'该功能暂未开放',
            icon: 'none',
            duration: 1000
          })
        }
        break;
        case 9:
        if(infoAccess){
          wx.showToast({
            title:'该功能暂未开放',
            icon: 'none',
            duration: 1000
          })
        }else{
          wx.showToast({
            title:'该功能暂未开放',
            icon: 'none',
            duration: 1000
          })
        }
        break;
        case 10:
        if(infoAccess){
          wx.showToast({
            title:'该功能暂未开放',
            icon: 'none',
            duration: 1000
          })
          
        }else{
          wx.showToast({
            title:'该功能暂未开放',
            icon: 'none',
            duration: 1000
          })
        }
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let initUsers = wx.getStorageSync('userInfos');
    if(initUsers){
      var initUsersObj = JSON.parse(initUsers);
      if(initUsersObj.nickName && initUsersObj.headUrl){
        that.setData({
          name:initUsersObj.nickName,
          avator:initUsersObj.headUrl,
          isDisabled:true
        });
      }else{
        that.setData({
          name:'登录',
          avator:'../../img/photo.png',
          isDisabled:false
        });
      }
    }else{
      that.setData({
        name:'登录',
        avator:'../../img/photo.png',
        isDisabled:false
      });
    }
    //获取各个角标
    // let infoAccess = wx.getStorageSync('infoAccess');
    // if(infoAccess){
    //   that.getJiaonum();
    // }
  },
  getJiaonum:function(){
    let that = this;
    //查询所有的订单状态开始
    let infoAccess = wx.getStorageSync('infoAccess');
    if(infoAccess){
      httpUtil.getData('/minip/order', {},'', function(res){
        if(!res.data){
          if(res.status == "20002"){
            // wx.showToast({
            //   title: res.msg || '系统繁忙，请稍候再试',
            //   icon: 'none',
            //   duration: 1000
            // });
          }
          return;
        };
        //获取各个状态的订单数量
        let allOrders = res.data;
        let fukuanArr = [];//101
        let fahuoArr = [];//301
        let shouhuoArr = [];//302
        let wanchengArr = [];//304
        let tuikuanArr = [];//401  402
        allOrders.forEach(function(objs){
            if(objs.orderStatus == 101){
              fukuanArr.push(objs);
            }else if(objs.orderStatus == 301){
              fahuoArr.push(objs);
            }else if(objs.orderStatus == 302){
              shouhuoArr.push(objs);
            }else if(objs.orderStatus == 304){
              wanchengArr.push(objs);
            }else if(objs.orderStatus == 401 || objs.orderStatus == 402){
              tuikuanArr.push(objs);
            }
        })
        //待付款
        if(fukuanArr.length>0){
          let getNum = fukuanArr.length;
          if(getNum>10){
            that.setData({
              isfukuanChang:true,
              isfukuan:false
             })
          }else{
            that.setData({
              isfukuanChang:false,
              isfukuan:true
            })
          }
        }else{
           that.setData({
            isfukuanChang:false,
            isfukuan:false
           })
        }
        //待发货
        if(fahuoArr.length>0){
          let getNum = fahuoArr.length;
          if(getNum>10){
            that.setData({
              isfaHuo:false,
              isfaHuoChang:true
            })
          }else{
            console.log('duan');
            that.setData({
              isfaHuo:true,
              isfaHuoChang:false
            })
          }
        }else{
          that.setData({
            isfaHuo:false,
            isfaHuoChang:false
          })
        }
        //待收货
        if(shouhuoArr.length>0){
          let getNum = shouhuoArr.length;
          if(getNum>10){
            that.setData({
              isshouHuo:false,
              isshouHuoChang:true
            })
          }else{
            that.setData({
              isshouHuo:true,
              isshouHuoChang:false
            })
          }
        }else{
          that.setData({
            isshouHuo:false,
            isshouHuoChang:false
          })
        }
        //已完成
        // if(wanchengArr.length>0){
        //   let getNum = wanchengArr.length;
        //   if(getNum>10){
        //     that.setData({
        //       iswanCheng:false,
        //       iswanChengChang:true
        //     })
        //   }else{
        //     that.setData({
        //       iswanCheng:true,
        //       iswanChengChang:false
        //     })
        //   }
        // }else{
        //   that.setData({
        //     iswanCheng:false,
        //     iswanChengChang:false
        //   })
        // }
        //退款
        // if(tuikuanArr.length>0){
        //   let getNum = tuikuanArr.length;
        //   if(getNum>10){//
        //     that.setData({
        //       isshouHou:false,
        //       isshouHouChang:true
        //     })
        //   }else{
        //     that.setData({
        //       isshouHou:true,
        //       isshouHouChang:false
        //     })
        //   }
        // }else{
        //   that.setData({
        //     isshouHou:false,
        //     isshouHouChang:false
        //   })
        // }
        //设置相关数据
        that.setData({
          fukuanNum:fukuanArr.length,
          fahuoNum:fahuoArr.length,
          shouhuoNum:shouhuoArr.length,
          wanchengNum:wanchengArr.length,
          shouhouNum:tuikuanArr.length,
        });
      }, function(res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
      })

    }
    //结束
  },
  onShow: function () {
    //获取各个角标
    let infoAccess = wx.getStorageSync('infoAccess');
    if(infoAccess){
      this.getJiaonum();
    }
  },
  bindGetUserInfo:function (e) {//点击登录按钮
    var saveThat = this;
    var wxLogin = httpUtil.wxLogin();
    wxLogin().then((res) => {
      console.log(res)
      let params = {
        code: res.code,
        raw_data: e.detail.rawData ||'',
        signature: e.detail.signature ||'',
        encrypt_data: e.detail.encryptedData||'',
        iv: e.detail.iv||''
      };
      httpUtil.postData('/minip/login', params, '加载中',function (res){
        console.log(res.data);
        if (!res.data) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          })
          return;
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
          var longinStr = res.data;
          if(longinStr.infoInside){
            wx.setStorageSync('infoAccess',res.data.infoInside);
            wx.setStorageSync('userInfos',JSON.stringify(res.data));
            if(longinStr.nickName && longinStr.headUrl){
              saveThat.setData({
                name:longinStr.nickName,
                avator:longinStr.headUrl,
                isDisabled:true
              });
            }
            
          }
          //跳转到首页
          wx.switchTab({
            url: '/pages/center/center',
          })

        }

      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      }, 1)
    });
  },
  handleContact:function(e){
    console.log(e)
  },
  callPhone:function(){//联系客服
    wx.makePhoneCall({
      phoneNumber: '18500641006',
    })
  },
  goCustomer:function(){
    wx.navigateTo({
      url: '/pages/member/commonProblem/commonProblem' // 指定页面的url
    });
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options ) {
    let shareContent = wx.getStorageSync('shareContent');
    var sharePost,shareImg;
    if(shareContent){
      sharePost = JSON.parse(shareContent);
      shareImg = sharePost[0].imgLink;
    }
    let shareObj = {
       title: "用联通积分就能买",
　　　　path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
       imageUrl:'../../img/shareimg.png',
　　　　success: function(res){// 转发成功回调
　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
　　　　　　}
　　　　},
       fail: function(){// 转发失败的回调
　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){// 用户取消转发
　　　　　　　　
　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){// detail message 为详细失败信息
　　　　　　　　
　　　　　　}
　　　　}

    }

    return shareObj;

  }

})