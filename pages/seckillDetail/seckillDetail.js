var httpUtil = require('../../utils/httpUtil');
var util = require('../../utils/util');
var config = httpUtil.config;
const app = getApp();
Page({
  data: {
    phoneNumber: '',
    btnFlag: false,
    swipersArr:[],
    indicatorDots: true,  
    indicatorColor: '#fff',
    indicatorActiveColor: '#07c160',
    autoplay: true,
    interval: 5000,
    duration: 500,
    detailObj:{},
    buyText:'立即购买',
    isDisabled:false
  },
  //生命周期函数
  onLoad: function (options) {

    this.loginRequest();

    if (options.detail) {
      let postItem = JSON.parse(decodeURIComponent(options.detail));
      this.setData({
        detailObj: postItem,
        swipersArr: JSON.parse(postItem.headerUrl)
      })
    }

    //缓存
    let getstorePhone = wx.getStorageSync('savegetPhone');
    if(getstorePhone){
      this.setData({
        phoneNumber: getstorePhone,
        btnFlag:true
      })
    }

    //判断手机
    let getClient = wx.getStorageSync('client');
    if(getClient == 'ios' || getClient == 'IOS'){
      this.setData({
        buyText:'由于相关规范,IOS功能暂不可用',
        isDisabled:true
      })
    }else{
      this.setData({
        buyText:'立即购买',
        isDisabled:false
      })
    }


  },
  loginRequest:function() {
    var wxLogin = httpUtil.wxLogin();
    wxLogin().then((res) => {
      let params = {
        code: res.code
      };
      httpUtil.postData('/minip/login', params, '', function (res) {
        if (res.data) {
          if(res.data.infoInside){
            wx.setStorageSync('infoAccess',res.data.infoInside);
          }
        }

      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      }, 1)
    })
    
  },
  nowBuying: function () {//立刻购买必须先登录
     //判断手机
    //  let getClient = wx.getStorageSync('client');
    //  if(getClient == 'ios' || getClient == 'IOS'){
    //    wx.showModal({
    //      title: '提示',
    //      showCancel:false,
    //      confirmText:'我知道了',
    //      content: '由于相关规范,IOS功能暂不可用',
    //      success (res) {
    //        if (res.confirm) {
 
    //        }
    //      }
    //    })
    //    return;
    //  }
     //判断手机
    let that = this;
    let infoAccess = wx.getStorageSync('infoAccess');
    console.log(infoAccess);
    if (infoAccess) {
      if (that.data.phoneNumber == '') {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      //手机号正则验证
      var phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(that.data.phoneNumber)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      //微信支付
      var paydata = {
        productId: this.data.detailObj.productId,
        number: this.data.phoneNumber,
        price: this.data.detailObj.productPrice,
        myCouponId: ''
      }
      console.log('paydata', paydata);
      var url = config.reqUrl + '/v1/product/getPayConfig.do';
      util.request(url, 'post', paydata, '加载中', function (res) {
        if (!res.data) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
          return;
        };
        if (res.data.success == true) {
          wx.requestPayment({
            'timeStamp': res.data.body.timeStamp,
            'nonceStr': res.data.body.nonceStr,
            'package': res.data.body.wxPackage,
            'signType': res.data.body.signType,
            'paySign': res.data.body.paySign,
            'success': function (res) {
              wx.redirectTo({
                url: "/pages/member/xuni_orderList/xuni_orderList?orderStatus=3"
              })
            }
          })
        } else {
          if (res.data.msg) {
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg,
            })
          }
        }
      }, function (e) {
        wx.showToast({
          title: '网络错误,请稍后再试。。。',
          icon: 'none'
        })
      })

    }else{
      wx.navigateTo({
        url: '/pages/logs/logs'
      })
    }
  },
  changePhone: function () {//切换手机
    this.setData({
      phoneNumber: ''
    })
  },
  
  input_phone: function (e) {
    this.setData({
      phoneNumber: e.detail.value.trim()
    });
  },
  getPhoneNumber: function (e) {//获取手机号

    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      let that = this;
      let params = {
        encrypt_data: e.detail.encryptedData,
        iv: e.detail.iv
      }
      httpUtil.postData('/minip/phone', params, '', function (res) {
        if (!res.data) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          })
          // 跳转到登录页
          wx.navigateTo({
            url: "/pages/logs/logs"
          })
          return;
        }
        //获取到手机
        if (res.data) {
          that.setData({
            phoneNumber: res.data,
            btnFlag: true
          })
          wx.setStorageSync('savegetPhone', res.data);
        }
      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      }, 1)
      return;

    }

  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})