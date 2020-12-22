var httpUtil = require('../../utils/httpUtil');
var commonUtils = require('../../utils/util.js');
var config = httpUtil.config;
Page({
  data: {
    indicatorDots: true,  
    indicatorColor: '#fff',
    indicatorActiveColor: '#07c160',
    autoplay: true,
    interval: 5000,
    duration: 500,
    swipersArr:[],
    noFlag:false
  },
  //产品列表
  getXuniaList:function(){
    var url = config.reqUrl + '/v1/product/qy-index.do';
    commonUtils.request(url, 'get', {group:7}, '',(res)=>{
      let getList = res.data.body.products;
      let lunboArr = res.data.body.banners;
      if(getList.length == 0){
        wx.showToast({
          title: '暂无秒杀商品',
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
    //获取商品
    this.getXuniaList();
  },
  goDetail:function(e){
    let that = this;
    let getchoseItem = e.currentTarget.dataset.detail;
    if(getchoseItem){
      getchoseItem = encodeURIComponent(JSON.stringify(getchoseItem));
    }
    wx.navigateTo({
      url: `/pages/seckillDetail/seckillDetail?detail=${getchoseItem}`
    })
  },
  godiscount:function(){
    wx.navigateTo({
      url: '/pages/discount/discount'
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