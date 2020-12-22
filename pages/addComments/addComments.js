const httpUtil = require('../../utils/httpUtil.js');
const app = getApp()
Page({
  data: {
    max: 150,
    currentWordNumber: 0,
    imgUrl: [],
    orderInfo: '',
    productInfo: '',
    orderArray: [],
    onepart: 0,
    twopart: 5,
    showConfirm: false,
    autoFocus: false,
    getOrderCode: '',
    getProductid: '',
    getNormalid: '',
    postImg: ''
  },
  onLoad: function (options) {
    let productObj;
    if (options) {
      productObj = JSON.parse(decodeURIComponent(options.postObj));
    }
    this.setData({
      getOrderCode: options.getCode,
      getProductid: productObj.productId,
      getNormalid: productObj.productNormId,
      postImg: productObj.thumbnailImgUrl
    })
  },
  playStar: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var onepart;
    if (in_xin === 'use_sc2') {
      onepart = Number(e.currentTarget.id);
    } else {
      onepart = Number(e.currentTarget.id) + this.data.onepart;
    }
    this.setData({
      onepart: onepart,
      twopart: 5 - onepart
    })
  },
  previewimgs: function (e) {
    var currentImg = e.currentTarget.dataset.img;
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接 String
      urls: this.data.imgUrl // 需要预览的图片http链接列表 Array
    })
  },
  //图片上传
  uploadFile: function (e) {
    let that = this;
    if (that.data.imgUrl.length >= 3) {
      wx.showToast({
        title: '最多上传三张凭证',
        icon: 'none',
        duration: 1000
      });
      return;
    };
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://chopshop.weein.cn/busi/minip/uploadFile/img',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            method: 'POST'
          },
          header: {
            'INFOINSIDE': wx.getStorageSync('infoAccess'), //如果需要token的话要传
          },
          success: function (res) {
            if (typeof res.data != Object) {
              res.data = JSON.parse(res.data);
            };
            let imgUrl = that.data.imgUrl
            imgUrl.push(res.data.data)
            that.setData({
              imgUrl
            });
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  //字数限制  
  inputs: function (e) {
    var value = e.detail.value;
    var len = parseInt(value.length); // 获取输入框内容的长度
    this.setData({
      currentWordNumber: len //当前字数  
    });
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      reason: value //当前字数  
    });
  },
  submit: function (e) {
    let that = this;
    if (that.data.onepart == 0) {
      wx.showToast({
        title: '请先对该商品进行评分',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    let imgArr = that.data.imgUrl;
    let imgPost;
    if (imgArr.length > 0) {
      imgPost = JSON.stringify(imgArr);
    } else {
      imgPost = '';
    }
    let getReson = that.data.reason;
    if (!getReson) {
      getReson = "";
    }
    let postObj = {
      comments: getReson,
      score: that.data.onepart,
      imgUrls: imgPost,
      orderCode: that.data.getOrderCode,
      productId: that.data.getProductid,
      normId: that.data.getNormalid
    }
    httpUtil.postData('/minip/commont/minipAdd', postObj, '加载中', function (res) {
      if (res.status != 0) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      wx.showToast({
        title: '评价成功',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.navigateBack();
      }, 1000)
      //传递参数
      // let postId = that.data.getProductid;
      // wx.redirectTo({
      //   url: '/pages/commentsList/commentsList?getCode='+ postId
      // })

    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      })
    })



  }
})