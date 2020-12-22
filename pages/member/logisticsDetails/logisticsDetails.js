// pages/member/logisticsDetails/logisticsDetails.js
const httpUtil = require('../../../utils/httpUtil');
Page({

  /**
   * 页面的初始数据
   */
  data:{
        expresslist: [],//物流详情列表 ,
        expresssObj:'',//物流状态
        showexpress:false
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let orderId = options.orderId || '20200528153212464557';
    httpUtil.getData('/minip/delivery/orderCode', {"orderCode":orderId},'加载中', function(res){
     
      if(!res.data){
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      //获取物流信息相关
      let logistList = res.data.list;
      if(logistList.length == 0){

      }else{
        that.setData({
          expresslist:logistList,
          expresssObj:res.data
        })
      }
      console.log(res.data.list,'111111');
    }, function(res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
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