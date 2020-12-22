Page({
  data: {
    markValue:'',
    currentWordNumber:0,
    showConfirm:false,
    autoFocus:true
  },
  inputs:function(e){
   var value = e.detail.value;
   var len = parseInt(value.length);// 获取输入框内容的长度
   this.setData({
     currentWordNumber: len, //当前字数  
     markValue:value
   });
   //最多字数限制
   if (len > this.data.max) return;
   // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
   this.setData({
    markValue: value //当前字数  
   });
  },
  sureMark:function(){
    let that = this;
    let getValue = that.data.markValue;
    if(getValue == ''){
      wx.showToast({
        title:'请填写备注信息',
        icon: 'none',
        duration: 1000
      })
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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