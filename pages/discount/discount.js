var httpUtil = require('../../utils/httpUtil');
var commonUtils = require('../../utils/util');
var config = httpUtil.config;
Page({
  data: {
    indicatorDots: true,
    indicatorColor: '#fff',
    indicatorActiveColor: '#07c160',
    autoplay: true,
    interval: 5000,
    duration: 500,
    swipersArr: [],
    phoneNumber: '',
    btnFlag: false,
    swipersArr:[],
    quanyiArr:[]
  },
  // 产品列表
  getXuniaList:function(){
    var url = config.reqUrl + '/v1/product/qy-index.do';
    commonUtils.request(url, 'get', {group:8}, '',(res)=>{
      let getList = res.data.body.products;
      let lunboArr = res.data.body.banners;
      if(getList.length == 0){
        wx.showToast({
          title: '暂无折扣商品',
          icon: 'none',
          duration: 1000
        })
        return 
      }
      this.setData({
        quanyiArr:getList,
        swipersArr:lunboArr
      })
    })

  },
  onLoad: function (options) {
    this.getXuniaList();
  },
  nowBuy: function (e) {
    let that = this;
    let getchoseItem = e.currentTarget.dataset.detail;
    console.log(getchoseItem)
    if(getchoseItem){
      getchoseItem = encodeURIComponent(JSON.stringify(getchoseItem));
    }
    wx.navigateTo({
        url: `/pages/discountDetail/discountDetail?detail=${getchoseItem}`
    })
  },
  changePhone: function () {//切换手机
    this.setData({
      phoneNumber: ''
    })
  },
  changePhone: function () {//切换手机
    this.setData({
      phoneNumber: ''
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