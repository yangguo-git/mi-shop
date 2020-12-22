var httpUtil = require('../../utils/httpUtil');
const app = getApp();
Page({
  data: {
    saveCode: '',
    goodsVOList: []
  },
  onLoad: function (options) {
    let that = this;
    let produceCode = options.getCode;
    that.setData({
      saveCode: options.getCode
    })
    //请求数据
    httpUtil.getData('/minip/order/code', {
      orderCode: produceCode
    }, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      console.log(res.data)
      let getArrs = res.data.goodsVOList;
      let goodsVOListArr = [];
      getArrs.forEach(function (obj) {
        httpUtil.getData('/minip/commont/isCommont', {
          productId: obj.productId,
          orderCode: res.data.orderCode
        }, '加载中', function (res) {
          if (!res.data) {
            // wx.showToast({
            //   title: '',
            //   icon: 'none',
            //   duration: 1000
            // });
            obj.isComment = res.data;
            goodsVOListArr.push(obj);
            that.setData({
              goodsVOList: goodsVOListArr
            })
            return;
          };
          //不为零时
          obj.isComment = res.data;
          goodsVOListArr.push(obj);
          that.setData({
            goodsVOList: goodsVOListArr
          })
        }, function (res) {
          wx.showToast({
            title: res.msg || '系统繁忙，请稍候再试',
            icon: 'none',
            duration: 1000
          });
        })
      })


    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })

  },
  goStar: function (eve) { //评价
    let getCode = this.data.saveCode;
    let eveObj = eve.currentTarget.dataset;
    let postObj = {
      productId: eveObj.productid,
      productNormId: eveObj.productnormid,
      thumbnailImgUrl: eveObj.url
    }
    postObj = JSON.stringify(postObj);
    wx.navigateTo({
      url: '/pages/addComments/addComments?postObj=' + encodeURIComponent(postObj) + '&getCode=' + getCode
    })
  },
  lookStar: function (eve) { //查看评价
    console.log(eve)
    let getCode = this.data.saveCode;
    let getIds = eve.currentTarget.dataset.productid;
    // wx.navigateTo({
    //   url: '/pages/commentsDetail/commentsDetail?getCode='+ getCode + "&dactId=" + getIds
    //  })
    wx.redirectTo({
      url: '/pages/commentsList/commentsList?getCode=' + getIds
    })

  },
  onReady: function () {

  },
  onShow: function () {

  }
})