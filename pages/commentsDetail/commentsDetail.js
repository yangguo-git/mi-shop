const httpUtil = require('../../utils/httpUtil.js');
const app = getApp()
Page({
  data: {
    isShaow: false,
    showConfirm: false,
    wordLen: '',
    textValue: '',
    noComment: false,
    autoFocus: false,
    cursorSpacing: 0,
    autoHeight: true,
    botHeight: 0,
    saveCode: '',
    saveId: '',
    adaption:''
  },
  // 生命周期函数
  requestComment: function (pageNo, type, productId) { // 0全部  1 有图
    let that = this;
    let comonObj = {
      pageNo: pageNo,
      pageSize: '10',
      productId: productId,
      type: type
    }
    httpUtil.getData('/minip/commont/getMinipList', comonObj, '', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };
      //获取全部
      let allObj = res.data;
      let allComments = res.data.list;
      //筛选原评价
      let getcurrentCode = that.data.saveCode;
      let getCurrentid = that.data.selfid;
      let getCurrentObj;
      allComments.forEach(function (obj) {
        if (getcurrentCode == obj.orderCode && getCurrentid == obj.id) {
          getCurrentObj = obj;
        }
      })
      console.log(getCurrentObj, 'getCurrentObj')
      that.setData({
        totalNum: allObj.total,
        allComentArr: allComments,
        getCurrentObj: getCurrentObj
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      saveId: options.dactId, //商品id
      saveCode: options.getCode,
      selfid: options.selfid
    })
    //获取评论相关
    that.requestComment(1, 0, options.dactId);

    //设备信息
    wx.getSystemInfo({
      success: function (res) {
        var rpx = res.windowWidth/375;
        that.setData({
          adaption:rpx
        })
      }
    })
    //获取商品信息
    let bijiaoProduct = options.dactId;
    httpUtil.getData('/minip/order/code', {
      orderCode: options.getCode
    }, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        return;
      };

      let getAllList = res.data.goodsVOList;
      let bijiaoArr = [];
      getAllList.forEach(function (obj) {
        if (bijiaoProduct == obj.productId) {
          bijiaoArr.push(obj)
        }
      })
      that.setData({
        orderInfo: res.data,
        goodsVOList: bijiaoArr
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  pictureview: function (e) {

  },
  deleteComment:function(e){//删除评论
    let that=this;
    let getSelf = e.currentTarget.dataset.self;
    console.log(getSelf,'id');
    httpUtil.getData('/minip/commont/update', {
      id:getSelf,
      status:9
    }, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        // return;
      };
      //刷新
      let getObj = that.data.getCurrentObj;
      that.requestComment(1, 0, getObj.productId);
      
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
    
  },
  alertEvetn: function () {
    this.setData({
      isShaow: true
    })
  },
  cancelEvent: function () { //取消
    this.setData({
      isShaow: false,
      botHeight: 0
    })
  },
  preventEvent: function () { //预览
    this.setData({
      isShaow: true
    })
  },
  inputsComent: function (e) { //输入评论
    let that = this;
    var value = e.detail.value;
    var len = parseInt(value.length); // 获取输入框内容的长度
    that.setData({
      wordLen: len,
      textValue: value
    })
  },
  submitComent: function (e) { //点击发送
    let that = this;
    let getflag = e.currentTarget.dataset.id;
    let getShaiobj = that.data.getCurrentObj;
    let postObj = {
      comments: that.data.textValue,
      score: '',
      imgUrls: '',
      orderCode: getShaiobj.orderCode,
      productId: getShaiobj.productId,
      normId: getShaiobj.normId,
      parentId: getShaiobj.id
    }
    if (getflag == 1) { //有内容
      that.setData({
        isShaow: false,
        wordLen: 0,
        textValue: ''
      })
      //发请求
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
        // wx.navigateBack();
        that.requestComment(1, 0, getShaiobj.productId);//刷新
      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        })
      })

    }
  },
  focusEvent: function (event) {
    this.setData({
      botHeight: event.detail.height
      // botHeight: event.detail.height+10
    })
  },
  boardheightchange: function (event) {
    if (event.detail.height == 0) {
      this.setData({
        botHeight: 0
      })
    }
  },
  pictureview: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  noneEnoughPeople: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  }
})