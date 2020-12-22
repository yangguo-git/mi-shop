var httpUtil = require('../../utils/httpUtil');
Page({
  data: {
    isActive: 0,
    imageNum: 3,
    saveCode: '',
    pageNo: 1,
    allComentArr: [],
    totalNum: 0,
    commentNum: 0,
    isnoComment: false,
    currentPage: 1,
    nomoreFlag: false
  },
  onLoad: function (options) {
    let productId = options.getCode;
    // this.requestComment(1, 0, productId);
    this.setData({
      saveCode: productId
    })
  },
  requestComment: function (pageNo, type, productId) { // 0全部  1 有图
    let that = this;
    let comonObj = {
      pageNo: pageNo,
      pageSize: '10',
      productId: productId,
      type: type
    }
    httpUtil.getData('/minip/commont/getMinipList', comonObj, '加载中', function (res) {
      if (!res.data) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
        //let infoAccess = wx.getStorageSync('infoAccess');
        wx.navigateTo({
          url: "/pages/logs/logs"
        })
        return;
      };
      //获取全部评价
      let allObj = res.data;
      let allComments = res.data.list;
      let setBoolean;
      if (allComments.length > 0) {
        setBoolean = false;
      } else {
        setBoolean = true;
      }
      that.setData({
        totalNum: allObj.total,
        allComentArr: allComments,
        isnoComment: setBoolean
      })
    }, function (res) {
      wx.showToast({
        title: res.msg || '系统繁忙，请稍候再试',
        icon: 'none',
        duration: 1000
      });
    })
  },
  changeEvent: function (e) {
    var getStatus = e.currentTarget.dataset;
    let productId = this.data.saveCode;
    if (getStatus.status == 1) { //图
      this.requestComment(1, 1, productId);
      this.setData({
        isActive: getStatus.status,
        nomoreFlag:false
      })
    } else { //全部
      this.requestComment(1, 0, productId);
      this.setData({
        isActive: getStatus.status,
        nomoreFlag:false
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
  gocommentDetail: function (eve) {
    //保存选中的状态
    let that = this;
    wx.setStorageSync('isActive',that.data.isActive);
    let getDactid = eve.currentTarget.dataset.dactid;
    let getCode = eve.currentTarget.dataset.code;
    let selfid = eve.currentTarget.dataset.selfid;
    wx.navigateTo({
      url: '/pages/commentsDetail/commentsDetail?dactId=' + getDactid + '&getCode=' + getCode + '&selfid=' + selfid
    })
  },
  manageStr: function (str) {
    let postStr;
    if (str) {
      postStr = str.substr(0, 1) + '****' + str.substr(str.split('').length - 1, str.split('').length);
    }
    return postStr;
  },
  onShow: function () {
    let productId = this.data.saveCode;
    this.requestComment(1, 0, productId);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onReachBottom: function () {
    let that = this;
    let productId = that.data.saveCode;
    let totalPages = Math.ceil(that.data.totalNum / 10);
    let getFlags = that.data.isActive; // 1   图    0  全部
    if (that.data.currentPage >= totalPages) {
      that.setData({
        nomoreFlag: true
      })
    } else {
      that.data.currentPage++;
      let comonObj = {
        pageNo: that.data.currentPage,
        pageSize: '10',
        productId: productId,
        type: getFlags
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
        //获取全部评价
        let allComments = res.data.list;
        that.setData({
          allComentArr: [...that.data.allComentArr, ...res.data.list]
        })
      }, function (res) {
        wx.showToast({
          title: res.msg || '系统繁忙，请稍候再试',
          icon: 'none',
          duration: 1000
        });
      })

    }

  }
})