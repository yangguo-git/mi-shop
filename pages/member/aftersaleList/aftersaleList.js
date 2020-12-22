const httpUtil = require('../../../utils/httpUtil');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    httpUtil.getData('/minip/order', {},'加载中', function(res){
      if(!res.data){
        // wx.showToast({
        //   title: res.msg || '系统繁忙，请稍候再试',
        //   icon: 'none',
        //   duration: 1000
        // })
        //开始
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
      }
      let allOrders = res.data;
      let filterArr = [];
      //筛选出401和402状态
      allOrders.forEach(function(objs){
        if(objs.orderStatus == "401" || objs.orderStatus == "402"){
          filterArr.push(objs)
        }
      })
      let isShow = false;
        // if(res.data.length>0){
        //   isShow = true;
        // }
        //
        if(filterArr.length>0){
          isShow = true;
        }
        that.setData({
          orderList:filterArr,
          isShow
        });
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    })
  },
  lookDetail:function(e){
    let orderCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/detailOrider/detailOrider?orderId=' + orderCode,
    })
  },
  afterServer:function(e){
    let orderCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/aftersaleService/aftersaleService?orderId=' + orderCode,
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
    if(isBoo){
      httpUtil.getData('/minip/order', {},'加载中', function(res){
        if(!res.data){
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          })
          return;
        }
        let allOrders = res.data;
        let filterArr = [];
        //筛选出401和402状态
        allOrders.forEach(function(objs){
          if(objs.orderStatus == "401" || objs.orderStatus == "402"){
            filterArr.push(objs)
          }
        })
        let isShow = false;
        // if(res.data.length>0){
        //   isShow = true;
        // }
        // 
        if(filterArr.length>0){
          isShow = true;
        }
        that.setData({
          orderList:filterArr,
          isShow
        });
      }, function(res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      })
    }
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