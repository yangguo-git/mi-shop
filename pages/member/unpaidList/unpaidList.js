var httpUtil = require('../../../utils/httpUtil');
Page({
  data: {
    orderList:'',
    orderList:[],
    isShow:false
  },
  onLoad: function (options) {
    let that = this;
    httpUtil.getData('/minip/order', {"orderStatus":101},'加载中', function(res){
      if(!res.data){
        //重新开始
        if(res.status == "20002"){
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
          wx.redirectTo({
            url: "/pages/logs/logs"
          })
        }else{
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        }
        //重新结束
        return;
      };
      let isShow = false;
      if(res.data.length>0){
        isShow = true;
      }
      that.setData({
        orderList:res.data,
        isShow
      });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  lookDetail:function(e){
    console.log(e)
    let orderCode = e.currentTarget.dataset.id;
    let flagMark = e.currentTarget.dataset.mark;
    wx.navigateTo({
      url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode + '&flagMark=' + flagMark + '&fromFlag=666',
    })
  },
  orderPay:function(e){
    let orderCode = e.currentTarget.dataset.id;
    let currentObj = e.currentTarget.dataset.obj;
    let productNormIds = [];
    console.log("currentObj",currentObj)
    //直接支付开始
    let payOrderCode = orderCode;
    for(var i in currentObj.goodsVOList){
      productNormIds.push(
        currentObj.goodsVOList[i].productNormId
      )
    }
    let payTotal = currentObj.payPrice;
    let payParams = {
      orderCode: payOrderCode,
      productNormIds: productNormIds,
      totalFee: payTotal
    }
    console.log(payParams);
    httpUtil.postData('/minip/order/batch/pay', payParams, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      wx.requestPayment({
        'timeStamp': res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': res.data.wxPackage,
        'signType': res.data.signType,
        'paySign': res.data.paySign,
        'success': function (res) {
            wx.redirectTo({
              url: "/pages/member/unpaidList/unpaidList"
            })
        }
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
    //直接支付结束
    // wx.navigateTo({
    //   url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode + '&fromFlag=666',
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    httpUtil.getData('/minip/order', {"orderStatus":101},'加载中', function(res){
      if(!res.data){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      let isShow = false;
      if(res.data.length>0){
        isShow = true;
      }
      that.setData({
        orderList:res.data,
        isShow
      });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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