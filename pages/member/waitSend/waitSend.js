var httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    orderList:'',
    isShow:false
  },
  onLoad: function (options) {
    let that = this;
    httpUtil.getData('/minip/order', {"orderStatus":301},'加载中', function(res){
      if(!res.data){//开始
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
        //结束
        return;
      };
      let isShow = false;
        if(res.data.length>0){
          isShow = true;
          console.log(res.data);
        }
        that.setData({
          orderList:res.data,
          isShow:isShow
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
    let orderCode = e.currentTarget.dataset.id;
    let flagMark = e.currentTarget.dataset.mark;
    wx.navigateTo({
      url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode + '&flagMark=' + flagMark,
    })
  },
  cancelOrder:function(e){//取消订单
    let orderCode = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '订单还未付款,确定要取消吗?',
      cancelText:'取消订单',
      confirmText:'再考虑下',
      confirmColor:'#07c160',
      success: function (res) {
        if (res.confirm) {
          
        }
      }
    })

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
    let isBoo = app.globalData.boo;
      httpUtil.getData('/minip/order', {"orderStatus":301},'加载中', function(res){
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
      },1)
  }
})