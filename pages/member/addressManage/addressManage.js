// pages/member/addressManage/addressManage.js
var httpUtil = require('../../../utils/httpUtil');
var Util = require('../../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   * isCenter 是否从个人中心页进入
   */
  data: {
    addressList:[],
    isCenter:'',
    isShowInfo:false
  },
  editRess:function(e){
    let id = e.currentTarget.dataset.id;
    let getisCenter = this.data.isCenter;
    wx.navigateTo({
      url: '/pages/member/editAddress/editAddress?id=' + id +'&isCenter=' + getisCenter,
    })
  },
  addRessLoad:function(getCenter){
    let that = this;
    httpUtil.getData('/minip/address', {},'加载中', function(res){
      if(!res.data){
        if(res.status == "20002"){
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
          wx.redirectTo({
            url: "/pages/logs/logs?id=8&isCenter=" + getCenter
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
      let isShowInfo = false;
      if(res.data.length > 0){
        isShowInfo = true;
      };
      that.setData({
        isShowInfo
      });
      for(var i = 0;i<res.data.length;i++){
        res.data[i].phone = Util.formatPhone(res.data[i].phone);
      };
      that.setData({
        addressList:res.data
      });
    }, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1000
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isCenter:options.isCenter
    })
    let getCenter = options.isCenter;
    this.addRessLoad(getCenter);
  },
  addRess:function(e){
    let getisCenter = this.data.isCenter;
    wx.navigateTo({
      url: '/pages/member/saveAddress/saveAddress?isCenter=' + getisCenter,
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
    let addRessStatus = app.globalData.boo
    let getCenter = this.data.isCenter;
    if(addRessStatus){
      this.addRessLoad(getCenter);
    };
    getApp().globalData.boo = false;
  },
  chooseAddres:function(e){
    let getisCenter = this.data.isCenter;
    if(this.data.isCenter == 1){
      let addRessId = e.currentTarget.dataset.id;
      getApp().globalData.boo = true;
      getApp().globalData.addRessId = addRessId;
      wx.navigateBack();
    }else{
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/member/editAddress/editAddress?id=' + id +'&isCenter=' + getisCenter,
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
  // onShareAppMessage: function () {

  // }
})